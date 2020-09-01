const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');

// =======================
// Obtener productos
// =======================
app.get('/productos', verificaToken, (req, res) => {
  //trae todos los productos
  // populate: usuario categoria
  // paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producto.countDocuments({ disponible: true }, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          cuantos: conteo,
        });
      });
    });
});

// =======================
// Obtener producto por ID
// =======================
app.get('/productos/:id', verificaToken, (req, res) => {
  // populate: usuario categoria
  // paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  const { id } = req.params;
  Producto.findById(id)
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          message: 'El ID no es correcto',
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// =======================
// BUscar Prodcutos
// =======================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
  const termino = req.params.termino;

  const regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// =======================
// Crear un nuevo producto
// =======================
app.post('/productos', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado
  const { body } = req;

  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// =======================
// Actualizar un  producto
// =======================
app.put('/productos/:id', verificaToken, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    'nombre',
    'precioUni',
    'descripcion',
    'disponible',
    'categoria',
  ]);

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productoDB,
      });
    },
  );
});

// =======================
// Borrar un  producto
// =======================
app.delete('/productos/:id', verificaToken, (req, res) => {
  const { id } = req.params;

  // Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {

  const cambiaEstado = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, ProductoDeleted) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!ProductoDeleted) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Prodcuto no encontrado',
          },
        });
      }
      res.json({
        ok: true,
        producto: ProductoDeleted,
      });
    },
  );
});

module.exports = app;
