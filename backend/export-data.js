const { prisma, connectDB, disconnectDB } = require('./src/config/db');
const fs = require('fs');

async function exportData() {
  await connectDB();
  console.log('Exporting data...');
  try {
    const data = {
      roles: await prisma.role.findMany(),
      permissions: await prisma.permission.findMany(),
      users: await prisma.user.findMany(),
      media: await prisma.media.findMany(),
      categories: await prisma.category.findMany(),
      tags: await prisma.tag.findMany(),
      news: await prisma.news.findMany(),
      newsImages: await prisma.newsImage.findMany(),
      newsTags: await prisma.newsTag.findMany(),
    };

    fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));
    console.log('Export successful. Data saved to backup.json');
  } catch (err) {
    console.error('Error exporting data:', err);
  } finally {
    await disconnectDB();
  }
}

exportData();
