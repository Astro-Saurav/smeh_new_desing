const axios = require('axios');

async function testLoginAndUpload() {
  try {
    console.log('Logging in to Vercel API...');
    const result = await axios.post('https://smeh-new-desing.vercel.app/api/auth/login', {
      email: 'admin@smeh.manavrachna.net',
      password: 'admin@smeh@manavrachna'
    });
    
    console.log('Login Response:', result.data.user);
    
    const token = result.data.token;
    console.log('Token extracted. Trying upload route with token...');
    
    try {
      const uploadRes = await axios.post('https://smeh-new-desing.vercel.app/api/upload', {
        base64Data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
        fileName: "test.png",
        mimeType: "image/png"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Upload Result:', uploadRes.status, uploadRes.data);
    } catch (err2) {
      console.log('Upload Error:', err2.response?.status, err2.response?.data);
    }
    
  } catch (err) {
    console.log('Login Error:', err.response?.status, err.response?.data);
  }
}

testLoginAndUpload();
