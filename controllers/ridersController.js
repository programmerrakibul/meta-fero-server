const { ridersCollection } = require("../db.js");

const postRiderData = async (req, res) => {
  const newRider = req.body;
  newRider.created_at = new Date().toISOString();
  newRider.status = "pending";

  try {
    const isExist = await ridersCollection.findOne({
      rider_email: newRider.rider_email,
    });

    if (isExist) {
      return res.send({ message: "Already Exist", isNew: false });
    }

    const result = await ridersCollection.insertOne(newRider);

    res.send({
      success: true,
      isNew: true,
      message: "Rider data posted successfully",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Rider data post failed",
    });
  }
};

module.exports = { postRiderData };
