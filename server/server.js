require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));



// mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Base de datos online!!!');
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('Base de datos online!!!');
// });

mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useNewUrlParser: true, })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err.message);
    });

// mongoose.connect('mongodb://localhost:2701/cafe', { useUnifiedTopology: true, useNewUrlParser: true, }, (err, res) => {
//     if (err) {
//         throw err.message;
//     }
//     console.log('Base de datos online!!!');
// });



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});