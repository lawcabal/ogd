import { MongoClient, Db } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "mydatabase";

let dbInstance: Db | null = null;

export async function connectToDB(): Promise<Db> {
  if (!dbInstance) {
    await client.connect();
    dbInstance = client.db(dbName);
  }
  return dbInstance;
}

export async function closeDB(): Promise<void> {
  await client.close();
  dbInstance = null;
}
