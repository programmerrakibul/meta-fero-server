require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client } = require("./db.js");
const { parcelsRouter } = require("./routes/parcelsRouter.js");

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
