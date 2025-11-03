/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { connectToDB, closeDB } from '../helpers/db';

const csvFilePath = path.join(__dirname, '../../data/AttendanceReport.csv');

async function importAttendance() {
  const collectionName = 'attendance';
  const attendance: any[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      attendance.push({
        FIRST: row.FIRST,
        LAST: row.LAST,
        JAN: parseInt(row.JAN, 10),
        FEB: parseInt(row.FEB, 10),
        MAR: parseInt(row.MAR, 10),
        APR: parseInt(row.APR, 10),
        MAY: parseInt(row.MAY, 10),
        JUN: parseInt(row.JUN, 10),
        JUL: parseInt(row.JUL, 10),
        AUG: parseInt(row.AUG, 10),
        SEP: parseInt(row.SEP, 10),
        OCT: parseInt(row.OCT, 10),
        NOV: parseInt(row.NOV, 10),
        DEC: parseInt(row.DEC, 10),
        MEMBERIDNO: row.MEMBERIDNO,
      });
    })
    .on('end', async () => {
      if (attendance.length > 0) {
        try {
          const db = await connectToDB();
          const collection = db.collection(collectionName);

          const result = await collection.insertMany(attendance);
          console.log(`Inserted ${result.insertedCount} attendance records.`);
        } catch (err) {
          console.error('Error inserting data:', err);
        } finally {
          await closeDB();
        }
      }
    });
}

importAttendance();
