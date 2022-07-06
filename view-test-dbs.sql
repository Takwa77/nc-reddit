\c nc_news_test

SELECT articles.*, COUNT(comments.article_id) 
AS comment_count
FROM comments
RIGHT JOIN articles
ON articles.article_id = comments.article_id 
WHERE articles.article_id=2
GROUP BY articles.article_id;


SELECT * FROM comments;