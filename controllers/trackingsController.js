const { trackingsCollection } = require("../db.js");

const getTrackingsByTrackingId = async (req, res) => {
  const { tracking_id } = req.params;

  try {
    const result = await trackingsCollection.find({ tracking_id }).toArray();

    res.send({
      success: true,
      message: "Trackings data successfully retrieved",
      logs: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Trackings data retrieved failed",
    });
  }
};

module.exports = { getTrackingsByTrackingId };
