const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Editorial Roles
  await prisma.editorialMember.deleteMany()
  await prisma.editorialRole.deleteMany()

  const rolesData = [
    { name: "Student Editor-in-Chief", members: ["xxxxxxx"] },
    { name: "Editors/Section Editors", members: ["xxxxxxxxxxxxxx"] },
    { name: "Features Editor/s", members: ["xxxxxxxxxxxxxx"] },
    { name: "Reporters", members: ["xxxxxxxxxxxxxxx"] },
    { name: "Photojournalists & Multimedia Producers", members: ["xxxxxxxxxxxxxxxxx"] }
  ]

  let order = 1
  for (const r of rolesData) {
    const role = await prisma.editorialRole.create({
      data: {
        name: r.name,
        display_order: order++
      }
    })
    
    let mOrder = 1
    for (const m of r.members) {
      await prisma.editorialMember.create({
        data: {
          name: m,
          role_id: role.id,
          display_order: mOrder++
        }
      })
    }
  }
  console.log("Editorial roles seeded.")

  // 2. Blog -> Students Voices
  let svCategory = await prisma.category.findUnique({ where: { slug: 'students-voices' } })
  if (!svCategory) {
    svCategory = await prisma.category.create({
      data: {
        name: 'Students Voices',
        slug: 'students-voices'
      }
    })
    console.log("Created Students Voices category.")
  } else {
    console.log("Students Voices category exists.")
  }

  const blogCategory = await prisma.category.findUnique({ where: { slug: 'blog' } })
  if (blogCategory) {
    const updateCount = await prisma.news.updateMany({
      where: { category_id: blogCategory.id },
      data: { category_id: svCategory.id }
    })
    console.log(`Moved ${updateCount.count} posts from Blog to Students Voices.`)
    
    try {
      await prisma.homepageGrid.deleteMany({ where: { category_id: blogCategory.id } })
      await prisma.category.delete({ where: { id: blogCategory.id } })
      console.log("Deleted Blog category and its grids.")
    } catch (e) {
      console.log("Could not delete Blog category: ", e.message)
    }
  } else {
    console.log("No Blog category found.")
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
