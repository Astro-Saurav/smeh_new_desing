const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Editorial Board
  const roles = [
    { name: 'Student Editor-in-Chief', members: ['xxxxxxx'] },
    { name: 'Editors/Section Editors', members: ['xxxxxxxxxxxxxx'] },
    { name: 'Features Editor/s', members: ['xxxxxxxxxxxxxx'] },
    { name: 'Reporters', members: ['xxxxxxxxxxxxxxx'] },
    { name: 'Photojournalists & Multimedia Producers', members: ['xxxxxxxxxxxxxxxxx'] }
  ];

  console.log('Seeding Editorial Board...');
  for (let i = 0; i < roles.length; i++) {
    const roleData = roles[i];
    let role = await prisma.editorialRole.findUnique({ where: { name: roleData.name } });
    if (!role) {
      role = await prisma.editorialRole.create({
        data: {
          name: roleData.name,
          display_order: i + 1,
        }
      });
    }

    for (let j = 0; j < roleData.members.length; j++) {
      const memberName = roleData.members[j];
      const existingMember = await prisma.editorialMember.findFirst({
        where: { name: memberName, role_id: role.id }
      });
      if (!existingMember) {
        await prisma.editorialMember.create({
          data: {
            name: memberName,
            role_id: role.id,
            display_order: j + 1,
          }
        });
      }
    }
  }

  // 2. Move 'Blog' to 'Students Voices'
  console.log('Moving Blog to Students Voices...');
  const blogCategory = await prisma.category.findUnique({ where: { slug: 'blog' } });
  const svCategory = await prisma.category.findUnique({ where: { slug: 'students-voices' } });

  if (blogCategory && svCategory) {
    const updateResult = await prisma.news.updateMany({
      where: { category_id: blogCategory.id },
      data: { category_id: svCategory.id }
    });
    console.log(`Moved ${updateResult.count} news items from Blog to Students Voices.`);
    
    // Check if we need to delete the Blog category
    // We shouldn't necessarily delete it right now, but we can if the user wants. The prompt said "Blog is no longer a page".
    // I'll leave it for now or delete it if there are no other dependencies.
  } else if (!svCategory) {
    console.log('Students Voices category not found, cannot move Blog.');
  } else {
    console.log('Blog category not found, nothing to move.');
  }

  console.log('Done.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
