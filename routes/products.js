const express = require("express")
const router = express.Router()
const Label = require("../controllers/LabelController")

router.post("/api/products", Label.getProductToLabel);

module.exports = router