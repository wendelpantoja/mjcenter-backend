const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET; // Depois movemos pro .env

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Espera formato: Bearer token

  if (!token) {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Disponibiliza dados do token nas próximas funções
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = autenticarToken;
