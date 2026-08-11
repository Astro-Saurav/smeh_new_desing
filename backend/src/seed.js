const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roles = [
  { name: 'Student Editor-in-Chief', display_order: 1 },
  { name: 'Editors/Section Editors', display_order: 2 },
  { name: 'Features Editor/s', display_order: 3 },
  { name: 'Reporters', display_order: 4 },
  { name: 'Photojournalists & Multimedia Producers', display_order: 5 }
];

async function seed() {
  console.log('Seeding editorial roles...');
  for (const r of roles) {
    try {
      await prisma.editorialRole.create({ data: r });
      console.log(`Created role: ${r.name}`);
    } catch(e) {
      console.log(`Role ${r.name} might already exist or error:`, e.message);
    }
  }
  console.log('Done!');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
