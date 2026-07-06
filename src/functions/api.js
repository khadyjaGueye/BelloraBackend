const serverless = require("serverless-http");
const app = require("../src/app"); // importe ton app.js

module.exports.handler = serverless(app);
