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
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password_hash: String,
      role: String
    }));

    // Cleanup old default if it exists
    await User.deleteOne({ email: 'admin@smeh.com' });
    console.log('Cleaned up previous default user.');

    // Upsert the new admin
    console.log(`Setting up admin user: ${email}...`);
    const password_hash = await bcrypt.hash(password, 12);
    
    await User.findOneAndUpdate(
      { email },
      { email, password_hash, role: 'admin' },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('-----------------------------------------');
    console.log('Admin User Updated Successfully!');
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

