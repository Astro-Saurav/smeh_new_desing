const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateDummyData() {
  console.log("🚀 Generating dummy data...");
  
  const categories = [
    'Campus Buzz', 'Announcement', 'Current Affairs', 'Blog', 
    'Gallery', 'MR-TV', 'Podcast', 'Social Buzz', 'Beyond Campus'
  ];

  // Fetch admin user to attribute posts to
  const admin = await prisma.user.findFirst({ where: { role: { name: 'admin' } } });
  if (!admin) {
    console.error("❌ Admin user not found! Please run 'npx prisma db seed' first.");
    return;
  }

  for (const catName of categories) {
    const category = await prisma.category.findUnique({ where: { name: catName } });
    if (!category) {
      console.error(`❌ Category not found: ${catName}`);
      continue;
    }

    console.log(`Adding 10 items to ${catName}...`);
    
    for (let i = 1; i <= 10; i++) {
      // Create some variation (featured vs standard, different media types depending on category)
      const isFeatured = i === 1; // Make the first one featured
      
      let imageUrl = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800";
      
      // Give MR-TV and Podcasts some specific thumbnails
      if (catName === 'MR-TV' || catName === 'Podcast') {
        imageUrl = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800";
      }

      // Create dummy media record
      const media = await prisma.media.create({
        data: {
          file_name: `dummy-image-${i}.jpg`,
          original_name: `dummy-image-${i}.jpg`,
          file_path: imageUrl, // Hack: put URL in file_path for dummy
          mime_type: 'image/jpeg',
          file_size: 1024,
          processing_status: 'done'
        }
      });

      await prisma.news.create({
        data: {
          title: `Test Article ${i}: Understanding the impact of ${catName}`,
          slug: `test-article-${i}-${catName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          content: `<p>This is a completely auto-generated dummy article for the <strong>${catName}</strong> section.</p><p>It contains multiple paragraphs to ensure that the layout, spacing, and typography look correct when viewed on the frontend. The purpose of this text is simply to fill space and test the system's robustness.</p>`,
          status: 'published',
          is_featured: isFeatured,
          category: { connect: { id: category.id } },
          author: { connect: { id: admin.id } },
          thumbnail: { connect: { id: media.id } },
          youtube_url: catName === 'MR-TV' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
          published_at: new Date(Date.now() - i * 86400000) // Stagger dates by 1 day each
        }
      });
    }
  }

  console.log("✅ Successfully added 90 dummy articles (10 in each category)!");
}

generateDummyData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
