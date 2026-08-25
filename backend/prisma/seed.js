/**
 * Prisma Database Seed Script
 * Run: npx prisma db seed
 *
 * Seeds:
 * - Roles: Admin, Editor, Viewer
 * - Default admin user
 * - Default categories
 * - Default system settings
 */

const { prisma } = require('../src/config/db')
const bcrypt = require('bcrypt')

async function main () {
  console.log('🌱 Seeding database...')

  // ─── Roles ──────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } }),
    prisma.role.upsert({ where: { name: 'editor' }, update: {}, create: { name: 'editor' } }),
    prisma.role.upsert({ where: { name: 'viewer' }, update: {}, create: { name: 'viewer' } })
  ])
  const adminRole = roles[0]
  console.log(`✓ Roles seeded: ${roles.map(r => r.name).join(', ')}`)

  // ─── Default Admin User ─────────────────────────────────
  const crypto = require('crypto')
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mrt.edu.in'
  const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex')

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash: passwordHash,
        role_id: adminRole.id
      }
    })
    console.log(`✓ Admin user created: ${adminEmail}`)
    if (!process.env.ADMIN_PASSWORD) console.log(`✓ Generated Admin Password: ${adminPassword}`)
  } else {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
  }

  // ─── Default Editor User ────────────────────────────────
  const editorEmail = process.env.EDITOR_EMAIL || 'editor@mrt.edu.in'
  const editorPassword = process.env.EDITOR_PASSWORD || crypto.randomBytes(16).toString('hex')


  const existingEditor = await prisma.user.findUnique({ where: { email: editorEmail } })
  if (!existingEditor) {
    const passwordHash = await bcrypt.hash(editorPassword, 12)
    await prisma.user.create({
      data: {
        email: editorEmail,
        password_hash: passwordHash,
        role_id: roles[1].id // editor role
      }
    })
    console.log(`✓ Editor user created: ${editorEmail}`)
  } else {
    console.log(`✓ Editor user already exists: ${editorEmail}`)
  }

  // ─── Default Categories ────────────────────────────────
  const categoryData = [
    { name: 'Beyond Campus',             slug: 'beyond-campus' },
    { name: 'Current Affairs',           slug: 'current-affairs' },
    { name: 'Entertainment & Lifestyle', slug: 'entertainment-lifestyle' },
    { name: 'Sports',                    slug: 'sports' },
    { name: 'Campus Buzz',               slug: 'campus-buzz' },
    { name: 'Social Buzz',               slug: 'social-buzz' },
    { name: 'MR TV',                     slug: 'mr-tv' },
    { name: 'MR Podcast',                slug: 'podcast' },
    { name: 'Students Voices',           slug: 'students-voices' },
    { name: 'Photo Gallery',             slug: 'gallery' },
    { name: 'Announcement',              slug: 'announcement' },
  ]

  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
  }
  console.log(`✓ Categories seeded: ${categoryData.length} categories`)

  // ─── System Settings ────────────────────────────────────
  const settings = [
    { key: 'site_name', value: 'Manav Rachna Time' },
    { key: 'site_tagline', value: 'Your Campus News Source' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'news_per_page', value: '10' },
    { key: 'enable_comments', value: 'true' }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }
  console.log(`✓ System settings seeded`)

  // ─── Editorial Roles ────────────────────────────────────
  const editorialRoles = [
    'Student Editor-in-Chief',
    'Editors/Section Editors',
    'Features Editor/s',
    'Reporters',
    'Photojournalists & Multimedia Producers'
  ]

  let displayOrder = 1
  for (const roleName of editorialRoles) {
    await prisma.editorialRole.upsert({
      where: { name: roleName },
      update: { display_order: displayOrder },
      create: { name: roleName, display_order: displayOrder }
    })
    displayOrder++
  }
  console.log(`✓ Editorial roles seeded`)

  // ─── Migrate Blog to Students Voices ─────────────────────
  const blogCategory = await prisma.category.findUnique({ where: { slug: 'blog' } })
  const studentsVoicesCategory = await prisma.category.findUnique({ where: { slug: 'students-voices' } })
  
  if (blogCategory && studentsVoicesCategory) {
    await prisma.news.updateMany({
      where: { category_id: blogCategory.id },
      data: { category_id: studentsVoicesCategory.id }
    })
    // Optionally remove blog category or mark it inactive
    console.log(`✓ Migrated Blog data to Students Voices`)
  }

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
