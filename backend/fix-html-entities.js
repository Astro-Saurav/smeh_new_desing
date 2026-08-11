const { PrismaClient } = require('/root/smeh_new_desing/backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const news = await prisma.news.findMany();
  let updatedCount = 0;
  
  for (const item of news) {
    let needsUpdate = false;
    let newTitle = item.title;
    let newExcerpt = item.excerpt;
    let newContent = item.content;
    
    // Simple replacements for common HTML entities
    const unescapeHtml = (unsafe) => {
        if (!unsafe) return unsafe;
        return unsafe
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#39;/g, "'")
            .replace(/&#039;/g, "'")
            .replace(/&nbsp;/g, " ");
    };
    
    if (newTitle && newTitle.includes('&')) {
        const decoded = unescapeHtml(newTitle);
        if (decoded !== newTitle) {
            newTitle = decoded;
            needsUpdate = true;
        }
    }
    
    if (newExcerpt && newExcerpt.includes('&')) {
        const decoded = unescapeHtml(newExcerpt);
        if (decoded !== newExcerpt) {
            newExcerpt = decoded;
            needsUpdate = true;
        }
    }
    
    if (newContent && newContent.includes('&')) {
        const decoded = unescapeHtml(newContent);
        if (decoded !== newContent) {
            newContent = decoded;
            needsUpdate = true;
        }
    }
    
    if (needsUpdate) {
        console.log(`Updating item ID: ${item.id} - Title: ${newTitle ? newTitle.substring(0, 30) : ''}...`);
        await prisma.news.update({
            where: { id: item.id },
            data: {
                title: newTitle,
                excerpt: newExcerpt,
                content: newContent
            }
        });
        updatedCount++;
    }
  }
  
  console.log(`Fixed ${updatedCount} items with HTML entities.`);
}
main().catch(e => { console.error(e); process.exit(1); });
