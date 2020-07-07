const express = require("express");
const app = express();
const PORT = 4000;

app.get("/photos", (req, res) => {
  res.send("Photos index page");
});

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
