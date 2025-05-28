const express = require("express")
const router = express.Router()
const Clients = require("../controllers/ControllerClients")
const Balance = require("../controllers/ControllerBalance")
const autenticarToken = require("../middlewares/authMiddleware")


router.post("/api/clients", autenticarToken, Clients.getClients);
router.get("/api/clients/balance/:document", autenticarToken, Balance.getBalance);


module.exports = router