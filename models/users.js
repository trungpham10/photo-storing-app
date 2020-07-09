const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Moment = require("./moments.js");

const userSchema = Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  moments: [Moment.schema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
