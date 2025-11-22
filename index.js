require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client } = require("./db.js");
const { parcelsRouter } = require("./routes/parcelsRouter.js");
const { checkoutRouter } = require("./routes/checkoutRouter.js");

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

    app.use("/api/parcels", parcelsRouter);
    app.use("/api/parcel-checkout", checkoutRouter);
    app.get("/api/payment-history", (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res.status(400).send({ message: "Bad Request" });
      }
    });

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
