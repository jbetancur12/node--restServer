require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/usuario', (req, res) => {
  res.json('get Usuario');
});

app.post('/usuario', (req, res) => {
  const { body } = req;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      message: 'El nombre es necesario',
    });
  } else {
    res.json({
      body,
    });
  }
});

app.put('/usuario/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    id,
  });
});

app.delete('/usuario', (req, res) => {
  res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto:${process.env.PORT}`);
});
