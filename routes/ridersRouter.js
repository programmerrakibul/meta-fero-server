const express = require("express");
const {
  postRiderData,
  getRidersData,
  updateRiderStatus,
} = require("../controllers/ridersController.js");
const { verifyAdmin } = require("../middleware/verifyAdmin.js");

const ridersRouter = express.Router();

ridersRouter.get("/", verifyAdmin, getRidersData);

ridersRouter.post("/", postRiderData);

ridersRouter.patch("/:riderId", verifyAdmin, updateRiderStatus);

module.exports = { ridersRouter };
