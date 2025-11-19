const { parcelCollection } = require("../db.js");

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
  const { uid, fields, excludes, limit, skip } = req.query;
  const limitNum = Number(limit) || 0;
  const skipNum = Number(skip) || 0;

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

module.exports = { postParcel, getAllParcel };
