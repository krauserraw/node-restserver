// Puerto
process.env.PORT = process.env.PORT || 8090

// Base de Datos
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Vencimiento del Token
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// google autenticación
process.env.CLIENT_ID = process.env.CLIENT_ID || '927273818071-6fvfc9j6d009gk3hbie3n7af7o4n0li0.apps.googleusercontent.com'