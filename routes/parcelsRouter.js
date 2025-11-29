const express = require("express");
const {
  postParcel,
  getAllParcel,
  getParcelById,
  updateParcelDataAndRiderStatus,
} = require("../controllers/parcelsController.js");
const parcelsRouter = express.Router();

parcelsRouter.post("/", postParcel);

parcelsRouter.get("/", getAllParcel);

parcelsRouter.get("/:id", getParcelById);

parcelsRouter.patch("/:id", updateParcelDataAndRiderStatus);

module.exports = { parcelsRouter };
