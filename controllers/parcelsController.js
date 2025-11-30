const { ObjectId } = require("mongodb");
const { parcelCollection, ridersCollection } = require("../db.js");

const postParcel = async (req, res) => {
  const newParcel = req.body;

  try {
    const result = await parcelCollection.insertOne(newParcel);

    res.send({
      success: true,
      message: "Parcel data successfully uploaded",
      ...result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Parcel data uploaded failed",
    });
  }
};

const getAllParcel = async (req, res) => {
  const query = {};
  let projectFiled = {};
  const { uid, fields, excludes, limit, skip, delivery_status, rider_email } =
    req.query;
  const limitNum = Number(limit) || 0;
  const skipNum = Number(skip) || 0;

  if (rider_email) {
    query.rider_email = rider_email;
  }

  if (delivery_status) {
    query.delivery_status = {
      $nin: [...delivery_status],
    };
  }

  if (uid) {
    query.uid = uid;
  }

  if (fields) {
    const fieldsArray = fields.split(",");
    fieldsArray.forEach((field) => {
      projectFiled[field.trim()] = 1;
    });
  }

  if (excludes) {
    const excludesArray = excludes.split(",");
    excludesArray.forEach((exclude) => {
      projectFiled[exclude.trim()] = 0;
    });
  }

  if (Object.keys(projectFiled).length === 0) {
    projectFiled = null;
  }

  try {
    const result = await parcelCollection
      .find(query)
      .limit(limitNum)
      .skip(skipNum)
      .project(projectFiled)
      .toArray();

    res.send({
      success: true,
      message: "Parcels Data retrieved successfully",
      parcels: result,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "Parcels Data retrieved failed",
    });
  }
};

const getParcelById = async (req, res) => {
  const { id } = req.params;

  if (id.length !== 24) {
    res.status(400).send({
      success: false,
      message: "Invalid parcel id",
    });
  }

  const query = { _id: new ObjectId(id) };

  try {
    const result = await parcelCollection.findOne(query);

    res.send({
      success: true,
      message: "Parcel data retrieved successfully",
      parcel: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateParcelDataAndRiderStatus = async (req, res) => {
  const { id } = req.params;
  const { rider_id, rider_name, rider_email } = req.body;

  try {
    const result = await parcelCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          delivery_status: "rider_assigned",
          rider_name,
          rider_email,
        },
      }
    );

    await ridersCollection.updateOne(
      {
        _id: new ObjectId(rider_id),
      },
      {
        $set: {
          work_status: "in_delivery",
        },
      }
    );

    res.send({
      success: true,
      message: "Parcel data and rider status updated",
      ...result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "Parcel Data update failed",
    });
  }
};

const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { rider_email, delivery_status, work_status } = req.body;
  const parcelQuery = { _id: new ObjectId(id) };
  const riderQuery = { rider_email };
  let updatedRiderStatus = {};
  let updatedParcelStatus = {};

  if (delivery_status === "pending_pickup") {
    updatedParcelStatus = {
      $set: {
        delivery_status,
        rider_name: "",
        rider_email: "",
      },
    };
  } else {
    updatedParcelStatus = {
      $set: { delivery_status },
    };
  }

  try {
    const result = await parcelCollection.updateOne(
      parcelQuery,
      updatedParcelStatus
    );

    if (work_status) {
      await ridersCollection.updateOne(riderQuery, { $set: { work_status } });
    }

    res.send({
      success: true,
      message: "Successfully updated",
      ...result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      success: false,
      message: "Status update failed",
    });
  }
};

module.exports = {
  postParcel,
  getAllParcel,
  getParcelById,
  updateParcelDataAndRiderStatus,
  updateDeliveryStatus,
};
