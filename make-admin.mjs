// Quick script to make a user admin
// Run this with: node make-admin.mjs YOUR_EMAIL@example.com

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email) {
  if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: node make-admin.mjs your-email@example.com');
    process.exit(1);
  }

  try {
    console.log(`Making ${email} an admin...`);
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });

    console.log('✅ Successfully promoted user to admin!');
    console.log(`User: ${updatedUser.name} (${updatedUser.email})`);
    console.log(`Role: ${updatedUser.role}`);
    
  } catch (error) {
    console.error('❌ Error making user admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];
makeAdmin(email);