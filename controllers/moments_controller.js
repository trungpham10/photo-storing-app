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

moments.post("/", (req, res) => {
  User.findById(req.body.userID, (err, foundUser) => {
    Moment.create(req.body, (err, createdMoment) => {
      console.log("moment created: ", createdMoment);
      foundUser.moments.push(createdMoment);
      foundUser.save((err, data) => {
        res.redirect("/");
      });
    });
  });
});

moments.get("/:id", (req, res) => {
  Moment.findById(req.params.id, (err, foundMoment) => {
    User.findOne({ "moments._id": req.params.id }, (err, foundUser) => {
      res.render("show.ejs", {
        moment: foundMoment,
        user: foundUser,
      });
    });
  });
});

moments.get("/:id/edit", (req, res) => {
  Moment.findById(req.params.id, (err, foundMoment) => {
    res.render("edit.ejs", {
      moment: foundMoment,
      currentUser: req.session.currentUser,
    });
  });
});

moments.put("/:id", (req, res) => {
  Moment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedMoment) => {
      User.findOne({ "moments._id": req.params.id }, (err, foundUser) => {
        foundUser.moments.id(req.params.id).remove();
        foundUser.moments.push(updatedMoment);
        foundUser.save((err, data) => {
          res.redirect("/" + req.params.id);
        });
      });
    }
  );
});

moments.delete("/:id", (req, res) => {
  Moment.findByIdAndRemove(req.params.id, (err, foundMoment) => {
    User.findOne({ "moments._id": req.params.id }, (err, foundUser) => {
      foundUser.moments.id(req.params.id).remove();
      foundUser.save((err, data) => {
        res.redirect("/");
      });
    });
  });
});

module.exports = moments;
