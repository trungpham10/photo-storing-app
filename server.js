const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI;
const mongoose = require("mongoose");
const session = require("express-session");

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const sessionsController = require("./controllers/sessions_controller.js");
app.use("/sessions", sessionsController);

const userController = require("./controllers/users_controller.js");
app.use("/users", userController);

app.get("/photos", (req, res) => {
  res.render("index.ejs", { currentUser: req.session.currentUser });
});

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
