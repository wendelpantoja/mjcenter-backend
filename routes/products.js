const express = require("express")
const router = express.Router()
const Label = require("../controllers/ControllerLabel")
const autenticarToken = require("../middlewares/authMiddleware")

router.post("/api/products", autenticarToken, Label.getProducts);

module.exports = router