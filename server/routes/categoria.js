const express = require('express');

const {
  verificaToken,
  verificaAdminRole,
} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// ============================
// Listar Categorias
// ============================
app.get('/categoria', (req, res) => {
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Categoria.countDocuments((err, conteo) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo,
        });
      });
    });
});

// ============================
// Listar Categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
  const { id } = req.params;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        message: 'El ID no es correcto',
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ============================
// crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
  // regresa la nueva categoria
  // req.usuario._id
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

// ============================
// Actualizar categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const descCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categoriaDB,
      });
    },
  );
});

// ============================
// Eliminar categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  const { id } = req.params;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no Existe',
        },
      });
    }
    res.json({
      ok: true,
      message: 'Categoria Borrada',
    });
  });
  // .findByAndRemove
});

module.exports = app;
