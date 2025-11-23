const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("meta-fero");
const usersCollection = database.collection("users");
const ridersCollection = database.collection("riders");
const parcelCollection = database.collection("parcels");
const paymentsCollection = database.collection("payments");

module.exports = {
  client,
  usersCollection,
  ridersCollection,
  parcelCollection,
  paymentsCollection,
};
