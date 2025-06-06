import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('123456', salt);

  const admin = await prisma.user.create({
    data: {
      role: 'Admin',
      email: 'khalil@gmail.com',
      password: hashedPassword,
    },
  });
}

main()
  .then((res) => console.log('done'))
  .catch((err) => console.log('err'));