const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
const mongodbURI = process.env.MONGODBURI;
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const sessionsController = require("./controllers/sessions_controller");
app.use("/sessions", sessionsController);

const userController = require("./controllers/users_controller");
app.use("/users", userController);

const momentsController = require("./controllers/moments_controller");
app.use("/", momentsController);

app.listen(PORT, () => {
  console.log("Listening at port", PORT);
});
