import { connectToDB, closeDB } from '../helpers/db';
import { findMemberViaLastFirstName } from '../helpers/memberHelper';
import * as fs from 'fs';
import * as path from 'path';
import { Member } from '../types/member';

async function findSpouses() {
  const db = await connectToDB();
  const collection = db.collection<Member>('members');

  try {
    const maleMembers = await collection.find({ SEX: 'M' }).toArray();
    // Define file path
    const filePath = path.join(__dirname, '../../data/forCocl.csv');
    fs.writeFileSync(
      filePath,
      'BroMemberId, BroFirstName, BroLastName, BroNickName, BroBirthday, BroEmail, SisMemberId, SisFirstName, SisLastName, SisNickName, SisBirthday, SisEmail, Wedding, Chapter, HouseHoldHead'
    );

    for (const member of maleMembers) {
      const spouseField = member.SPOUSE;
      if (!spouseField || !spouseField.includes('|')) {
        console.log(`Skipping ${member.FIRST} ${member.LAST}: Invalid SPOUSE format.`);
        continue;
      }

      const spouseRecord = await findMemberViaLastFirstName(spouseField, collection);

      if (spouseRecord) {
        fs.appendFile(
          filePath,
          `\n${member.MEMBERIDNO}, ${member.FIRST}, ${member.LAST}, ${member.NICKNAME}, ${member.BIRTHDAY}, ${member.EMAIL}, ${spouseRecord.MEMBERIDNO}, ${spouseRecord.FIRST}, ${spouseRecord.LAST}, ${spouseRecord.NICKNAME}, ${spouseRecord.BIRTHDAY}, ${spouseRecord.EMAIL}, ${member.WEDDING}, ${member.CHAPTER}, ${member.HHHEAD}`,
          'utf8',
          (err) => {
            if (err) {
              console.error('Error appending to file:', err);
            }
          }
        );
      } else {
        console.log(`${member.FIRST} ${member.LAST} → Spouse not found!wd`);
      }
    }
  } catch (err) {
    console.error('Error finding spouses:', err);
  } finally {
    await closeDB();
  }
}

findSpouses();
