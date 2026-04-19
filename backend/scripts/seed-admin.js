const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
    await mongoose.connection.db.dropDatabase();
    console.log('Database wiped completely.');
    console.log('Connected successfully.');

    // 1. Setup Admin User
    const email = 'admin@smeh.manavrachna.net';
    const password = 'admin@smeh@manavrachna';
    const adminId = '11111111-1111-1111-1111-111111111111';

    console.log('Syncing Admin User...');
    const User = mongoose.model('User', new mongoose.Schema({
      _id: String,
      email: String,
      password_hash: String,
      role: String
    }));

    const password_hash = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
      { email },
      { _id: adminId, email, password_hash, role: 'admin' },
      { upsert: true, returnDocument: 'after' }
    );

    // 2. Setup Default Categories
    const defaultCategories = [
      'Campus Buzz',
      'Latest Buzz',
      'Beyond Campus',
      'Social Buzz',
      'Manav Rachna TV',
      'Podcast',
      'Blog',
      'Achievements',
      'Announcement',
      'Gallery'
    ];

    console.log('Syncing Default Categories...');
    const Category = mongoose.model('Category', new mongoose.Schema({
      _id: String,
      name: String
    }));

    for (const catName of defaultCategories) {
      const existing = await Category.findOne({ name: catName });
      if (!existing) {
        console.log(`Creating category: ${catName}`);
        await Category.create({
          _id: uuidv4(),
          name: catName
        });
      } else {
        console.log(`Category exists: ${catName}`);
      }
    }

    console.log('-----------------------------------------');
    console.log('Seeding Completed Successfully!');
    console.log('Admin and Default Categories are ready.');
    console.log('-----------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedAdmin();
