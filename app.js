const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const { getArticles } = require("./controllers/articles.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

module.exports = app;
