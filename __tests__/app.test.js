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
});
