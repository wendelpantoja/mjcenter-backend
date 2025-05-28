const bcrypt = require('bcrypt');
const Usuario = require("../models/user");

class UserController {
 
  async register(req, res) {
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
        role: 'user',
      });

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso.',
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

  async listarUsuarios(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'email', 'role']
      });

      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }

  async buscarPorId(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ['id', 'nome', 'email', 'role']
      });

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }

  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, email } = req.body;

    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;

      await usuario.save();

      return res.json({
        mensagem: 'Usuário atualizado com sucesso.',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }

  async alterarSenha(req, res) {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha_hash);

      if (!senhaCorreta) {
        return res.status(400).json({ mensagem: 'Senha atual incorreta.' });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      usuario.senha_hash = novaSenhaHash;

      await usuario.save();

      return res.json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }

  async deletar(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      }

      await usuario.destroy();

      return res.json({ mensagem: 'Usuário deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
  }
}

module.exports = new UserController();
