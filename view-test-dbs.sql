\c nc_news_test

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id):: INT AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE topic = ' '
      GROUP BY articles.article_id
      ORDER BY votes DESC;
