\c nc_news_test


INSERT INTO users (username, name) 
VALUES 
('takwa', 'TAKWA');
INSERT INTO comments 
(article_id, body, author)
VALUES
(3, 'body', 'takwa')
RETURNING *; 
