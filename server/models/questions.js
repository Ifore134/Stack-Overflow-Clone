const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  text: { type: String, required: true },
  summary: { type: String, required: true, maxlength: 140 },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default:[]}],
  asked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ask_date_time: { type: Date, default: new Date() },
  votes:{type:Number,default:0},
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  views: { type: Number, default: 0 },
});


const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
