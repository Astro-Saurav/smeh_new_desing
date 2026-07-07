const { prisma, connectDB, disconnectDB } = require('./src/config/db');
connectDB().then(() => {
  return prisma.news.findMany({ select: { id: true, image_url: true, title: true } }).then(res => console.log(res.slice(0, 10)))
}).finally(disconnectDB);
