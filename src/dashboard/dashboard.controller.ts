import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/presentation/decorators/current-user.decorator.js';
import { Turno } from '../turnos/infrastructure/schemas/turno.schema.js';
import { Servicio } from '../servicios/infrastructure/schemas/servicio.schema.js';
import { User } from '../user/infrastructure/schemas/user.schema.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];



@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    @InjectModel(Turno.name) private readonly turnoModel: Model<Turno>,
    @InjectModel(Servicio.name) private readonly servicioModel: Model<Servicio>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @ApiOperation({ summary: 'Métricas del proveedor: turnos por mes, tasa de asistencia, ingresos, servicios más pedidos' })
  @Get('metrics')
  async getMetrics(@CurrentUser() user: { id: string }, @Query('month') month?: string) {
    const proveedorId  = new Types.ObjectId(user.id);
    const ahora        = new Date();

    // ?month=YYYY-MM permite pedir las métricas de un mes puntual (lo usa el
    // click sobre una barra de "Turnos por mes" en el dashboard). Sin el
    // parámetro, se calcula todo para el mes en curso, como antes.
    const matchMes = month?.match(/^(\d{4})-(0[1-9]|1[0-2])$/);
    const anio     = matchMes ? Number(matchMes[1]) : ahora.getFullYear();
    const mesIndex = matchMes ? Number(matchMes[2]) - 1 : ahora.getMonth();

    const inicioMes    = new Date(anio, mesIndex, 1);
    const finMes       = new Date(anio, mesIndex + 1, 0, 23, 59, 59);
    const inicioAnio   = new Date(anio, 0, 1);
    const mesAnteriorInicio = new Date(anio, mesIndex - 1, 1);
    const mesAnteriorFin    = new Date(anio, mesIndex, 0, 23, 59, 59);

    const [
      turnosPorMesRaw,
      serviciosMasPedidosRaw,
      tasaRaw,
      ingresoRaw,
      turnosEsteMes,
      turnosMesAnterior,
      ultimosTurnosRaw,
    ] = await Promise.all([
      // Turnos agrupados por mes (año del mes consultado)
      this.turnoModel.aggregate([
        { $match: { proveedorId, fecha: { $gte: inicioAnio } } },
        { $group: { _id: { $month: '$fecha' }, cantidad: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 servicios más pedidos del mes consultado
      this.turnoModel.aggregate([
        { $match: { proveedorId, fecha: { $gte: inicioMes, $lte: finMes } } },
        { $group: { _id: '$servicioId', cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'servicios', localField: '_id', foreignField: '_id', as: 'srv' } },
        { $unwind: '$srv' },
        { $project: { _id: 0, nombre: '$srv.nombre', cantidad: 1 } },
      ]),

      // Tasa de asistencia del mes consultado (completado vs cancelado)
      this.turnoModel.aggregate([
        { $match: { proveedorId, estado: { $in: ['completado', 'cancelado'] }, fecha: { $gte: inicioMes, $lte: finMes } } },
        { $group: { _id: '$estado', count: { $sum: 1 } } },
      ]),

      // Ingreso estimado: suma de precios de servicios en turnos completados del mes consultado
      this.turnoModel.aggregate([
        { $match: { proveedorId, estado: 'completado', fecha: { $gte: inicioMes, $lte: finMes } } },
        { $lookup: { from: 'servicios', localField: 'servicioId', foreignField: '_id', as: 'srv' } },
        { $unwind: '$srv' },
        { $group: { _id: null, total: { $sum: '$srv.precio' } } },
      ]),

      // Cantidad de turnos del mes consultado
      this.turnoModel.countDocuments({ proveedorId, fecha: { $gte: inicioMes, $lte: finMes } }),

      // Cantidad de turnos del mes anterior al consultado (para el badge de comparación)
      this.turnoModel.countDocuments({ proveedorId, fecha: { $gte: mesAnteriorInicio, $lte: mesAnteriorFin } }),

      // Últimos 8 turnos del mes consultado, con datos de cliente y servicio
      this.turnoModel.aggregate([
        { $match: { proveedorId, fecha: { $gte: inicioMes, $lte: finMes } } },
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
          // Turnos de invitado no tienen usuario asociado ($cliente.name),
          // así que caemos al nombre guardado en el propio turno.
          clienteNombre: { $ifNull: ['$cliente.name', '$clienteNombre'] },
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
      anio,
      mes: mesIndex + 1,
      turnosEsteMes,
      variacionMensual,
      tasaAsistencia,
      ingresoEstimado: ingresoRaw[0]?.total ?? 0,
      turnosPorMes,
      serviciosMasPedidos: serviciosMasPedidosRaw,
      ultimosTurnos: ultimosTurnosRaw,
    };
  }

  @ApiOperation({ summary: 'Lista de clientes (registrados e invitados) que tuvieron turnos con el proveedor' })
  @Get('clientes')
  async getClientes(@CurrentUser() user: { id: string }) {
    const proveedorId = new Types.ObjectId(user.id);

    // Todos los clientes que tuvieron al menos un turno con este proveedor, tanto
    // registrados como invitados, con la cantidad total de turnos y el último turno.
    //
    // Los turnos de invitado no tienen clienteId: sus datos viven en los campos
    // clienteNombre / clienteEmail / clienteCelular del propio turno. Por eso primero
    // normalizamos la identidad del cliente desde ambas fuentes y recién después
    // agrupamos, usando el email como clave de unificación.
    const clientes = await this.turnoModel.aggregate([
      { $match: { proveedorId } },
      {
        $lookup: {
          from: 'users',
          localField: 'clienteId',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: { path: '$usuario', preserveNullAndEmptyArrays: true } },

      // Del turno más reciente al más antiguo: así los $first de abajo se quedan
      // con el nombre y el teléfono más actualizados de cada cliente.
      { $sort: { fecha: -1 } },

      {
        $addFields: {
          _email: {
            $toLower: {
              $trim: {
                input: { $ifNull: ['$usuario.email', { $ifNull: ['$clienteEmail', ''] }] },
              },
            },
          },
          _emailOriginal: { $ifNull: ['$usuario.email', { $ifNull: ['$clienteEmail', ''] }] },
          _name: { $ifNull: ['$usuario.name', { $ifNull: ['$clienteNombre', ''] }] },
          _phone: { $ifNull: ['$usuario.phone', { $ifNull: ['$clienteCelular', ''] }] },
        },
      },

      // Clave de agrupación: el email normalizado. Si el turno no tiene email
      // (dato incompleto), caemos al clienteId para no perder al cliente.
      {
        $addFields: {
          _key: {
            $cond: [
              { $ne: ['$_email', ''] },
              '$_email',
              { $ifNull: [{ $toString: '$clienteId' }, null] },
            ],
          },
        },
      },

      // Turnos sin ninguna identidad: no hay cliente que mostrar.
      { $match: { _key: { $ne: null } } },

      {
        $group: {
          _id: '$_key',
          name: { $first: '$_name' },
          email: { $first: '$_emailOriginal' },
          phone: { $first: '$_phone' },
          turnosCount: { $sum: 1 },
          ultimoTurno: { $max: '$fecha' },
          // Existe sólo si al menos una de sus reservas fue hecha con cuenta.
          userId: { $max: '$usuario._id' },
        },
      },

      {
        $project: {
          _id: 0,
          id: { $cond: [{ $ifNull: ['$userId', false] }, { $toString: '$userId' }, '$_id'] },
          tipo: { $cond: [{ $ifNull: ['$userId', false] }, 'REGISTRADO', 'INVITADO'] },
          name: 1,
          email: 1,
          phone: 1,
          turnosCount: 1,
          ultimoTurno: 1,
        },
      },

      // Por último turno primero: al proveedor le interesa a quién atendió
      // recientemente, no quién acumula más visitas históricas. Ordenar por
      // turnosCount dejaba a los clientes nuevos al final de la última página.
      { $sort: { ultimoTurno: -1, turnosCount: -1 } },
    ]);

    return clientes;
  }
}
