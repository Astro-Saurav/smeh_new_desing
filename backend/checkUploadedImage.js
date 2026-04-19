const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const MONGODB_URI = process.env.MONGODB_URI;

async function checkNews() {
  await mongoose.connect(MONGODB_URI);
  const News = mongoose.model('News', new mongoose.Schema({ title: String, image_url: String, image: String }, { strict: false }));
  const newsItem = await News.findOne({}).sort({ created_at: -1 });
  console.log("Recent news image_url:", newsItem.image_url || newsItem.image);
  process.exit(0);
}
checkNews();
