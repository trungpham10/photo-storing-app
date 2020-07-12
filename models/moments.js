const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const momentSchema = Schema({
  img: String,
  title: String,
  description: String,
});

const Moment = mongoose.model("Moment", momentSchema);

module.exports = Moment;
