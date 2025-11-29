const admin = require("firebase-admin");

const decoded = Buffer.from(
  process.env.FIREBASE_SERVICE_KEY,
  "base64"
).toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  const idToken = req.token_id;
  const decoded = await admin.auth().verifyIdToken(idToken);

  if (!decoded) {
    return res.status(403).send({
      message: "Forbidden access",
    });
  }

  req.token_email = decoded.email;
  next();
};

module.exports = { verifyToken };
