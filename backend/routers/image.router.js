const express = require("express");
const router = express.Router();
const imgController = require("../controllers/image.controller");

router.post("/", imgController.imgGenerator);

module.exports = router;
