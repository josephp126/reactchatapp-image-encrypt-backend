require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  COLLECTION: process.env.DB_COLLECTION,
  URL: process.env.DB_URL,
};
