import { connectDB, closeDB } from '../config/db.js';
import mongoose from 'mongoose';

async function migrate() {
  await connectDB();
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  const cursor = usersCollection.find({});
  let count = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (typeof doc.avatar === 'string') {
      await usersCollection.updateOne(
        { _id: doc._id },
        { $set: { avatar: { url: doc.avatar, publicId: null } } }
      );
      count++;
      console.log('Migrated avatar for:', doc.email);
    }
  }
  console.log(`Migration finished successfully. Updated ${count} users.`);
  await closeDB();
}

migrate().catch(console.error);
