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

module.exports = { postParcel };
