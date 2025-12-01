const { ObjectId } = require("mongodb");
const {
  ridersCollection,
  usersCollection,
  parcelCollection,
} = require("../db.js");

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
  const { status, work_status, rider_district } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (work_status) {
    query.work_status = work_status;
  }

  if (rider_district) {
    query.rider_district = rider_district;
  }

  try {
    const result = await ridersCollection.find(query).toArray();

    res.send({
      success: true,
      message: "Rider data successfully retrieved",
      riders: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Rider data retrieved failed",
    });
  }
};

const getPerDayDeliveryStats = async (req, res) => {
  const { email } = req.query;
  const pipeline = [
    {
      $match: {
        rider_email: email,
        delivery_status: "parcel_delivered",
      },
    },
    {
      $lookup: {
        from: "trackings",
        localField: "tracking_id",
        foreignField: "tracking_id",
        as: "parcel_trackings",
      },
    },
    {
      $unwind: "$parcel_trackings",
    },
    {
      $match: {
        "parcel_trackings.status": "parcel_delivered",
      },
    },
    {
      $addFields: {
        delivery_date: {
          $substr: ["$parcel_trackings.created_at", 0, 10],
        },
      },
    },
    {
      $group: {
        _id: "$delivery_date",
        date: { $first: "$delivery_date" },
        delivery_count: { $sum: 1 },
        last_delivery_time: { $last: "$parcel_trackings.created_at" },
      },
    },
  ];

  try {
    const result = await parcelCollection.aggregate(pipeline).toArray();

    res.send(result);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Per day delivery status stats retrieved failed",
    });
  }
};

const updateRiderStatus = async (req, res) => {
  const { riderId } = req.params;
  const { status } = req.body;

  if (riderId.length !== 24) {
    return res.status(400).send({
      message: "Invalid ID",
    });
  }

  const filter = { _id: new ObjectId(riderId) };

  let updatedDoc = {};

  if (status === "approved") {
    updatedDoc = {
      $set: {
        status,
        work_status: "available",
      },
    };
  } else {
    updatedDoc = {
      $set: req.body,
    };
  }

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
    res.status(500).send({
      success: false,
      message: "Rider data update failed",
    });
  }
};

module.exports = {
  postRiderData,
  getRidersData,
  updateRiderStatus,
  getPerDayDeliveryStats,
};
