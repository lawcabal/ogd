/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs'; // for createReadStream
import * as fsPromises from 'fs/promises'; // for readdir, etc.
import csv from 'csv-parser';
import path from 'path';
import { closeDB, connectToDB } from '../helpers/db';
import { Member } from '../types/member';
import { Db } from 'mongodb';

async function importActivities() {
  const dirPath = path.resolve(__dirname, '../../data/activities');
  const db = await connectToDB(); // Open DB once
  try {
    const files = await fsPromises.readdir(dirPath);
    for (const file of files) {
      console.log(file);
      await processActivityFile(file, dirPath, db); // Await properly
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  } finally {
    await closeDB(); // Close DB once
  }
}

async function processActivityFile(activityFile: string, dirPath: string, db: any) {
  const filePath = path.join(dirPath, activityFile);
  const names: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        names.push({ FIRST: row.FIRST, LAST: row.LAST });
      })
      .on('end', async () => {
        try {
          for (const aName of names) {
            await updateActivity(aName.FIRST, aName.LAST, db);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function updateActivity(first: string, last: string, db: Db) {
  const collection = db.collection<Member>('members');
  const filter = { LAST: last, FIRST: first }; // Note: LAST and FIRST were reversed
  const update = { $inc: { ACTIVITY: 1 } };

  const result = await collection.findOneAndUpdate(filter, update, {
    returnDocument: 'after',
  });
  if (result?.ACTIVITY === undefined) {
    console.log(`Updated Failed: ${first} ${last}`);
  }
}

importActivities();
