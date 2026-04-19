const axios = require('axios');

async function testUploadFailed() {
  try {
    console.log('Logging in...');
    const result = await axios.post('https://smeh-new-desing.vercel.app/api/auth/login', {
      email: 'admin@smeh.manavrachna.net',
      password: 'admin@smeh@manavrachna'
    });
    
    const token = result.data.token;
    console.log('Token acquired. Uploading...');
    
    try {
      const uploadRes = await axios.post('https://smeh-new-desing.vercel.app/api/upload', {
        base64Data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        fileName: "test.png",
        mimeType: "image/png"
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Upload Result:', uploadRes.status, uploadRes.data);
    } catch (e) {
      console.error('Upload Error:', e.response?.status, e.response?.data);
    }
  } catch (err) {
    console.error('Login Error:', err.response?.status, err.response?.data);
  }
}
testUploadFailed();
