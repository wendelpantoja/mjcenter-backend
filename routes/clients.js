const express = require("express")
const router = express.Router()
const Clients = require("../controllers/ControllerClients")
const Balance = require("../controllers/ControllerBalance")
const autenticarToken = require("../middlewares/authMiddleware")


router.post("/api/clients", Clients.getClients);
router.get("/api/clients/balance/:document", Balance.getBalance);


module.exports = router