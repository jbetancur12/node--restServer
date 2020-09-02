const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {
  const { tipo, id } = req.params;
  console.log(tipo, id);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningún archivo',
      },
    });
  }

  //Valida Tipo
  const tiposValidos = ['productos', 'usuarios'];
  if (tiposValidos.indexOf(tipo) === -1) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son: ' + tiposValidos.join(', '),
      },
    });
  }

  const archivo = req.files.archivo;
  const nombreCortado = archivo.name.split('.');
  const extension = nombreCortado[nombreCortado.length - 1];

  //Extensiones permitidas
  const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extension) === -1) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          'Las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extension,
      },
    });
  }

  //Cambiar nombre al archivo
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err)
      return res.status(500).json({
        ok: false,
        err,
      });

    //Aqui, Imagen Cargada
    switch (tipo) {
      case 'usuarios':
        imagenUsuario(id, res, nombreArchivo);
        break;
      case 'productos':
        imagenProducto(id, res, nombreArchivo);
        break;
      default:
        break;
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe',
        },
      });
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe',
        },
      });
    }

    console.log(productoDB);

    borrarArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borrarArchivo(nombreImg, tipo) {
  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

  if (fs.existsSync(pathImg)) {
    fs.unlinkSync(pathImg);
  }
}

module.exports = app;
