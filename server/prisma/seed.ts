// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create a user first
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: 'hashed_password_here', // In real app, this should be properly hashed
    },
  });

  // create two dummy stories
  const memory1 = await prisma.memoryEntry.upsert({
    where: { userId_date: { userId: user.id, date: new Date('2025-05-30') } },
    update: {},
    create: {
      date: new Date('2025-05-30'),
      content: 'I laughed so hard when I saw the cat trying to eat the pizza',
      tag: 'FUNNY',
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const memory2 = await prisma.memoryEntry.upsert({
    where: { userId_date: { userId: user.id, date: new Date('2025-05-31') } },
    update: {},
    create: {
      date: new Date('2025-05-31'),
      content: 'I cried when I saw the cat trying to eat the pizza',
      tag: 'EMOTIONAL',
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log({ user, memory1, memory2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
