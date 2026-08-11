const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

const images = [
  { file_name: '1.jpeg', original_name: '1.jpeg', file_path: 'images/1.jpeg', mime_type: 'image/jpeg', file_size: 42861 },
  { file_name: '2.jpeg', original_name: '2.jpeg', file_path: 'images/2.jpeg', mime_type: 'image/jpeg', file_size: 76975 },
  { file_name: '3.jpeg', original_name: '3.jpeg', file_path: 'images/3.jpeg', mime_type: 'image/jpeg', file_size: 49444 },
  { file_name: 'amine.jpg', original_name: 'amine.jpg', file_path: 'images/amine.jpg', mime_type: 'image/jpeg', file_size: 16929 }
];

async function seed() {
  console.log('Seeding news articles...');
  
  // Create an admin user if not exists to author the news
  let author = await prisma.user.findFirst({ where: { role: { name: 'admin' } } });
  
  if (!author) {
    console.error("No admin user found to use as author!");
    return;
  }

  // Create media records for the images
  const mediaRecords = [];
  for (const img of images) {
    const existing = await prisma.media.findFirst({ where: { file_path: img.file_path } });
    if (existing) {
      mediaRecords.push(existing);
    } else {
      const created = await prisma.media.create({
        data: {
          file_name: img.file_name,
          original_name: img.original_name,
          file_path: img.file_path,
          mime_type: img.mime_type,
          file_size: img.file_size,
          processing_status: 'done'
        }
      });
      mediaRecords.push(created);
    }
  }

  const categories = await prisma.category.findMany();
  
  for (const category of categories) {
    console.log(`Adding 10 news items for category: ${category.name}`);
    for (let i = 1; i <= 10; i++) {
      const slug = `seed-news-${category.slug}-${i}-${crypto.randomBytes(4).toString('hex')}`;
      const media = mediaRecords[i % mediaRecords.length];
      
      await prisma.news.create({
        data: {
          title: `Test Article ${i} for ${category.name}`,
          slug: slug,
          excerpt: `This is a short excerpt for test article ${i} in category ${category.name}.`,
          content: `<p>This is the full content for test article ${i} in category ${category.name}. It contains multiple paragraphs to simulate a real article. The font choices should apply to this content.</p><p>Adding some more text to make it look like a substantial article.</p>`,
          status: 'published',
          published_at: new Date(),
          category_id: category.id,
          created_by: author.id,
          thumbnail_media_id: media.id,
          title_font: 'Playfair Display',
          excerpt_font: 'Lato',
          content_font: 'Inter'
        }
      });
    }
  }
  
  console.log('Finished seeding news!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
