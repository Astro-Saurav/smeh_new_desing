#!/usr/bin/env node

/**
 * Seed script to create initial admin user for MRT system
 * Usage: node create-admin.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 Starting admin user creation...\n')

    // 1. Create or get admin role
    let adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    })

    if (!adminRole) {
      console.log('📝 Creating admin role...')
      adminRole = await prisma.role.create({
        data: { name: 'admin' }
      })
      console.log('✅ Admin role created\n')
    } else {
      console.log('✅ Admin role already exists\n')
    }

    // 2. Create or get editor role
    let editorRole = await prisma.role.findUnique({
      where: { name: 'editor' }
    })

    if (!editorRole) {
      console.log('📝 Creating editor role...')
      editorRole = await prisma.role.create({
        data: { name: 'editor' }
      })
      console.log('✅ Editor role created\n')
    } else {
      console.log('✅ Editor role already exists\n')
    }

    // 3. Create admin user
    const adminEmail = 'admin@mrt.edu.in'
    const adminPassword = 'Admin@123'

    let admin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!admin) {
      console.log('📝 Creating admin user...')
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password_hash: hashedPassword,
          role_id: adminRole.id,
          is_2fa_enabled: false
        },
        include: { role: true }
      })
      console.log('✅ Admin user created\n')
    } else {
      console.log('✅ Admin user already exists\n')
    }

    // 4. Create test editor user
    const editorEmail = 'editor@mrt.edu.in'
    const editorPassword = 'Editor@123'

    let editor = await prisma.user.findUnique({
      where: { email: editorEmail }
    })

    if (!editor) {
      console.log('📝 Creating test editor user...')
      const hashedPassword = await bcrypt.hash(editorPassword, 12)

      editor = await prisma.user.create({
        data: {
          email: editorEmail,
          password_hash: hashedPassword,
          role_id: editorRole.id,
          is_2fa_enabled: false
        },
        include: { role: true }
      })
      console.log('✅ Test editor user created\n')
    } else {
      console.log('✅ Test editor user already exists\n')
    }

    // 5. Create sample category
    let category = await prisma.category.findUnique({
      where: { slug: 'campus-news' }
    })

    if (!category) {
      console.log('📝 Creating sample category...')
      category = await prisma.category.create({
        data: {
          name: 'Campus News',
          slug: 'campus-news'
        }
      })
      console.log('✅ Sample category created\n')
    } else {
      console.log('✅ Sample category already exists\n')
    }

    // Print credentials
    console.log('═══════════════════════════════════════════════════════')
    console.log('✨ ADMIN SETUP COMPLETE!\n')
    console.log('📧 Admin Account:')
    console.log(`   Email:    ${adminEmail}`)
    console.log(`   Password: ${adminPassword}\n`)
    console.log('📧 Editor Account:')
    console.log(`   Email:    ${editorEmail}`)
    console.log(`   Password: ${editorPassword}\n`)
    console.log('🔗 Login URL: http://localhost/login')
    console.log('═══════════════════════════════════════════════════════\n')

    // Print database stats
    const userCount = await prisma.user.count()
    const roleCount = await prisma.role.count()
    const categoryCount = await prisma.category.count()

    console.log('📊 Database Statistics:')
    console.log(`   Users:       ${userCount}`)
    console.log(`   Roles:       ${roleCount}`)
    console.log(`   Categories:  ${categoryCount}\n`)

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
