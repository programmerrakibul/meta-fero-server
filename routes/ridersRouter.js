const express = require("express");
const {
  postRiderData,
  getRidersData,
  updateRiderDataById,
} = require("../controllers/ridersController.js");
const ridersRouter = express.Router();

ridersRouter.get("/", getRidersData);

ridersRouter.post("/", postRiderData);

ridersRouter.patch("/:riderId", updateRiderDataById);

module.exports = { ridersRouter };
