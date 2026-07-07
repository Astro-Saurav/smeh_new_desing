const { prisma, connectDB, disconnectDB } = require('./src/config/db');
connectDB().then(() => {
  return prisma.media.findMany({ select: { file_path: true } }).then(res => console.log(res.slice(0, 20)))
}).finally(disconnectDB);
