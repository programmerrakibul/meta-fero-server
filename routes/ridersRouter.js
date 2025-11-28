const express = require("express");
const {
  postRiderData,
  getRidersData,
} = require("../controllers/ridersController.js");
const ridersRouter = express.Router();

ridersRouter.get("/", getRidersData);

ridersRouter.post("/", postRiderData);

module.exports = { ridersRouter };
