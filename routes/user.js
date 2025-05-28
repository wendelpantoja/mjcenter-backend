const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.post('/register', authMiddleware, isAdmin, UserController.register);
router.get('/users', authMiddleware, isAdmin, UserController.listarUsuarios);
router.get('/users/:id', authMiddleware, isAdmin, UserController.buscarPorId);
router.put('/users/update/:id', authMiddleware, isAdmin, UserController.atualizar);
router.patch('/users/password/:id', authMiddleware, isAdmin, UserController.alterarSenha);
router.delete('/users/delete/:id', authMiddleware, isAdmin, UserController.deletar);

module.exports = router;
