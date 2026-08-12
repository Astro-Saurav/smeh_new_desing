const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.auditLog.create({
      data: {
        action: 'test',
        target_table: 'test',
        new_value: { key: 'value' } // Passing an object directly
      }
    });
  } catch (err) {
    console.error(err.message);
  }
}
test();
