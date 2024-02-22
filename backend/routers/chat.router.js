const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");

router.post("/", chatController.generateRes);

module.exports = router;
