\c nc_news_test


 
UPDATE articles
SET votes = votes + 100
WHERE article_id = 6;

SELECT * FROM articles WHERE article_id=6;

