import { connectToDB, closeDB } from '../helpers/db';

async function setupCollections() {
  try {
    const db = await connectToDB();

    // Setup 'members' collection
    const membersCollectionName = 'members';
    const membersCollections = await db.listCollections({ name: membersCollectionName }).toArray();

    if (membersCollections.length === 0) {
      await db.createCollection(membersCollectionName, {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['LAST', 'FIRST', 'MEMBERIDNO'],
            properties: {
              LAST: { bsonType: 'string' },
              FIRST: { bsonType: 'string' },
              NICKNAME: { bsonType: 'string' },
              BIRTHDAY: { bsonType: 'string' },
              SEX: { bsonType: 'string' },
              WEDDING: { bsonType: 'string' },
              SPOUSE: { bsonType: 'string' },
              MEMBERIDNO: { bsonType: 'string' },
              CHAPTER: { bsonType: 'string' },
              SERVICE: { bsonType: 'string' },
              HHHEAD: { bsonType: 'string' },
              EMAIL: { bsonType: 'string' },
              ACTIVITY: { bsonType: 'int' },
            },
          },
        },
      });
      console.log(`Collection '${membersCollectionName}' created with schema validation.`);
    } else {
      console.log(`Collection '${membersCollectionName}' already exists.`);
    }

    await db.collection(membersCollectionName).createIndex({ MEMBERIDNO: 1 }, { unique: true });
    console.log('Unique index created on MEMBERIDNO.');

    // Setup 'attendance' collection
    const attendanceCollectionName = 'attendance';
    const attendanceCollections = await db
      .listCollections({ name: attendanceCollectionName })
      .toArray();

    if (attendanceCollections.length === 0) {
      await db.createCollection(attendanceCollectionName, {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['FIRST', 'LAST', 'MEMBERIDNO'],
            properties: {
              FIRST: { bsonType: 'string' },
              LAST: { bsonType: 'string' },
              MEMBERIDNO: { bsonType: 'string' },
              JAN: { bsonType: 'int' },
              FEB: { bsonType: 'int' },
              MAR: { bsonType: 'int' },
              APR: { bsonType: 'int' },
              MAY: { bsonType: 'int' },
              JUN: { bsonType: 'int' },
              JUL: { bsonType: 'int' },
              AUG: { bsonType: 'int' },
              SEP: { bsonType: 'int' },
              OCT: { bsonType: 'int' },
              NOV: { bsonType: 'int' },
              DEC: { bsonType: 'int' },
            },
          },
        },
      });
      console.log(`Collection '${attendanceCollectionName}' created with schema validation.`);
    } else {
      console.log(`Collection '${attendanceCollectionName}' already exists.`);
    }

    await db.collection(attendanceCollectionName).createIndex({ MEMBERIDNO: 1 }, { unique: true });
    console.log('Unique index created on MEMBERIDNO.');
  } catch (err) {
    console.error('Error setting up collections:', err);
  } finally {
    await closeDB();
  }
}

setupCollections();
