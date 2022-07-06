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
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
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
    test("status 404`: responds with not found", () => {
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
    test("status 200: array is sorted by date in descending order", () => {
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
  describe.only("POST /api/articles/:article_id/comments", () => {
    test("status:201, responds with comment newly added to the database", () => {
      const newComment = {
        username: "takwa",
        body: "it's nearly lunch time!!",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            author: "takwa",
            body: "it's nearly lunch time!!",
            article_id: 3,
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
  });
});
