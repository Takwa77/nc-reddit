const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");
const { getArticles } = require("./controllers/articles.js");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

module.exports = app;
