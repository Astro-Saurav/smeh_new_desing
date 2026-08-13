const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const rolesData = [
  {
    name: 'Student Editor-in-Chief',
    display_order: 1,
    members: [{ name: 'xxxxxxx', display_order: 1 }]
  },
  {
    name: 'Editors/Section Editors',
    display_order: 2,
    members: [{ name: 'xxxxxxxxxxxxxx', display_order: 1 }]
  },
  {
    name: 'Features Editor/s',
    display_order: 3,
    members: [{ name: 'xxxxxxxxxxxxxx', display_order: 1 }]
  },
  {
    name: 'Reporters',
    display_order: 4,
    members: [{ name: 'xxxxxxxxxxxxxxx', display_order: 1 }]
  },
  {
    name: 'Photojournalists & Multimedia Producers',
    display_order: 5,
    members: [{ name: 'xxxxxxxxxxxxxxxxx', display_order: 1 }]
  }
]

async function seed () {
  console.log('Seeding editorial roles and members...')
  for (const r of rolesData) {
    try {
      const role = await prisma.editorialRole.upsert({
        where: { name: r.name },
        update: { display_order: r.display_order },
        create: {
          name: r.name,
          display_order: r.display_order
        }
      })

      console.log(`Upserted role: ${role.name}`)

      // Upsert members
      for (const m of r.members) {
        // Find if member exists for this role
        const existingMembers = await prisma.editorialMember.findMany({
          where: { role_id: role.id }
        })

        if (existingMembers.length === 0) {
          await prisma.editorialMember.create({
            data: {
              name: m.name,
              display_order: m.display_order,
              role_id: role.id
            }
          })
          console.log(`Created member: ${m.name} for role: ${role.name}`)
        } else {
          // update the first member to be the placeholder text if it's currently '—'
          const member = existingMembers[0]
          await prisma.editorialMember.update({
            where: { id: member.id },
            data: { name: m.name }
          })
          console.log(`Updated member: ${m.name} for role: ${role.name}`)
        }
      }
    } catch (e) {
      console.log(`Error processing role ${r.name}:`, e.message)
    }
  }
  console.log('Done!')
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
