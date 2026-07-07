const { prisma, connectDB, disconnectDB } = require('./src/config/db');
const fs = require('fs');

async function importData() {
  await connectDB();
  console.log('Importing data...');
  try {
    const rawData = fs.readFileSync('backup.json', 'utf-8');
    const data = JSON.parse(rawData);

    // We must insert in order of dependencies
    
    if (data.roles?.length) {
      console.log('Importing roles...');
      await prisma.role.createMany({ data: data.roles });
    }
    
    if (data.permissions?.length) {
      console.log('Importing permissions...');
      await prisma.permission.createMany({ data: data.permissions });
    }

    if (data.users?.length) {
      console.log('Importing users...');
      await prisma.user.createMany({ data: data.users });
    }

    if (data.media?.length) {
      console.log('Importing media...');
      await prisma.media.createMany({ data: data.media });
    }

    if (data.categories?.length) {
      console.log('Importing categories...');
      await prisma.category.createMany({ data: data.categories });
    }

    if (data.tags?.length) {
      console.log('Importing tags...');
      await prisma.tag.createMany({ data: data.tags });
    }

    if (data.news?.length) {
      console.log('Importing news...');
      // Convert layout_type and visibility to string if necessary, but we already exported them as strings
      await prisma.news.createMany({ data: data.news });
    }

    if (data.newsImages?.length) {
      console.log('Importing newsImages...');
      await prisma.newsImage.createMany({ data: data.newsImages });
    }

    if (data.newsTags?.length) {
      console.log('Importing newsTags...');
      await prisma.newsTag.createMany({ data: data.newsTags });
    }
    
    // homepageGrids wasn't exported because it didn't exist in Prisma Client
    
    console.log('Import successful!');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await disconnectDB();
  }
}

importData();
