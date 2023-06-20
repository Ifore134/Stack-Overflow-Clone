// Tag Document Schema
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  created: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
