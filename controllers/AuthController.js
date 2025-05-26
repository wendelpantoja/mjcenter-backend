const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/user")

const SECRET = process.env.JWT_SECRET;

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          role: usuario.role,
          nome: usuario.nome,
          email: usuario.email,
        },
        SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }

  async registerAdmin(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuarioExiste = await Usuario.findOne({ where: { email } });
      if (usuarioExiste) {
        return res.status(400).json({ mensagem: 'Email já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha_hash: senhaHash,
        role: 'admin',
      });

      return res.status(201).json({
        mensagem: 'Usuário admin criado com sucesso.',
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          role: novoUsuario.role,
        },
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }
}

module.exports = new AuthController();
