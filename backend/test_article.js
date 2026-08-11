const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let cat = await prisma.category.findFirst();
    let auth = await prisma.user.findFirst();
    const article = await prisma.news.create({
      data: {
        title: 'Test Typography',
        content: '<p>This is test content.</p>',
        status: 'published',
        slug: 'test-typography-' + Date.now(),
        title_font: 'Playfair Display',
        content_font: 'Lato',
        excerpt_font: 'Merriweather',
        category: { connect: { id: cat.id } },
        author: { connect: { id: auth.id } }
      }
    });
    console.log('Created:', article.id, article.slug);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
