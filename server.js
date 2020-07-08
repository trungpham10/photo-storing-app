const express = require("express");
const app = express();
const PORT = 4000;

const userController = require("./controllers/users_controller.js");
app.use("/users", userController);

app.get("/photos", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
