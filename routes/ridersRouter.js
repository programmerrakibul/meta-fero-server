const express = require("express");
const {
  postRiderData,
  getRidersData,
  updateRiderStatus,
  getPerDayDeliveryStats,
} = require("../controllers/ridersController.js");
const { verifyAdmin } = require("../middleware/verifyAdmin.js");
const { verifyRider } = require("../middleware/verifyRider.js");

const ridersRouter = express.Router();

ridersRouter.get("/", verifyAdmin, getRidersData);

ridersRouter.get(
  "/per-day-delivery-stats",
  verifyRider,
  getPerDayDeliveryStats
);

ridersRouter.post("/", postRiderData);

ridersRouter.patch("/:riderId", verifyAdmin, updateRiderStatus);

module.exports = { ridersRouter };
