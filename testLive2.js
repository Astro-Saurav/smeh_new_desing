const http = require('https');
const axios = require('axios');

async function test() {
  try {
    const apiBase = 'https://smeh-new-desing.vercel.app/api';
    
    console.log('Logging in...');
    const loginRes = await axios.post(`${apiBase}/auth/login`, {
      email: 'admin@smeh.manavrachna.net',
      password: 'admin@smeh@manavrachna'
    });
    
    const token = loginRes.data.token;
    
    console.log('Fetching categories with token...');
    const catRes = await axios.get(`${apiBase}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Categories status:', catRes.status);
    console.log('Categories count:', catRes.data.length);
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Network Error:', err.message);
    }
  }
}

test();
