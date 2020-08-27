require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('./routes/usuario'));

mongoose.connect(
  process.env.urlDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw console.log(err);

    console.log('Base de Datos ONLINE');
  },
);

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto:${process.env.PORT}`);
});
