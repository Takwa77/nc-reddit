\c nc_news_test

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id):: INT AS comment_count 
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
AND articles.article_id = 2
GROUP BY articles.article_id;

SELECT articles.*, COUNT(comments.article_id)
      AS comment_count
      FROM comments
      RIGHT JOIN articles
      ON articles.article_id = comments.article_id
      AND comments.article_id=2
      GROUP BY articles.article_id;
SELECT articles.*, COUNT(comments.article_id) 
AS comment_count
FROM comments
RIGHT JOIN articles
ON articles.article_id = comments.article_id 
WHERE articles.article_id=2
GROUP BY articles.article_id;


SELECT * FROM comments;
