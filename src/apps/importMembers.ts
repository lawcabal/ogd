/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { connectToDB, closeDB } from '../helpers/db';

const csvFilePath = path.join(__dirname, '../../data/members.csv');

async function importMembers() {
  const collectionName = 'members';
  const members: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.STATUS === 'ACTIVE') {
        const { STATUS, CHAPTER, ...filteredRow } = row; // Remove STATUS field

        // Extract last value from CHAPTER
        const chapterParts = CHAPTER.split('>').map((part: string) => part.trim());
        const finalChapter = chapterParts[chapterParts.length - 1];

        filteredRow.CHAPTER = finalChapter;
        filteredRow.ACTIVITY = 0;

        members.push(filteredRow);
      }
    })
    .on('end', async () => {
      try {
        const db = await connectToDB();
        const collection = db.collection(collectionName);

        const result = await collection.insertMany(members);
        console.log(`Inserted ${result.insertedCount} active members.`);
      } catch (err) {
        console.error('Error inserting data:', err);
      } finally {
        await closeDB();
      }
    });
}

importMembers();
