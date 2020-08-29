const jwt = require('jsonwebtoken');

// ======================
// Verificar Token
// ======================

const verificaToken = (req, res, next) => {
  const Authorization = req.get('Authorization');

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

module.exports = {
  verificaToken,
  verificaAdminRole,
};
