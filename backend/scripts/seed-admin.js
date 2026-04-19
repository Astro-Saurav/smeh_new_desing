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

    const email = 'admin@smeh.com';
    const password = 'admin123';
    
    // Check if user already exists
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password_hash: String,
      role: String
    }));

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User ${email} already exists.`);
      process.exit(0);
    }

    console.log(`Creating user ${email}...`);
    const password_hash = await bcrypt.hash(password, 12);
    
    await User.create({
      email,
      password_hash,
      role: 'admin'
    });

    console.log('-----------------------------------------');
    console.log('Admin User Created Successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------------');
    console.log('You can now log in at /admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seedAdmin();
