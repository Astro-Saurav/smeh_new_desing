const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const crypto = require('crypto');
async function run() {
  const newPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { email: 'admin@mrt.local' },
    data: { email: 'admin@mrt.edu.in', password_hash: passwordHash }
  });
  console.log('Successfully updated user:', updatedUser.email);
}
run().catch(console.error).finally(() => prisma.$disconnect());
