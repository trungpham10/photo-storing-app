const express = require("express");
const moments = express.Router();
const User = require("../models/users");
const Moment = require("../models/moments");
const { create } = require("../models/moments");

moments.get("/", (req, res) => {
  res.render("index.ejs", { currentUser: req.session.currentUser });
});

moments.get("/add", (req, res) => {
  res.render("add.ejs", { currentUser: req.session.currentUser });
});

moments.post("/add", (req, res) => {
  //   console.log(req.session.currentUser._id);
  //   console.log(req.body);
  Moment.create(req.body, (err, createdMoment) => {
    if (err) {
      console.log(err);
    } else {
      console.log("moment created: ", createdMoment);
      res.redirect("/");
    }
  });
});

module.exports = moments;
