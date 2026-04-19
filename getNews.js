const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('https://smeh-new-desing.vercel.app/api/news?page=1&pageSize=5');
    console.log("Returned news items:", JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.log(e.message);
  }
}
run();
