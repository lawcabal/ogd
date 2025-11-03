import { Collection } from 'mongodb';
import { Member } from '../types/member';

export async function findMemberViaLastFirstName(
  spouseField: string,
  collection: Collection<Member>
): Promise<Member | null> {
  const [spouseLast, spouseFirst] = spouseField.split('|').map((s: string) => s.trim());

  const spouseRecord = await collection.findOne({
    LAST: spouseLast,
    FIRST: spouseFirst,
  });

  return spouseRecord;
}
