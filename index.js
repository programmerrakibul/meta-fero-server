require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { client } = require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Server is running");
});

const run = async () => {
  try {
    await client.connect();

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
