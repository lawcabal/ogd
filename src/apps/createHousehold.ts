import path from 'path';
import * as fs from 'fs';
import { connectToDB, closeDB } from '../helpers/db';
import { findMemberViaLastFirstName } from '../helpers/memberHelper';
import { Member } from '../types/member';
import { getAttendance } from '../helpers/findAttendance';

async function createHousehold() {
  try {
    const collectionName = 'members';
    const filePath = path.join(__dirname, '../../data/householdList.csv');

    fs.writeFileSync(
      filePath,
      'HHLast, HHFirst, MemberLast, MemberFirst, HouseholdAttendance, ActivityAttendance\n'
    );

    const db = await connectToDB();
    const collection = db.collection<Member>(collectionName);

    const queryHHH = {
      $or: [{ SERVICE: 'HH' }],
    };

    const householdHeads = await collection.find(queryHHH).toArray();

    for (const householdHead of householdHeads) {
      const householdLeader = await findMemberViaLastFirstName(householdHead.SPOUSE, collection);

      const houseHoldHeadAttendance = await getAttendance(
        householdHead.FIRST,
        householdHead.LAST,
        db
      );

      fs.appendFile(
        filePath,
        `${householdHead.LAST}, ${householdHead.FIRST},,,${houseHoldHeadAttendance}, ${householdHead.ACTIVITY}\n`,
        'utf8',
        (err) => {
          if (err) {
            console.error('Error appending to file:', err);
          }
        }
      );

      if (householdLeader) {
        const householdLeaderAttendance = await getAttendance(
          householdLeader.FIRST,
          householdLeader.LAST,
          db
        );

        fs.appendFile(
          filePath,
          `${householdLeader.LAST}, ${householdLeader.FIRST},,,${householdLeaderAttendance},${householdLeader.ACTIVITY}\n`,
          'utf8',
          (err) => {
            if (err) {
              console.error('Error appending to file:', err);
            }
          }
        );
      }

      // find all members with that household head
      const queryMembers = {
        $or: [{ HHHEAD: `${householdHead.LAST}| ${householdHead.FIRST}` }],
      };

      const members = await collection.find(queryMembers).toArray();

      for (const member of members) {
        const memberAttendance = await getAttendance(member.FIRST, member.LAST, db);
        fs.appendFile(
          filePath,
          `,,${member.LAST}, ${member.FIRST}, ${memberAttendance}, ${member.ACTIVITY}\n`,
          'utf8',
          (err) => {
            if (err) {
              console.error('Error appending to file:', err);
            }
          }
        );
      }
    }
  } catch (err) {
    console.error('Error querying members:', err);
  } finally {
    await closeDB();
  }
}

createHousehold();
