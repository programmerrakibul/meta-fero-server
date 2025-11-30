require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client, paymentsCollection } = require("./db.js");
const { parcelsRouter } = require("./routes/parcelsRouter.js");
const { checkoutRouter } = require("./routes/checkoutRouter.js");
const { usersRouter } = require("./routes/usersRouter.js");
const { ridersRouter } = require("./routes/ridersRouter.js");
const { validateToken } = require("./middleware/validateToken.js");
const { verifyToken } = require("./middleware/verifyToken.js");
const { trackingsRouter } = require("./routes/trackingsRouter.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const run = async () => {
  try {
    await client.connect();

    app.get("/", async (req, res) => {
      res.send("Server is running");
    });

    app.use("/api/trackings", trackingsRouter);
    app.use("/api/users", validateToken, verifyToken, usersRouter);
    app.use("/api/riders", validateToken, verifyToken, ridersRouter);
    app.use("/api/parcels", validateToken, verifyToken, parcelsRouter);
    app.use("/api/parcel-checkout", validateToken, verifyToken, checkoutRouter);
    app.get(
      "/api/payment-history",
      validateToken,
      verifyToken,
      async (req, res) => {
        const { email } = req.query;

        if (!email) {
          return res.status(400).send({ message: "Bad Request" });
        }

        try {
          const result = await paymentsCollection
            .find({ customer_email: email })
            .toArray();

          res.send({
            success: true,
            message: "Payment history retrieved successfully",
            payments: result,
          });
        } catch (err) {
          console.log(err);
          res.status(500).send({
            success: false,
            message: "Payment history retrieved failed",
          });
        }
      }
    );

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    app.listen(port, () => {
      console.log("Server running in port: ", port);
    });
  } finally {
    // await client.close()
  }
};

run().catch(console.dir);
