function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso negado. Somente administradores.' });
  }
  next();
};

module.exports = isAdmin;
