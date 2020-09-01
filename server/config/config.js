// ==================================
// Puerto
// ==================================
process.env.PORT = process.env.PORT || 3000;

// ==================================
// Entorno
// ==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==================================
// Vencimiento del Token
// ==================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = '48h';

// ==================================
// SEED de autenticación
// ==================================
process.env.SEED = 60 * 60 * 24 * 30;
process.env.SEED || 'este-es-el-seed-desarrollo';

// ==================================
// Base de Datos
// ==================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ==================================
// Google CLient Id
// ==================================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '1005539633682-p1aj73l526m1s4k99vv6kom0hgl6500p.apps.googleusercontent.com';
