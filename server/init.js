const mongoose = require("mongoose");
const User = require("./models/user.js");
const Question = require("./models/questions.js");
const Comment = require("./models/comments.js");
const Tag = require("./models/tags.js");
const Answer = require("./models/answers.js");

const adminUsername = process.argv[2];
const adminPassword = process.argv[3];

if (!adminUsername || !adminPassword) {
  console.log("Please provide admin username and password");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Tag.deleteMany({});
    await Comment.deleteMany({});
    await Answer.deleteMany({});

    const admin = new User({
      username: adminUsername,
      password: adminPassword,
      reputation: 1000,
      isAdmin: true,
    });

    const tag1 = new Tag({ name: "Tag1" });
    const tag2 = new Tag({ name: "Tag2" });

    const user1 = new User({
      username: "TestUser1",
      password: "password1",
      reputation: 100,
      questions: [],
    });

    const user2 = new User({
      username: "TestUser2",
      password: "password2",
      reputation: 50,
      questions: [],
    });

    const question1 = new Question({
      title: "Test Question 1",
      text: "This is a test question 1",
      summary: "This",
      answers: [],
      asked_by: user1._id,
      tags: [tag1._id],
    });

    const question2 = new Question({
      title: "Test Question 2",
      text: "This is a test question 2",
      summary:"a test",
      answers: [],
      asked_by: user2._id,
      tags: [tag2._id],
    });

    // Add the questions to the user's questions array
    user1.questions.push(question1._id);
    user2.questions.push(question2._id);

    const answer1 = new Answer({
      body: "info",
      createdBy: user1._id,
      question: question1,
    });

    const comment1 = new Comment({
      body: "This is a test",
      question: question1._id,
      createdBy: user1._id,
    });

    question1.answers.push(answer1._id);

    await admin.save();
    await tag1.save();
    await tag2.save();
    await user1.save();
    await user2.save();
    await question1.save();
    await question2.save();
    await comment1.save();
    await answer1.save();

    console.log("Database seeded...");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB().then(seedDB);
