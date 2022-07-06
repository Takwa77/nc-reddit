\c nc_news_test

SELECT comments.author, comments.body, comments.comment_id, comments.created_at, comments.votes
 FROM comments WHERE comments.article_id = 5;
