\c nc_news_test

SELECT articles.*, COUNT(comments.article_id) AS comment_count
FROM comments
JOIN articles
ON articles.article_id = comments.article_id
AND comments.article_id=2
GROUP BY articles.article_id;


