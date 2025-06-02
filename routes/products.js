const express = require("express")
const router = express.Router()
const Label = require("../controllers/LabelController")
const autenticarToken = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/isAdmin")

router.post("/api/products", Label.getProductToLabel);

// router.post("/api/products", autenticarToken, isAdmin, Label.getProductToLabel);

module.exports = router