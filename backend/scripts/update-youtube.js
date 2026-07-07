const { prisma, connectDB, disconnectDB } = require('../src/config/db');

async function main() {
  await connectDB();
  const url = 'https://www.youtube.com/watch?v=z9rH9xkdpuI';
  const result = await prisma.news.updateMany({
    data: {
      youtube_url: url
    }
  });
  console.log(`Updated ${result.count} articles with the YouTube URL.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await disconnectDB();
  });
