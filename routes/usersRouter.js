const express = require("express");
const { postUserData } = require("../controllers/usersController.js");
const usersRouter = express.Router();

usersRouter.post('/', postUserData)

module.exports = {usersRouter}