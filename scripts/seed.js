/**
 * Seed script — genera datos de prueba realistas para el dashboard.
 * Uso: node scripts/seed.js
 *
 * Crea:
 *   - 1 proveedor (email: proveedor@demo.com  /  pass: demo1234)
 *   - 6 servicios de peluquería / estética
 *   - 50 clientes con nombres argentinos
 *   - ~300 turnos distribuidos en los últimos 12 meses
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// ─── cargar .env ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('No se encontró el archivo .env en gestor-turnos-backend/');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const MONGO_URI = process.env.MONGODB;
const DB_NAME   = 'gestorTurnos';

if (!MONGO_URI) {
  console.error('MONGODB no definido en .env');
  process.exit(1);
}

// ─── schemas inline (mínimos) ─────────────────────────────────────────────────
const { Schema, model, Types } = mongoose;

const UserSchema = new Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },
    phone:        { type: String, required: true, unique: true },
    role:         { type: String, enum: ['provider', 'client', 'user', 'admin'], default: 'user' },
    providerData: { type: Schema.Types.Mixed },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

const ServicioSchema = new Schema(
  {
    nombre:       { type: String, required: true },
    duracion:     { type: Number, required: true },
    precio:       { type: Number, required: true },
    proveedorId:  { type: Types.ObjectId, ref: 'User', required: true },
    requiereSeña: { type: Boolean, default: false },
    montoSeña:    { type: Number, default: 0 },
    categoria:    { type: String, required: true },
    description:  { type: String, default: '' },
  },
  { timestamps: true },
);

const TurnoSchema = new Schema(
  {
    fecha:       { type: Date, required: true },
    horaInicio:  { type: String, required: true },
    estado:      { type: String, enum: ['pendiente', 'confirmado', 'cancelado', 'completado'], default: 'pendiente' },
    notas:       { type: String },
    proveedorId: { type: Types.ObjectId, ref: 'User', required: true },
    servicioId:  { type: Types.ObjectId, ref: 'Servicio', required: true },
    clienteId:   { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

// ─── datos de prueba ──────────────────────────────────────────────────────────
const SERVICIOS_DEMO = [
  { nombre: 'Corte de cabello',  duracion: 45,  precio: 3500,  categoria: 'Cabello',   description: 'Corte clásico con tijera y máquina' },
  { nombre: 'Coloración global', duracion: 120, precio: 8500,  categoria: 'Cabello',   description: 'Coloración completa con tinte profesional' },
  { nombre: 'Balayage premium',  duracion: 150, precio: 12000, categoria: 'Cabello',   description: 'Técnica de iluminación degradada' },
  { nombre: 'Manicura gel',      duracion: 60,  precio: 2800,  categoria: 'Uñas',      description: 'Manicura con esmalte semipermanente' },
  { nombre: 'Pedicura spa',      duracion: 75,  precio: 3200,  categoria: 'Uñas',      description: 'Tratamiento completo de pies' },
  { nombre: 'Depilación cejas',  duracion: 20,  precio: 1500,  categoria: 'Depilación', description: 'Diseño y depilación de cejas' },
];

const NOMBRES = [
  'Lucía Fernández', 'Martina Rodríguez', 'Valentina López', 'Sofía González',
  'Camila Martínez', 'Florencia García', 'Agustina Pérez', 'Julieta Díaz',
  'Micaela Sánchez', 'Romina Torres', 'Daniela Flores', 'Carolina Ruiz',
  'Natalia Morales', 'Verónica Castro', 'Jimena Ortega', 'Alejandra Medina',
  'Paula Ramos', 'Gabriela Herrera', 'Silvina Vargas', 'Lorena Gutiérrez',
  'Mauro Álvarez', 'Santiago Romero', 'Gonzalo Reyes', 'Facundo Navarro',
  'Nicolás Torres', 'Ignacio Molina', 'Matías Jiménez', 'Leandro Silva',
  'Diego Moreno', 'Ezequiel Suárez', 'Rodrigo Acosta', 'Tomás Vega',
  'Sebastián Mendoza', 'Agustín Ríos', 'Cristian Guerrero', 'Fernando Soto',
  'Pablo Herrera', 'Ricardo Pizarro', 'Hernán Domínguez', 'Emilio Vera',
  'Ana Cabrera', 'Laura Aguirre', 'Claudia Ponce', 'Andrea Rojas',
  'Cecilia Benitez', 'Patricia Ibáñez', 'Rosa Delgado', 'Elena Moya',
  'Julia Peralta', 'Marcela Cano',
];

const HORAS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
               '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

// Distribución de turnos por mes (últimos 12 meses, índice 0 = hace 11 meses)
const DIST_MENSUAL = [12, 15, 18, 14, 20, 22, 17, 25, 28, 30, 26, 35];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function estadoAleatorio(esPasado) {
  if (!esPasado) return randomItem(['pendiente', 'confirmado']);
  const r = Math.random();
  if (r < 0.72) return 'completado';
  if (r < 0.87) return 'cancelado';
  if (r < 0.95) return 'confirmado';
  return 'pendiente';
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔗 Conectando a MongoDB…');
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log('✅ Conectado a', DB_NAME);

  const UserModel     = model('User', UserSchema);
  const ServicioModel = model('Servicio', ServicioSchema);
  const TurnoModel    = model('Turno', TurnoSchema);

  // ── limpiar datos de seed anteriores ────────────────────────────────────────
  const proveedorExistente = await UserModel.findOne({ email: 'proveedor@demo.com' });
  if (proveedorExistente) {
    const pid = proveedorExistente._id;
    const borradosTurnos    = await TurnoModel.deleteMany({ proveedorId: pid });
    const borradosServicios = await ServicioModel.deleteMany({ proveedorId: pid });
    console.log(`🗑️  Eliminados ${borradosTurnos.deletedCount} turnos y ${borradosServicios.deletedCount} servicios del seed anterior`);
    await UserModel.deleteOne({ _id: pid });
  }

  // ── proveedor ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const proveedor = await UserModel.create({
    name:     'María García',
    email:    'proveedor@demo.com',
    password: passwordHash,
    phone:    '1100000001',
    role:     'provider',
    providerData: {
      address:        'Av. Corrientes 1234, CABA',
      serviceType:    'Peluquería y Estética',
      minimumAdvance: 60,
      publicInfo:     'Peluquería profesional con más de 10 años de experiencia.',
      mpConnected:    false,
    },
  });
  console.log(`👤 Proveedor creado: ${proveedor.email}`);

  // ── clientes ─────────────────────────────────────────────────────────────────
  const clientesDocs = await UserModel.insertMany(
    NOMBRES.map((nombre, i) => ({
      name:     nombre,
      email:    `cliente${i + 1}@demo.com`,
      password: passwordHash,
      phone:    `110000${String(i + 100).padStart(4, '0')}`,
      role:     'client',
    })),
  );
  console.log(`👥 ${clientesDocs.length} clientes creados`);

  // ── servicios ────────────────────────────────────────────────────────────────
  const serviciosDocs = await ServicioModel.insertMany(
    SERVICIOS_DEMO.map(s => ({ ...s, proveedorId: proveedor._id })),
  );
  console.log(`✂️  ${serviciosDocs.length} servicios creados`);

  // ── turnos ───────────────────────────────────────────────────────────────────
  const ahora = new Date();
  const turnos = [];

  DIST_MENSUAL.forEach((cantidad, mesOffset) => {
    // mesOffset 0 = hace 11 meses, 11 = mes actual
    const mesesAtras = 11 - mesOffset;
    const año  = ahora.getFullYear();
    const mes  = ahora.getMonth() - mesesAtras;
    const fechaBase = new Date(año, mes, 1);
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const esMesActual = mesesAtras === 0;

    for (let i = 0; i < cantidad; i++) {
      const dia  = randomInt(1, esMesActual ? ahora.getDate() : diasEnMes);
      const fecha = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), dia);
      const esPasado = fecha < ahora;

      turnos.push({
        fecha,
        horaInicio:  randomItem(HORAS),
        estado:      estadoAleatorio(esPasado),
        proveedorId: proveedor._id,
        servicioId:  randomItem(serviciosDocs)._id,
        clienteId:   randomItem(clientesDocs)._id,
      });
    }
  });

  await TurnoModel.insertMany(turnos);
  console.log(`📅 ${turnos.length} turnos creados`);

  // ── resumen ──────────────────────────────────────────────────────────────────
  const porEstado = turnos.reduce((acc, t) => {
    acc[t.estado] = (acc[t.estado] || 0) + 1;
    return acc;
  }, {});

  console.log('\n─── Seed completado ───────────────────────────────────');
  console.log('  Email proveedor : proveedor@demo.com');
  console.log('  Contraseña      : demo1234');
  console.log('  Turnos por estado:', porEstado);
  console.log('───────────────────────────────────────────────────────\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error en el seed:', err);
  mongoose.disconnect();
  process.exit(1);
});
