const express = require("express")
const router = express.Router()
const Product = require("../controllers/ProductsController")

router.get("/api/product/:id", Product.getProduct);

module.exports = router