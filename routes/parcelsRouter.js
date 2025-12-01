const express = require("express");
const {
  postParcel,
  getAllParcel,
  getParcelById,
  updateParcelDataAndRiderStatus,
  updateDeliveryStatus,
  deliveryStatusStats,
} = require("../controllers/parcelsController.js");
const parcelsRouter = express.Router();

parcelsRouter.post("/", postParcel);

parcelsRouter.get("/", getAllParcel);

parcelsRouter.get("/delivery-status-stats", deliveryStatusStats);

parcelsRouter.get("/:id", getParcelById);

parcelsRouter.patch("/:id", updateParcelDataAndRiderStatus);

parcelsRouter.patch("/:id/rider", updateDeliveryStatus);

module.exports = { parcelsRouter };
