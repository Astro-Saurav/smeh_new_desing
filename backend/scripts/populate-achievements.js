const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/v1';
const IMAGES_DIR = 'C:\\Users\\0501s\\Pictures\\wall';

async function main() {
  console.log('Logging in as admin...');
  let token;
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@mrt.edu.in',
      password: 'Admin@123'
    });
    token = loginRes.data.data?.accessToken || loginRes.data.accessToken || loginRes.data.data?.token || loginRes.data.token;
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    return;
  }

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('Checking categories...');
  const categoriesRes = await axiosAuth.get(`${API_URL}/categories`);
  const responseBody = categoriesRes.data;
  let categories = [];
  if (Array.isArray(responseBody)) categories = responseBody;
  else if (Array.isArray(responseBody.data)) categories = responseBody.data;
  else if (responseBody.data && Array.isArray(responseBody.data.items)) categories = responseBody.data.items;
  
  let achievementsCat = categories.find(c => c.slug === 'achievements');
  if (!achievementsCat) {
    console.log('Creating Achievements category...');
    const createRes = await axiosAuth.post(`${API_URL}/categories`, {
      name: 'Achievements',
      slug: 'achievements'
    });
    achievementsCat = createRes.data.data || createRes.data;
  }

  const images = fs.readdirSync(IMAGES_DIR).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
  
  console.log(`\nPopulating category: Achievements`);
  for (let i = 1; i <= 10; i++) {
    try {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const imagePath = path.join(IMAGES_DIR, randomImage);
      
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));

      const uploadRes = await axiosAuth.post(`${API_URL}/upload`, formData, {
        headers: formData.getHeaders()
      });
      
      const mediaId = uploadRes.data.data.id;

      const title = `Breaking News in Achievements: Story #${i}`;
      const content = `<p>This is a detailed fake news article for Achievements created automatically.</p>`;
      
      await axiosAuth.post(`${API_URL}/news`, {
        title,
        excerpt: `Summary of the breaking news in Achievements #${i}`,
        content,
        categoryId: achievementsCat.id,
        thumbnailMediaId: mediaId,
        status: 'published',
        visibility: 'public',
        isFeatured: i <= 2
      });

      console.log(`  Created article #${i}`);
    } catch (err) {
      console.error(`  Failed to create article #${i}:`, err.response?.data || err.message);
    }
  }
  
  console.log('\nDone creating 10 articles in Achievements!');
}

main();
