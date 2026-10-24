const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const GameScore = require("./models/gamescore");
const { gameScoreSchema } = require("./validations/gameScoreValidation");

const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.set("layout", "layout/boilerplate");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

mongoose.connect("mongodb://127.0.0.1:27017/simon_game")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.render("index", {
    title: "Simon Says Game"
  });
});

app.get("/scores", async (req, res) => {
  const scores = await GameScore.find().sort({ createdAt: -1 });
  res.render("score", { title: "Game Scores", scores });
});

app.post("/api/scores", async (req, res) => {
  const { error, value } = gameScoreSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: "Invalid score data",
      details: error.details.map((detail) => detail.message),
    });
  }

  const gameScore = new GameScore({ score: value.score });
  const savedScore = await gameScore.save();
  res.status(201).json(savedScore);
});

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const message = statusCode === 404
    ? "Page not found"
    : "Something went wrong. Please try again.";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).render("error", {
    title: `${statusCode} - ${message}`,
    errorCode: statusCode,
    message
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
