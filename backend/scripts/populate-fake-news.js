const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:8080/api';
const IMAGES_DIR = 'C:\\Users\\0501s\\Pictures\\wall';

async function main() {
  console.log('Logging in as admin...');
  let token;
  try {
    const loginRes = await axios.post(`${API_URL}/v1/auth/login`, {
      email: 'admin@mrt.edu.in',
      password: 'Admin@123'
    });
    token = loginRes.data.data?.accessToken || loginRes.data.accessToken || loginRes.data.data?.token || loginRes.data.token;
    console.log('Logged in successfully, token:', token.substring(0, 15) + '...');
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    return;
  }

  const axiosAuth = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('Fetching categories...');
  const categoriesRes = await axiosAuth.get(`${API_URL}/v1/categories`);
  const responseBody = categoriesRes.data;
  let categories = [];
  if (Array.isArray(responseBody)) categories = responseBody;
  else if (Array.isArray(responseBody.data)) categories = responseBody.data;
  else if (responseBody.data && Array.isArray(responseBody.data.items)) categories = responseBody.data.items;
  
  if (categories.length === 0) {
    console.log('No categories found!');
    return;
  }

  const images = fs.readdirSync(IMAGES_DIR).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
  if (images.length === 0) {
    console.log('No images found in', IMAGES_DIR);
    return;
  }

  let count = 1;

  for (const category of categories) {
    console.log(`\nPopulating category: ${category.name}`);
    for (let i = 1; i <= 10; i++) {
      try {
        // 1. Upload random image
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const imagePath = path.join(IMAGES_DIR, randomImage);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        const uploadRes = await axiosAuth.post(`${API_URL}/v1/upload`, formData, {
          headers: formData.getHeaders()
        });
        
        const mediaId = uploadRes.data.data.id;

        // 2. Create article
        const title = `Breaking News in ${category.name}: Story #${i}`;
        const content = `<p>This is a detailed fake news article for ${category.name} created automatically. It has rich text formatting.</p><p>Here is another paragraph with more information about the subject.</p>`;
        
        await axiosAuth.post(`${API_URL}/v1/news`, {
          title,
          excerpt: `Summary of the breaking news in ${category.name} #${i}`,
          content,
          categoryId: category.id,
          thumbnailMediaId: mediaId,
          status: 'published',
          visibility: 'public',
          isFeatured: i <= 2 // Make the first 2 featured
        });

        console.log(`  [${count}/90] Created article: ${title}`);
        count++;
      } catch (err) {
        console.error(`  Failed to create article #${i} in ${category.name}:`, err.response?.data || err.message);
      }
    }
  }
  
  console.log('\nAll done! 90 articles created.');
}

main();
