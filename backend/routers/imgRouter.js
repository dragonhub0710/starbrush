const express = require("express");
const router = express.Router();
const imgController = require("../controllers/imgController");

router.post("/", imgController.imgGenerator);

module.exports = router;
