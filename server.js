require("dotenv").config();
const express = require("express");
const studentRoutes = require("./src/routes/studentRoutes");
const pool = require("./src/config/db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student API is running");
});

app.use("/students", studentRoutes);

// Verify the PostgreSQL connection on startup so config problems fail loudly
pool
  .query("SELECT NOW()")
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});