// config.js
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  port: process.env.PORT || 5000,
};
