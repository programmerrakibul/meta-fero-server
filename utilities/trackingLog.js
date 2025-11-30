const { trackingsCollection } = require("../db.js");

const trackingLog = async (status, tracking_id) => {
  const log = {
    tracking_id,
    status,
    details: status.replaceAll("_", " "),
    created_at: new Date().toISOString(),
  };

  const result = await trackingsCollection.insertOne(log);

  return result;
};

module.exports = { trackingLog };
