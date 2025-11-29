const { usersCollection } = require("../db");

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded_email;

  try {
    const user = await usersCollection.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({
        message: "Forbidden access",
      });
    }

    next();
  } catch (err) {
    res.status(403).send({
      message: "Forbidden access",
    });
  }
};

module.exports = { verifyAdmin };
