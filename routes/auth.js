const express = require("express")
const router = express.Router()
const Auth = require("../controllers/AuthController")
const autenticarToken = require("../middlewares/authMiddleware")


router.post("/auth/login", Auth.login);
router.post('/auth/register-admin', autenticarToken, Auth.registerAdmin);


module.exports = router