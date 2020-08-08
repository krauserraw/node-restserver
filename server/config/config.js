// Puerto
process.env.PORT = process.env.PORT || 8090

// Base de Datos
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:2013Claire@cluster0.doesx.mongodb.net/<dbname>?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;