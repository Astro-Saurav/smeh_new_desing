/**
 * Migration Script: MongoDB Export to PostgreSQL Import
 * Requires JSON files exported from MongoDB Collections.
 * Usage: node scripts/migrate-from-mongo.js
 */

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcrypt')

require('dotenv').config({ path: path.join(__dirname, '../.env.production') })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error("DATABASE_URL is missing in environment variables.")
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function runMigration () {
  console.log("🚀 Starting MongoDB to PostgreSQL migration...")

  const usersPath = path.join(__dirname, '../users.json')
  const categoriesPath = path.join(__dirname, '../categories.json')
  const newsPath = path.join(__dirname, '../news.json')

  // Helper function to read exported JSON files (handling JSON lines or array format)
  const parseJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Warning: ${path.basename(filePath)} not found. Skipping.`);
      return []
    }
    const content = fs.readFileSync(filePath, 'utf-8').trim()
    try {
      return JSON.parse(content)
    } catch {
      // Try parsing JSON Lines
      return content.split('\n').filter(Boolean).map(line => JSON.parse(line))
    }
  }

  // 1. Roles Check & Setup
  const editorRole = await prisma.role.upsert({
    where: { name: 'editor' },
    update: {},
    create: { name: 'editor' }
  })
  
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  })

  // 2. Import Users
  const rawUsers = parseJsonFile(usersPath)
  console.log(`Found ${rawUsers.length} users to import.`)
  for (const u of rawUsers) {
    const email = (u.email || '').toLowerCase().trim()
    if (!email) continue

    const passwordHash = u.password || await bcrypt.hash('DefaultAdmin@123!', 12)
    const isSysAdmin = u.role === 'admin' || u.isAdmin === true

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password_hash: passwordHash,
        role_id: isSysAdmin ? adminRole.id : editorRole.id,
        created_at: u.createdAt ? new Date(u.createdAt.$date || u.createdAt) : new Date()
      }
    })
  }

  // 3. Import Categories
  const rawCategories = parseJsonFile(categoriesPath)
  console.log(`Found ${rawCategories.length} categories to import.`)
  for (const cat of rawCategories) {
    const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: cat.name.trim(),
        slug
      }
    })
  }

  // 4. Import News
  const rawNews = parseJsonFile(newsPath)
  console.log(`Found ${rawNews.length} news articles to import.`)
  for (const n of rawNews) {
    // Basic validations
    if (!n.title) continue

    // Find author user
    let dbUser = await prisma.user.findFirst({
      where: { email: (n.author || '').toLowerCase().trim() }
    })
    if (!dbUser) {
      dbUser = await prisma.user.findFirst({ where: { role: { name: 'admin' } } })
    }

    // Find category
    let dbCat = await prisma.category.findFirst({
      where: { name: { equals: n.category, mode: 'insensitive' } }
    })
    if (!dbCat) {
      dbCat = await prisma.category.findFirst()
    }

    const baseSlug = n.slug || n.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    
    // Create News and seed its initial Revision
    try {
      const dbNews = await prisma.news.create({
        data: {
          title: n.title,
          slug: baseSlug,
          excerpt: n.excerpt || null,
          content: n.content || '',
          youtube_url: n.youtubeUrl || null,
          status: n.status || 'published',
          category_id: dbCat.id,
          created_by: dbUser.id,
          created_at: n.createdAt ? new Date(n.createdAt.$date || n.createdAt) : new Date(),
          published_at: n.publishedAt ? new Date(n.publishedAt.$date || n.publishedAt) : new Date()
        }
      })

      await prisma.newsRevision.create({
        data: {
          news_id: dbNews.id,
          version_number: 1,
          title: dbNews.title,
          excerpt: dbNews.excerpt,
          content: dbNews.content,
          editor_id: dbUser.id
        }
      })
    } catch (e) {
      console.error(`Failed to import news article: "${n.title}". Error: ${e.message}`)
    }
  }

  console.log("✅ Data migration complete!")
  await prisma.$disconnect()
  await pool.end()
}

runMigration().catch(err => {
  console.error("❌ Migration failed with fatal error:", err)
})
