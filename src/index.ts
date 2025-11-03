import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("testdb");
    const collection = db.collection("testcollection");

    const result = await collection.insertOne({
      name: "CIBC Victoria",
      date: new Date(),
    });
    console.log("Inserted document:", result.insertedId);

    const docs = await collection.find().toArray();
    console.log("Documents:", docs);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
