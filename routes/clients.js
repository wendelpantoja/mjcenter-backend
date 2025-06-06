const express = require("express")
const router = express.Router()
const Clients = require("../controllers/ClientController")
const Balance = require("../controllers/BalanceController")
const PaymentBooklet = require("../controllers/PaymentBookletController")
const autenticarToken = require("../middlewares/authMiddleware")

router.post("/api/clients", Clients.getClients);
router.get("/api/clients/balance/:document", Balance.getBalance);
router.get("/api/clients/payment-booklet/:document", PaymentBooklet.getClient)

// router.post("/api/clients", autenticarToken, Clients.getClients);
// router.get("/api/clients/balance/:document", autenticarToken, Balance.getBalance);


module.exports = router