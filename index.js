const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyToken(req,res,next){
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:"unauthorized access"});
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403).send({message:"Forbideen access"})
    }
    req.decoded=decoded;
  })
  next()

}

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
    //all data load
    app.get("/inventors", async (req, res) => {
      const query = {};
      const cursor = ItemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    // single data load 
    app.get("/inventors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await ItemsCollection.findOne(query);
      res.send(item);
    });
    // auth 
    app.post('/login',async(req,res)=>{
      const user=req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'1d'
      });
      
      res.send({token})

    })
    //post
    app.post("/inventors",verifyToken, async (req, res) => { 
      const decodedEmail =req.decoded.email;
      const email=req.body.email;
      if (email===decodedEmail) {
        const newInventor = req.body;
      const result = await ItemsCollection.insertOne(newInventor);
      res.send(result);
      }else{
        res.status(403).send({message:"Forbidden access"})
      }
    });
    //delete
    app.delete("/inventors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deleted = await ItemsCollection.deleteOne(query);
      res.send(deleted);
    });
    //update
    app.put("/inventors/:id",verifyToken, async (req, res) => {
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
  res.send("Iphone-warehouse");
});
app.listen(port, () => {
  console.log(`iphone-warehouse start ${port}`);
});
