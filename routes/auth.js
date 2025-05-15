const express = require("express")
const router = express.Router()
const Auth = require("../controllers/ControllerAuth")


router.get("/api/login", Auth.login);


module.exports = router