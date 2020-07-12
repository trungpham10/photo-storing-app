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
  User.findById(req.body.userID, (err, foundUser) => {
    Moment.create(req.body, (err, createdMoment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("moment created: ", createdMoment);
        foundUser.moments.push(createdMoment);
        foundUser.save((err, data) => {
          res.render("/");
        });
      }
    });
  });
});

moments.get("/:id", (req, res) => {
  Moment.findById(req.params.id, (err, foundMoment) => {
    res.render("show.ejs", {
      moment: foundMoment
    });
  })
});

module.exports = moments;
