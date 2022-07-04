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
    test("Status 404: returns invalid path message", () => {
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
});
