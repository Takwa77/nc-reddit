const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const {
  getArticleByID,
  updateArticleVote,
  getArticles,
} = require("./controllers/articles.js");
const { getUsers } = require("./controllers/users");
const {
  postComment,
  getCommentsByID,
  removeComment,
} = require("./controllers/comments");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.patch("/api/articles/:article_id", updateArticleVote);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByID);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", removeComment);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use("*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
