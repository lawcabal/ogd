import { connectToDB, closeDB } from '../helpers/db';
import { findMemberViaLastFirstName } from '../helpers/memberHelper';
import { Member } from '../types/member';

async function noWeddingDate() {
  try {
    const collectionName = 'members';

    const db = await connectToDB();
    const collection = db.collection<Member>(collectionName);

    const query = {
      $or: [{ WEDDING: { $exists: false } }, { WEDDING: '' }],
    };

    const projection = {
      FIRST: 1,
      LAST: 1,
      HHHEAD: 1,
      _id: 0,
    };

    const cursor = collection.find(query).project(projection);
    const results = await cursor.toArray();

    console.log('No Wedding Dates:');

    for (const member of results) {
      const householdHead = await findMemberViaLastFirstName(member.HHHEAD, collection);
      if (householdHead !== null) {
        console.log(
          `${member.FIRST} ${member.LAST} household head : ${householdHead.FIRST} ${householdHead.LAST}`
        );
      }
    }
  } catch (err) {
    console.error('Error querying members:', err);
  } finally {
    await closeDB();
  }
}

noWeddingDate();
