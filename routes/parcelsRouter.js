const express = require("express");
const { postParcel } = require("../controllers/parcelsController.js");
const parcelsRouter = express.Router();

parcelsRouter.post("/", postParcel);

module.exports = { parcelsRouter };
