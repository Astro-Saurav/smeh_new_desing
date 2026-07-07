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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mrt.edu.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

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
  } else {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
  }

  // ─── Default Editor User ────────────────────────────────
  const editorEmail = process.env.EDITOR_EMAIL || 'editor@mrt.edu.in'
  const editorPassword = process.env.EDITOR_PASSWORD || 'Editor@123'

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
    { name: 'Campus Buzz', slug: 'campus-buzz' },
    { name: 'Announcement', slug: 'announcement' },
    { name: 'Current Affairs', slug: 'current-affairs' },
    { name: 'Blog', slug: 'blog' },
    { name: 'Gallery', slug: 'gallery' },
    { name: 'MR-TV', slug: 'mr-tv' },
    { name: 'Podcast', slug: 'podcast' },
    { name: 'Social Buzz', slug: 'social-buzz' },
    { name: 'Beyond Campus', slug: 'beyond-campus' }
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
