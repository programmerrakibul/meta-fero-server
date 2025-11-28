const { ObjectId } = require("mongodb");
const { ridersCollection, usersCollection } = require("../db.js");

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

const getRidersData = async (req, res) => {
  try {
    const result = await ridersCollection.find({}).toArray();

    res.send({
      success: true,
      message: "Rider data successfully retrieved",
      riders: result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "Rider data retrieved failed",
    });
  }
};

const updateRiderStatus = async (req, res) => {
  const { riderId } = req.params;

  if (riderId.length !== 24) {
    return res.status(400).send({
      message: "Invalid ID",
    });
  }

  const filter = { _id: new ObjectId(riderId) };

  const updatedDoc = {
    $set: req.body,
  };

  try {
    const result = await ridersCollection.updateOne(filter, updatedDoc);

    if (result.modifiedCount && req.body?.status === "approved") {
      const result = await usersCollection.updateOne(
        {
          email: req.body.rider_email,
        },
        {
          $set: {
            role: "rider",
          },
        }
      );
    }

    res.send({
      success: true,
      message: "Rider data successfully updated",
      ...result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "Rider data update failed",
    });
  }
};

module.exports = { postRiderData, getRidersData, updateRiderStatus };
