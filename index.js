const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.awfqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const ItemsCollection = client.db("iphone-warehouse").collection("items");
    console.log("DB connet");
    app.get("/inventors", async (req, res) => {
      const query = {};
      const cursor = ItemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get("/inventors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await ItemsCollection.findOne(query);
      res.send(item);
    });
    //post
    app.post("/inventors", async (req, res) => {
      const newInventor = req.body;
      const result = await ItemsCollection.insertOne(newInventor);
      res.send(result);
    });
    //delete
    app.delete("/inventors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleted = await ItemsCollection.deleteOne(query);
      res.send(deleted);
    });
    //update
    app.put("/inventors/:id", async (req, res) => {
      const id = req.params.id;
      const updateInventor = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateInventor.quantity,
        },
      };
      const result = await ItemsCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dur);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port, () => {
  console.log(`iphone-warehouse start ${port}`);
});
