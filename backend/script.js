const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Add Members to Editorial Roles
  console.log("Adding Editorial Members...");
  
  const roles = await prisma.editorialRole.findMany();
  
  const memberMappings = {
    'Student Editor-in-Chief': 'xxxxxxx',
    'Editors/Section Editors': 'xxxxxxxxxxxxxx',
    'Features Editor/s': 'xxxxxxxxxxxxxx',
    'Reporters': 'xxxxxxxxxxxxxxx',
    'Photojournalists & Multimedia Producers': 'xxxxxxxxxxxxxxxxx'
  };

  for (const role of roles) {
    const memberName = memberMappings[role.name];
    if (memberName) {
      await prisma.editorialMember.create({
        data: {
          name: memberName,
          role_id: role.id,
          display_order: 1
        }
      });
      console.log(`Added member ${memberName} to role ${role.name}`);
    }
  }

  // 2. Move Blog data to Students Voices
  console.log("\nMoving Blog news to Students Voices...");
  
  const blogCategory = await prisma.category.findUnique({
    where: { slug: 'blog' }
  });
  
  const studentVoicesCategory = await prisma.category.findUnique({
    where: { slug: 'students-voices' }
  });

  if (blogCategory && studentVoicesCategory) {
    const updateResult = await prisma.news.updateMany({
      where: { category_id: blogCategory.id },
      data: { category_id: studentVoicesCategory.id }
    });
    console.log(`Moved ${updateResult.count} news articles from Blog to Students Voices.`);
    
    // Check if Blog is used in HomepageGrid before deleting
    const grid = await prisma.homepageGrid.findUnique({
        where: { category_id: blogCategory.id }
    });
    
    if (grid) {
        await prisma.homepageGrid.delete({
            where: { category_id: blogCategory.id }
        });
        console.log("Deleted Blog from HomepageGrid.");
    }

    // Delete Blog category
    await prisma.category.delete({
      where: { id: blogCategory.id }
    });
    console.log("Deleted Blog category.");
  } else {
    console.log("Could not find either Blog or Students Voices category.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
