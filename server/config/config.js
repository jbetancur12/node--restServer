// ==================================
// Puerto
// ==================================
process.env.PORT = process.env.PORT || 3000;

// ==================================
// Entorno
// ==================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27027/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;
