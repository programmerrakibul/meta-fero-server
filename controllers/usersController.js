const { usersCollection } = require("../db.js");

const postUserData = async (req, res) => {
  const newUser = req.body;

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

module.exports = { postUserData };
