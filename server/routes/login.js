const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {
  const { body } = req;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '-Usuario- y/o Contraseña incorrectos',
        },
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario y/o -Contraseña- incorrectos',
        },
      });
    }

    const token = jwt.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN },
    );

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

//COnfigiraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post('/google', async (req, res) => {
  const token = req.body.idtoken;
  const googleUser = await verify(token).catch((err) => {
    return res.status(403).json({
      ok: false,
      err,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (usuarioDB) {
      if (usuario.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe usar su autenticacion normal',
          },
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN },
        );
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      //Si el usuario no existe en nuestra base de datos
      const usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign(
          {
            usuario: usuarioDB,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN },
        );
        return res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });

  // res.json({ usuario: googleUser });
});

module.exports = app;
