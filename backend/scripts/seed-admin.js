const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI not found in .env file');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('Connected successfully.');

    // New desired credentials
    const email = 'admin@smeh.manavrachna.net';
    const password = 'admin@smeh@manavrachna';
    
    // Cleanup collections to resolve BSON/Type mismatch 500 errors
    console.log('Cleaning up existing data to ensure format consistency...');
    await mongoose.connection.db.collection('categories').deleteMany({});
    await mongoose.connection.db.collection('users').deleteMany({});
    console.log('Data cleanup completed.');

    const User = mongoose.model('User', new mongoose.Schema({
      _id: String,
      email: String,
      password_hash: String,
      role: String
    }));

    // Upsert the new admin with String ID
    console.log(`Setting up admin user: ${email}...`);
    const password_hash = await bcrypt.hash(password, 12);
    
    // We generate a deterministic ID or a UUID string
    const adminId = '11111111-1111-1111-1111-111111111111';

    await User.findOneAndUpdate(
      { email },
      { _id: adminId, email, password_hash, role: 'admin' },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('-----------------------------------------');
    console.log('Admin User Ready and Synced!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------------');
    console.log('IMPORTANT: Run this command locally, then refresh Vercel.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedAdmin();
