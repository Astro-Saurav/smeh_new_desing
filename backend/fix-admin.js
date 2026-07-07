const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
async function run() {
  const passwordHash = await bcrypt.hash('Admin@123', 12);
  const updatedUser = await prisma.user.update({
    where: { email: 'admin@mrt.local' },
    data: { email: 'admin@mrt.edu.in', password_hash: passwordHash }
  });
  console.log('Successfully updated user:', updatedUser.email);
}
run().catch(console.error).finally(() => prisma.$disconnect());
