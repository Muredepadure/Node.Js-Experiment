import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const base = ['Groceries','Restaurants','Transport','Utilities','Shopping','Health','Entertainment','Other'];
  for (const name of base) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name }});
  }
}

main().finally(() => prisma.$disconnect());
