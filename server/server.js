const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/user.js");
const Question = require("./models/questions.js");
const Comment = require("./models/comments.js");
const Tag = require("./models/tags.js");
const Answer = require("./models/answers.js");
const session = require("express-session");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const sessionSecret = crypto.randomBytes(64).toString("hex");

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to false if you're not using HTTPS
      httpOnly: true,
      sameSite: "lax", // this setting is important for cross-origin requests
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find({}).populate("asked_by");
    res.json(questions);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.find({});
    res.json(answers);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.post("/comments", async (req, res) => {
  const newComment = new Comment(req.body);

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.put("/comments/:id", async (req, res) => {
  try {
    const updatedQuestion = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("questions");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/users", async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.post("/answers", async (req, res) => {
  const newAnswer = new Answer(req.body);

  console.log("saving answer which is ", newAnswer);

  try {
    const savedAnswer = await newAnswer.save();
    res.status(201).json(savedAnswer);
  } catch (err) {
    console.log("error creating answer");
    res.status(400).json({ message: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put("/questions/:questionId/answers/:answerId", async (req, res) => {
  try {
    console.log("i am not asdsadsads");

    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    console.log("sadasdsadsasa");
    const question = await Question.findById(questionId);
    const answer = await Answer.findById(answerId);
    console.log("i am not erroing");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Linking the answer to the question
    answer.question = question;
    (await answer.save()).populate("createdAt");

    // Update the question document by pushing the answerId to its answers array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answerId },
    });

    // Fetch the updated question document to send it in the response
    const updatedQuestion = await Question.findById(questionId);

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error(error); // Log the error to get more specific information
    res
      .status(500)
      .json({ message: "Error linking answer to the question", error: error });
  }
});

app.post("/questions", async (req, res) => {
  const newQuestion = new Question(req.body);

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/questions/:id", async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/questions/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/tags/:id", async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/tags/:id", async (req, res) => {
  try {
    await Tag.findByIdAndRemove(req.params.id);
    res.json({ message: "Tag removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/tags/:id", async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/tags/:id", async (req, res) => {
  try {
    await Tag.findByIdAndRemove(req.params.id);
    res.json({ message: "Tag removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.find().populate("createdBy");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/answers/:id", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate("createdBy");
    res.json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/answers/:id", async (req, res) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAnswer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/answers/:id", async (req, res) => {
  try {
    await Answer.findByIdAndRemove(req.params.id);
    res.json({ message: "Answer removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/comments/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/comment/:id", async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.id);
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Finding user");
    const user = await User.findOne({ username });
    console.log("User found: ", user);

    if (!user) {
      console.log("User not found: ", username);
      return res
        .status(400)
        .json({ success: false, message: "Cannot find user" });
    }

    console.log("Comparing passwords");
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result: ", validPassword);

    if (validPassword) {
      req.session.userId = user._id;
      res.json({ success: true, message: "You are logged in" });
    } else {
      res.status(400).json({ success: false, message: "Not Allowed" });
    }
  } catch (err) {
    console.error("Error in login route: ", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/isloggedin", (req, res) => {
  if (req.session && req.session.userId) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});
app.get("/session", (req, res) => {
  if (req.session && req.session.userId) {
    res.send({ session: req.session });
  } else {
    res.send({ session: null });
  }
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    if (password.includes(username) || password.includes(email)) {
      return res.status(400).json({
        success: false,
        message: "Password should not contain username or email",
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/adminProfile", async (req, res) => {
  const adminId = req.session.userId;
  const admin = await User.findById(adminId);

  if (!admin.isAdmin) {
    return res.status(403).send({ message: "Not authorized" });
  }

  const users = await User.find({ _id: { $ne: adminId } });
  res.send({ admin, users });
});

app.delete("/user/:id", async (req, res) => {
  const adminId = req.session.userId;
  const userId = req.params.id;

  const admin = await User.findById(adminId);

  if (!admin.isAdmin) {
    return res.status(403).send({ message: "Not authorized" });
  }

  if (String(adminId) !== String(userId)) {
    await User.findByIdAndRemove(userId);
    res.send({ success: true });
  } else {
    res.send({ success: false, message: "Admin cannot delete own account" });
  }
});
app.post("/users/:u_id/questions/:q_id", async (req, res) => {
  const username = req.params.u_id;
  const questionId = req.params.q_id;

  try {
    const user = await User.findById(username);
    const question = await Question.findById(questionId);

    if (!user || !question) {
      return res.status(404).json({ message: "User or Question not found" });
    }

    user.questions.push(question._id);
    question.asked_by = user;

    await user.save();
    await question.save();

    res.status(200).json({ message: "Question added to User successfully." });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
app.put("/questions/:questionId/tags", async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const tagId = req.body.tagId;

    const question = await Question.findById(questionId);
    const tag = await Tag.findById(tagId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    if (!tag) {
      console.log(tagId);
      return res.status(404).json({ message: "Tag not found" });
    }

    const tagExists = question.tags.some((t) => t.toString() === tagId);

    if (!tagExists) {
      question.tags.push(tagId);
      await question.save();
    }

    res.status(200).json(question);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding tag to the question", error });
  }
});
app.put("/questions/:id/view", async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    res.json(question);
  } catch (error) {
    console.error("Error updating views:", error);
    res.status(500).json({ error: "Failed to update views" });
  }
});
app.get("/current-user", async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).populate(
        "questions"
      );
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});
app.post("/tags", async (req, res) => {
  try {
    // Get the data from the request body
    // const { title, content } = req.body;
    const { name, created } = req.body;
    // console.log(tex)
    // console.log(ab)
    // Create a new question object
    const tag = new Tag({
      name,
      created,
    });

    // Save the new question to the database
    const newtag = await tag.save();

    // Send a success response
    res.status(201).json(newtag);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question" });
  }
});
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ username: user.username });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(s);
      console.error("Failed to destroy session:", err);
      res.status(500).send({ message: "Failed to logout." });
    } else {
      res.status(200).send({ message: "Logged out successfully." });
    }
  });
});
app.get("/user-role/:id", (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ isAdmin: user.isAdmin });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
