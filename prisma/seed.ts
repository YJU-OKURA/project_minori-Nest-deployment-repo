import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.classUser.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.classUser.create({
    data: {
      u_id: 1,
      c_id: 1,
      nickname: 'user1',
      role: 'USER',
      is_favorite: true,
    },
  });
  const user2 = await prisma.classUser.create({
    data: {
      u_id: 2,
      c_id: 1,
      nickname: 'user2',
      role: 'ADMIN',
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
