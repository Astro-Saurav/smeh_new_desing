const axios = require('axios');
async function testPublic() {
  try {
    const res = await axios.get('https://smeh-new-desing.vercel.app/api/news');
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Error:', err.response.status, err.response.data);
    } else {
      console.log('Network Error:', err.message);
    }
  }
}
testPublic();
