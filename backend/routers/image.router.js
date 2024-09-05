const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const imgController = require("../controllers/image.controller");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Extract the original file extension
    const fileExtension = path.extname(file.originalname);
    // Generate a unique filename
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Save the file with the original extension
    cb(null, uniqueName + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Define article routes
router.post("/removebg", upload.single("file"), imgController.removeBg);
router.post("/diffusion", upload.single("file"), imgController.bgDiffusion);
router.post("/", imgController.imgGenerator);

module.exports = router;
