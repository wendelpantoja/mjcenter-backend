const express = require("express")
const router = express.Router()
const EntityController = require("../controllers/EntityController")

router.get("/api/entitys", EntityController.getEntity)

module.exports = router