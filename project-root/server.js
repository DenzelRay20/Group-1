require("dotenv").config();
const express = require("express");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/students", studentRoutes);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});