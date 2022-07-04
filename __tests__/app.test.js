const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("GET /api/topics", () => {
    test("status 200: returns an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(3);
          body.forEach((topic) => {
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("status 2: returns an object containing article information", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then(({ body }) => {
          expect(body.park).toEqual({
            article_id: 6,
            title: A,
            body: "Delicious tin of cat food",
            topic: "mitch",
            created_at: "2020-10-18 02:00:00",
            votes: 0,
          });
        });
    });
  });
});
