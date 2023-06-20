const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  body: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },

  votes:{type:Number,default:0},
  voters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

});

module.exports = mongoose.model("Comment", CommentSchema);
