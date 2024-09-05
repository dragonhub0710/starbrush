const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
process.setMaxListeners(0);

// Set up bodyParser middleware
app.use(bodyParser.urlencoded({ limit: "5MB", extended: true }));
app.use(bodyParser.json({ limit: "5MB" }));

// Define Routes
app.use("/api/chat", require("./routers/chat.router"));
app.use("/api/image", require("./routers/image.router"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
