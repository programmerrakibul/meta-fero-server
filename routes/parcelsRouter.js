const express = require("express");
const {
  postParcel,
  getAllParcel,
  getParcelById,
} = require("../controllers/parcelsController.js");
const parcelsRouter = express.Router();

parcelsRouter.post("/", postParcel);

parcelsRouter.get("/", getAllParcel);

parcelsRouter.get("/:id", getParcelById);

module.exports = { parcelsRouter };
