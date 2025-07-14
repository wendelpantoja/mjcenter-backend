const express = require("express")
const router = express.Router()
const Stock = require("../controllers/StockController")

router.post("/api/stock/", Stock.getStock);

module.exports = router