const express = require("express");
const {
  createCheckout,
  updatePaymentStatus,
} = require("../controllers/checkoutController.js");

const checkoutRouter = express.Router();

checkoutRouter.post("/", createCheckout);

checkoutRouter.put("/status/:session_id", updatePaymentStatus);

module.exports = { checkoutRouter };
