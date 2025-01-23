const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Subscribe to Arpan Neupane's channel");
});

app.listen(port, () => {
  console.log("Server started on port 8080");
});