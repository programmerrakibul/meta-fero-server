const express = require("express");
const {
  postUserData,
  updateUserDataById,
} = require("../controllers/usersController.js");
const usersRouter = express.Router();

usersRouter.post("/", postUserData);

usersRouter.patch("/:id", updateUserDataById);

module.exports = { usersRouter };
