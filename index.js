const express = require("express");
const cors = require("cours");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use();
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://iphone-warehouse-user:<password>@cluster0.awfqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

app.get("/", (req, res) => {
  res.send("hello world");
});
