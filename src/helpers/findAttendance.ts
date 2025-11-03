import { Db } from 'mongodb';
import { Attendance } from '../types/attendance';

export async function getAttendance(FIRST: string, LAST: string, db: Db): Promise<number> {
  const collectionName = 'attendance';
  const collection = db.collection<Attendance>(collectionName);

  const attendanceRecord = await collection.findOne({
    LAST: LAST,
    FIRST: FIRST,
  });

  let attendanceTotal = 0;

  if (attendanceRecord) {
    attendanceTotal =
      attendanceRecord.JAN +
      attendanceRecord.FEB +
      attendanceRecord.MAR +
      attendanceRecord.APR +
      attendanceRecord.MAY +
      attendanceRecord.JUN +
      attendanceRecord.JUL +
      attendanceRecord.AUG +
      attendanceRecord.SEP +
      attendanceRecord.OCT +
      attendanceRecord.NOV +
      attendanceRecord.DEC;
  }

  return attendanceTotal;
}
