const express = require("express");
const {
  getTrackingsByTrackingId,
} = require("../controllers/trackingsController.js");
const trackingsRouter = express.Router();

trackingsRouter.get("/:tracking_id/logs", getTrackingsByTrackingId);

module.exports = { trackingsRouter };
