const express = require("express");
const { postRiderData } = require("../controllers/ridersController.js");
const ridersRouter = express.Router();

ridersRouter.post("/", postRiderData);

module.exports = { ridersRouter };
