const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/photo_users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

app.use(express.json());
app.use(express.urlencoded());

const userController = require("./controllers/users_controller.js");
app.use("/users", userController);

app.get("/photos", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
