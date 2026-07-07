const { prisma, connectDB, disconnectDB } = require('./src/config/db');
connectDB().then(async () => {
  const result = await prisma.$queryRaw`SELECT * FROM "media" WHERE file_path LIKE '%e81ba65a6185%'`;
  console.log("Found media:", result);
}).finally(disconnectDB);
