const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const {
  getArticleByID,
  updateArticleVote,
} = require("./controllers/articles.js");
const { getUsers } = require("./controllers/users");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", updateArticleVote);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  // handle custom errors
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use("*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
