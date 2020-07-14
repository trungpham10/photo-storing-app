const express = require("express");
const moments = express.Router();
const User = require("../models/users");
const Moment = require("../models/moments");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const UPLOADED_IMG_FOLDER = process.env.UPLOADED_IMG_FOLDER;

console.log(UPLOADED_IMG_FOLDER);

moments.use(fileUpload());

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/sessions/new");
  }
};

moments.get("/upload", isAuthenticated, function (req, res) {
  res.render("upload.ejs");
});

moments.post("/upload", isAuthenticated, function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(sampleFile);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`${UPLOADED_IMG_FOLDER}${sampleFile.name}`, function (err) {
    if (err) return res.status(500).send(err);

    res.send(`
        <img src='/controllers/uploaded/${sampleFile.name}' width="500" height="500"> 
      `);
  });
});

moments.get("/", (req, res) => {
  Moment.find({}, (err, allMoments) => {
    res.render("index.ejs", {
      moments: allMoments,
      currentUser: req.session.currentUser,
    });
  });
});

moments.get("/add", (req, res) => {
  res.render("add.ejs", { currentUser: req.session.currentUser });
});

moments.post("/", isAuthenticated, (req, res) => {
  // process image
  if (req.files.uploadFile) {
    let uploadFile = req.files.uploadFile;
    req.body.img = req.files.uploadFile.name;

    uploadFile.mv(`${UPLOADED_IMG_FOLDER}${uploadFile.name}`, function (err) {
      if (err) return res.status(500).send(err);
    });
  }

  User.findById(req.body.userID, (err, foundUser) => {
    Moment.create(req.body, (err, createdMoment) => {
      foundUser.moments.push(createdMoment);
      foundUser.save((err, data) => {
        res.redirect("/");
      });
    });
  });
});

moments.get("/:id", isAuthenticated, (req, res) => {
  Moment.findById(req.params.id, (err, foundMoment) => {
    User.findOne({ "moments._id": req.params.id }, (err, foundUser) => {
      res.render("show.ejs", {
        moment: foundMoment,
        user: foundUser,
      });
    });
  });
});

moments.get("/:id/edit", isAuthenticated, (req, res) => {
  Moment.findById(req.params.id, (err, foundMoment) => {
    res.render("edit.ejs", {
      moment: foundMoment,
      currentUser: req.session.currentUser,
    });
  });
});

moments.put("/:id", isAuthenticated, (req, res) => {
  // process image
  if (req.files.uploadFile) {
    let uploadFile = req.files.uploadFile;
    req.body.img = req.files.uploadFile.name;

    uploadFile.mv(`${UPLOADED_IMG_FOLDER}${uploadFile.name}`, function (err) {
      if (err) return res.status(500).send(err);
    });
  }

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

moments.delete("/:id", isAuthenticated, (req, res) => {
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
