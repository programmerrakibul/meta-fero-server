const express = require("express");
const {
  postUserData,
  updateUserDataById,
  getUsersData,
} = require("../controllers/usersController.js");
const usersRouter = express.Router();

usersRouter.get("/", getUsersData);

usersRouter.post("/", postUserData);

usersRouter.patch("/:id", updateUserDataById);

module.exports = { usersRouter };
