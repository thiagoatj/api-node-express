function soAdmin(req, res, next) {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  next();
}

module.exports = { soAdmin };

