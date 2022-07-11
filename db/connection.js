const ENV = process.env.NODE_ENV || "development";
const { Pool } = require("pg");

require("dotenv").config({
  path: `${__dirname}/../${ENV}.env`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};

module.exports = new Pool(config);
