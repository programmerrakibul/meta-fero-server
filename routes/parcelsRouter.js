const express = require("express");
const {
  postParcel,
  getAllParcel,
} = require("../controllers/parcelsController.js");
const parcelsRouter = express.Router();

parcelsRouter.post("/", postParcel);

parcelsRouter.get("/", getAllParcel);

module.exports = { parcelsRouter };
