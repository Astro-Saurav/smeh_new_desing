const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Increase tolerance for finding the .env
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

async function debugDb() {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
    console.log('--- DB DIAGNOSTIC ---');
    
    const collections = ['categories', 'users', 'news'];
    
    for (const col of collections) {
      const records = await mongoose.connection.db.collection(col).find().limit(3).toArray();
      console.log(`\nCollection: ${col}`);
      records.forEach(r => {
        const idType = (r._id instanceof mongoose.Types.ObjectId) ? 'ObjectId' : typeof r._id;
        console.log(`  _id: ${r._id} | Type: ${idType}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Debug Error:', err);
    process.exit(1);
  }
}

debugDb();
