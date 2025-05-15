const express = require("express")
const router = express.Router()
const Clients = require("../controllers/ControllerClients")


router.get("/api/clients", Clients.getClients);


module.exports = router