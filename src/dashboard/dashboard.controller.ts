import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/presentation/decorators/current-user.decorator.js';
import { Turno } from '../turnos/infrastructure/schemas/turno.schema.js';
import { Servicio } from '../servicios/infrastructure/schemas/servicio.schema.js';
import { User } from '../user/infrastructure/schemas/user.schema.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];



@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    @InjectModel(Turno.name) private readonly turnoModel: Model<Turno>,
    @InjectModel(Servicio.name) private readonly servicioModel: Model<Servicio>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('metrics')
  async getMetrics(@CurrentUser() user: { id: string }) {
    const proveedorId  = new Types.ObjectId(user.id);
    const ahora        = new Date();
    const inicioMes    = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes       = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);
    const inicioAnio   = new Date(ahora.getFullYear(), 0, 1);
    const mesAnteriorInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const mesAnteriorFin    = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59);

    const [
      turnosPorMesRaw,
      serviciosMasPedidosRaw,
      tasaRaw,
      ingresoRaw,
      turnosEsteMes,
      turnosMesAnterior,
      ultimosTurnosRaw,
    ] = await Promise.all([
      // Turnos agrupados por mes (año en curso)
      this.turnoModel.aggregate([
        { $match: { proveedorId, fecha: { $gte: inicioAnio } } },
        { $group: { _id: { $month: '$fecha' }, cantidad: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 servicios más pedidos (todos los tiempos)
      this.turnoModel.aggregate([
        { $match: { proveedorId } },
        { $group: { _id: '$servicioId', cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'servicios', localField: '_id', foreignField: '_id', as: 'srv' } },
        { $unwind: '$srv' },
        { $project: { _id: 0, nombre: '$srv.nombre', cantidad: 1 } },
      ]),

      // Tasa de asistencia (completado vs cancelado, histórico)
      this.turnoModel.aggregate([
        { $match: { proveedorId, estado: { $in: ['completado', 'cancelado'] } } },
        { $group: { _id: '$estado', count: { $sum: 1 } } },
      ]),

      // Ingreso estimado: suma de precios de servicios en turnos completados este mes
      this.turnoModel.aggregate([
        { $match: { proveedorId, estado: 'completado', fecha: { $gte: inicioMes, $lte: finMes } } },
        { $lookup: { from: 'servicios', localField: 'servicioId', foreignField: '_id', as: 'srv' } },
        { $unwind: '$srv' },
        { $group: { _id: null, total: { $sum: '$srv.precio' } } },
      ]),

      // Cantidad de turnos este mes
      this.turnoModel.countDocuments({ proveedorId, fecha: { $gte: inicioMes, $lte: finMes } }),

      // Cantidad de turnos mes anterior (para el badge de comparación)
      this.turnoModel.countDocuments({ proveedorId, fecha: { $gte: mesAnteriorInicio, $lte: mesAnteriorFin } }),

      // Últimos 8 turnos con datos de cliente y servicio
      this.turnoModel.aggregate([
        { $match: { proveedorId } },
        { $sort: { fecha: -1 } },
        { $limit: 8 },
        { $lookup: { from: 'users',     localField: 'clienteId',  foreignField: '_id', as: 'cliente'  } },
        { $lookup: { from: 'servicios', localField: 'servicioId', foreignField: '_id', as: 'servicio' } },
        { $unwind: { path: '$cliente',  preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$servicio', preserveNullAndEmptyArrays: true } },
        { $project: {
          _id: 1,
          fecha: 1,
          horaInicio: 1,
          estado: 1,
          clienteNombre: '$cliente.name',
          servicioNombre: '$servicio.nombre',
          precio: '$servicio.precio',
        }},
      ]),
    ]);

    // Tasa asistencia
    const completados = tasaRaw.find((d: any) => d._id === 'completado')?.count ?? 0;
    const cancelados  = tasaRaw.find((d: any) => d._id === 'cancelado')?.count  ?? 0;
    const tasaAsistencia = completados + cancelados > 0
      ? Math.round((completados / (completados + cancelados)) * 100)
      : 0;

    // Turnos por mes — rellenar meses sin datos con 0
    const turnosPorMes = MESES.map((mes, i) => {
      const found = turnosPorMesRaw.find((d: any) => d._id === i + 1);
      return { mes, cantidad: found?.cantidad ?? 0 };
    });

    // Variación vs mes anterior
    const variacionMensual = turnosMesAnterior > 0
      ? Math.round(((turnosEsteMes - turnosMesAnterior) / turnosMesAnterior) * 100)
      : null;

    return {
      turnosEsteMes,
      variacionMensual,
      tasaAsistencia,
      ingresoEstimado: ingresoRaw[0]?.total ?? 0,
      turnosPorMes,
      serviciosMasPedidos: serviciosMasPedidosRaw,
      ultimosTurnos: ultimosTurnosRaw,
    };
  }

  @Get('clientes')
  async getClientes(@CurrentUser() user: { id: string }) {
    const proveedorId = new Types.ObjectId(user.id);

    // Todos los clientes únicos que tuvieron al menos un turno con este proveedor,
    // con la cantidad total de turnos y el último turno registrado.
    const clientes = await this.turnoModel.aggregate([
      { $match: { proveedorId } },
      {
        $group: {
          _id: '$clienteId',
          turnosCount: { $sum: 1 },
          ultimoTurno: { $max: '$fecha' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: { path: '$usuario', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: '$usuario.name',
          email: '$usuario.email',
          phone: '$usuario.phone',
          turnosCount: 1,
          ultimoTurno: 1,
        },
      },
      { $sort: { turnosCount: -1 } },
    ]);

    return clientes;
  }
}
