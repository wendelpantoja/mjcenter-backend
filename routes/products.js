const express = require("express")
const router = express.Router()
const Label = require("../controllers/ControllerLabel")

router.post("/api/products", Label.getProducts);

module.exports = router