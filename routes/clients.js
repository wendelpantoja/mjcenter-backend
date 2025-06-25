const express = require("express")
const router = express.Router()
const Clients = require("../controllers/ClientController")
const Balance = require("../controllers/BalanceController")
const PaymentBooklet = require("../controllers/PaymentBookletController")

router.post("/api/clients", Clients.getClients);
router.get("/api/clients/balance/:document", Balance.getBalance);
router.post("/api/clients/payment-booklet/", PaymentBooklet.getClient)

module.exports = router