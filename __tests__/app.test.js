const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("app", () => {
  describe("GET /api/topics", () => {
    test("status 200: returns an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(3);
          body.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("status 404: returns invalid path message", () => {
      return request(app)
        .get("/api/not_an_endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid path");
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("status 200: returns an object containing article information", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 6,
            title: "A",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            comment_count: "1",
          });
        });
    });
    test("status 200: successfully returns an object with 0 comment_count", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago???never mind how long precisely???having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people???s hats off???then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            comment_count: "0",
          });
        });
    });
    test("status 404: returns invalid path message", () => {
      return request(app)
        .get("/api/articles/2009")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`article 2009 does not exist`);
        });
    });
    test("status 400: returns bad request", () => {
      return request(app)
        .get("/api/articles/not-a-path")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("status 200: returns updated article", () => {
      const increment = { inc_votes: 100 };
      return request(app)
        .patch("/api/articles/6")
        .send(increment)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 6,
            title: "A",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 100,
          });
        });
    });
    test("status 200: returns updated article", () => {
      const decrement = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(decrement)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            author: "butter_bridge",
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 50,
          });
        });
    });
    test("status 400: returns bad request for empty request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("status 404: returns bad request for incorrect votes type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "apples" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("GET /api/users", () => {
    test("status: 200 responsed with array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(4);
          body.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
    test("status 404: responds with not found", () => {
      return request(app)
        .get("/api/not_an_endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid path");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("status 200: returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("status 200: array is sorted by date in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([
            {
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: `2020-11-03T09:12:00.000Z`,
              votes: 0,
              comment_count: 2,
            },
            {
              author: "icellusedkars",
              title: "A",
              article_id: 6,
              topic: "mitch",
              created_at: "2020-10-18T01:00:00.000Z",
              votes: 0,
              comment_count: 1,
            },
            {
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "butter_bridge",
              title: "Moustache",
              article_id: 12,
              topic: "mitch",
              created_at: "2020-10-11T11:24:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "rogersop",
              title: "UNCOVERED: catspiracy to bring down democracy",
              article_id: 5,
              topic: "cats",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              comment_count: 2,
            },
            {
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: 11,
            },
            {
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: 0,
              comment_count: 2,
            },
            {
              author: "rogersop",
              title: "Seven inspirational thought leaders from Manchester UK",
              article_id: 10,
              topic: "mitch",
              created_at: "2020-05-14T04:15:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "rogersop",
              title: "Student SUES Mitch!",
              article_id: 4,
              topic: "mitch",
              created_at: "2020-05-06T01:14:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Does Mitch predate civilisation?",
              article_id: 8,
              topic: "mitch",
              created_at: "2020-04-17T01:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Am I a cat?",
              article_id: 11,
              topic: "mitch",
              created_at: "2020-01-15T22:21:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Z",
              article_id: 7,
              topic: "mitch",
              created_at: "2020-01-07T14:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
          ]);
        });
    });
    test("status 200: accepts sort_by query with votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 200: accepts sort_by query with author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("status 200: accepts sort_by query with title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("status 200: accepts sort_by query with article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("article_id", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 200: accepts sort_by query with topic", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", {
            descending: true,
          });
        });
    });
    test("status 200: accepts sort_by query with comment_count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("comment_count", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 400: bad request for invalid sort_by option", () => {
      return request(app)
        .get("/api/articles?sort_by=not_an_option")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid sort query");
        });
    });
    test("status 200: array is sorted by date in ascending order", () => {
      return request(app)
        .get("/api/articles?order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([
            {
              author: "icellusedkars",
              title: "Z",
              article_id: 7,
              topic: "mitch",
              created_at: "2020-01-07T14:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Am I a cat?",
              article_id: 11,
              topic: "mitch",
              created_at: "2020-01-15T22:21:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Does Mitch predate civilisation?",
              article_id: 8,
              topic: "mitch",
              created_at: "2020-04-17T01:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "rogersop",
              title: "Student SUES Mitch!",
              article_id: 4,
              topic: "mitch",
              created_at: "2020-05-06T01:14:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "rogersop",
              title: "Seven inspirational thought leaders from Manchester UK",
              article_id: 10,
              topic: "mitch",
              created_at: "2020-05-14T04:15:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: 0,
              comment_count: 2,
            },
            {
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: 11,
            },
            {
              author: "rogersop",
              title: "UNCOVERED: catspiracy to bring down democracy",
              article_id: 5,
              topic: "cats",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              comment_count: 2,
            },
            {
              author: "butter_bridge",
              title: "Moustache",
              article_id: 12,
              topic: "mitch",
              created_at: "2020-10-11T11:24:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "A",
              article_id: 6,
              topic: "mitch",
              created_at: "2020-10-18T01:00:00.000Z",
              votes: 0,
              comment_count: 1,
            },
            {
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              comment_count: 2,
            },
          ]);
        });
    });
    test("status 400:  bad request for invalid order_by option", () => {
      return request(app)
        .get("/api/articles?order_by=not_an_order")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("invalid order query");
        });
    });
    test("status 200: accepts sort_by query with article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("article_id", {
            descending: true,
            coerce: true,
          });
        });
    });
    test("status 200: accepts filter_by query", () => {
      return request(app)
        .get("/api/articles?filter_by=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([
            {
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: `2020-11-03T09:12:00.000Z`,
              votes: 0,
              comment_count: 2,
            },
            {
              author: "icellusedkars",
              title: "A",
              article_id: 6,
              topic: "mitch",
              created_at: "2020-10-18T01:00:00.000Z",
              votes: 0,
              comment_count: 1,
            },
            {
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "butter_bridge",
              title: "Moustache",
              article_id: 12,
              topic: "mitch",
              created_at: "2020-10-11T11:24:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              comment_count: 11,
            },
            {
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              article_id: 9,
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              votes: 0,
              comment_count: 2,
            },
            {
              author: "rogersop",
              title: "Seven inspirational thought leaders from Manchester UK",
              article_id: 10,
              topic: "mitch",
              created_at: "2020-05-14T04:15:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "rogersop",
              title: "Student SUES Mitch!",
              article_id: 4,
              topic: "mitch",
              created_at: "2020-05-06T01:14:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Does Mitch predate civilisation?",
              article_id: 8,
              topic: "mitch",
              created_at: "2020-04-17T01:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Am I a cat?",
              article_id: 11,
              topic: "mitch",
              created_at: "2020-01-15T22:21:00.000Z",
              votes: 0,
              comment_count: 0,
            },
            {
              author: "icellusedkars",
              title: "Z",
              article_id: 7,
              topic: "mitch",
              created_at: "2020-01-07T14:08:00.000Z",
              votes: 0,
              comment_count: 0,
            },
          ]);
        });
    });
    test("status 200: accepts filter_by query that exists but doesn't have any articles associated with it", () => {
      return request(app)
        .get("/api/articles?filter_by=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
    test("status 404: returns error message for invalid filter_by query", () => {
      return request(app)
        .get("/api/articles?filter_by=news")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("invalid filter query");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("status 200: returns an array of comments corresponding to article_id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("status 200: returns empty array for article_id with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("status 404: returns 'article not found'", () => {
      return request(app)
        .get("/api/articles/2009/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    test("status 400: returns 'bad request'", () => {
      return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 responds with new comment", () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a new comment",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: 19,
            body: "this is a new comment",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("status: 404 responds with 'user not found' when username isn't in users table", () => {
      const newComment = {
        username: "takwa",
        body: "it's nearly lunch time!!",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user not found");
        });
    });
    test("status: 400 responds with bad request when comment to be added is missing a required field", () => {
      const newComment = {
        body: "it's nearly lunch time!!",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("status 404: returns 'article not found' when article_id doesn't exist", () => {
      const newComment = {
        username: "icellusedkars",
        body: "this is a new comment",
      };
      return request(app)
        .post("/api/articles/2009/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("status:204, responds with an empty response body", () => {
      return request(app).delete("/api/comments/5").expect(204);
    });
    test("status 404: responds with 'comment does not exist'", () => {
      return request(app)
        .delete("/api/comments/2009")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment 2009 does not exist");
        });
    });
    test("status 400: responds with 'bad request'", () => {
      return request(app)
        .delete("/api/comments/not-a-path")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("comment ID should be a number");
        });
    });
  });
});
