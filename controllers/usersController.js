const { ObjectId } = require("mongodb");
const { usersCollection } = require("../db.js");

const postUserData = async (req, res) => {
  const newUser = req.body;
  newUser.created_at = new Date().toISOString();
  newUser.role = "user";

  try {
    const isExist = await usersCollection.findOne({ email: newUser.email });

    if (isExist) {
      return res.send({ message: "Already Exist" });
    }

    const result = await usersCollection.insertOne(newUser);

    res.send({
      success: true,
      message: "User data posted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "User data post failed",
    });
  }
};

const updateUserDataById = async (req, res) => {
  const { id } = req.params;

  if (id.length !== 24) {
    return res.status(400).send({
      message: "Invalid ID",
    });
  }

  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: req.body,
  };

  try {
    const result = await usersCollection.updateOne(filter, updatedDoc);

    res.send({
      success: true,
      message: "User data updated successfully",
      ...result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "User data update failed",
    });
  }
};

const getUsersData = async (req, res) => {
  const filter = {};

  try {
    const result = await usersCollection.find(filter).toArray();

    res.send({
      success: true,
      message: "Users data retrieved successfully",
      users: result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "Users data retrieved failed",
    });
  }
};

const getUserRoll = async (req, res) => {
  const { email } = req.params;

  const filter = { email };

  try {
    const result = await usersCollection.findOne(filter);

    res.send({
      success: true,
      role: result.role || "user",
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "User role retrieved failed",
    });
  }
};

module.exports = {
  postUserData,
  updateUserDataById,
  getUsersData,
  getUserRoll,
};
