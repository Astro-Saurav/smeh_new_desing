const axios = require('axios');

async function createDummyNews() {
  try {
    const apiBase = 'https://smeh-new-desing.vercel.app/api';
    
    console.log('Logging in...');
    const loginRes = await axios.post(`${apiBase}/auth/login`, {
      email: 'admin@smeh.manavrachna.net',
      password: 'admin@smeh@manavrachna'
    });
    
    const token = loginRes.data.token;
    
    console.log('Fetching categories to get Campus Buzz ID...');
    const catRes = await axios.get(`${apiBase}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let campusCat = catRes.data.find(c => c.name === 'Campus Buzz');
    
    if (!campusCat) {
       console.log('Adding Campus Buzz...');
       const newCat = await axios.post(`${apiBase}/categories`, { name: 'Campus Buzz' }, {
         headers: { Authorization: `Bearer ${token}` }
       });
       campusCat = newCat.data;
    }

    console.log('Got category ID:', campusCat._id);

    console.log('Creating News Post...');
    const newsRes = await axios.post(`${apiBase}/news`, {
      title: 'Testing Dynamic Video Content',
      content: 'Here is our new test video: https://www.youtube.com/watch?v=Uw7IdqZ46bE',
      categoryId: campusCat._id,
      imageUrl: 'https://i.ytimg.com/vi/DSSjGSoFfk0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBgI6a9luBPUtdXggdFFq7x4oTtuQ',
      status: 'published'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('News successfully created:', newsRes.data);
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Network Error:', err.message);
    }
  }
}

createDummyNews();
