const express = require("express");
const {
  postUserData,
  updateUserDataById,
  getUsersData,
  getUserRoll,
} = require("../controllers/usersController.js");
const { validateToken } = require("../middleware/validateToken.js");
const usersRouter = express.Router();

usersRouter.get("/", validateToken, getUsersData);

usersRouter.get("/:email/role", getUserRoll);

usersRouter.post("/", postUserData);

usersRouter.patch("/:id", updateUserDataById);

module.exports = { usersRouter };
