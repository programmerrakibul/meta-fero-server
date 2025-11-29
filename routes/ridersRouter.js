const express = require("express");
const {
  postRiderData,
  getRidersData,
  updateRiderStatus,
} = require("../controllers/ridersController.js");

const ridersRouter = express.Router();

ridersRouter.get("/", getRidersData);

ridersRouter.post("/", postRiderData);

ridersRouter.patch("/:riderId", updateRiderStatus);

module.exports = { ridersRouter };
