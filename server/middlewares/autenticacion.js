const jwt = require('jsonwebtoken');

// ======================
// Verificar Token
// ======================

const verificaToken = (req, res, next) => {
  const Authorization = req.get('Authorization');
  console.log(Authorization);
  jwt.verify(Authorization, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no Valido',
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// ======================
// Verificar Admin Role
// ======================

const verificaAdminRole = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'Necesita Permisos de Administrador',
      },
    });
  }
};

// ======================
// Verificar Token img
// ======================

const verificaTokenImg = (req, res, next) => {
  const { token } = req.query;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no Valido',
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg,
};
