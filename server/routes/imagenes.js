const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
  const { tipo, img } = req.params;

  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(noImagePath);
  }
});

module.exports = app;
