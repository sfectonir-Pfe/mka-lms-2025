import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('123456', salt);

  const admin = await prisma.user.upsert({
  where: { email: 'khalil@gmail.com' },
  update: {},
  create: {
    role: Role.Admin ,
    email: 'khalil@gmail.com',
    password: hashedPassword,
    needsVerification: false,  // Ajoutez cette ligne
    isActive: true            // Assurez-vous que le compte est actif
  },
});


  console.log('Admin seedé:', admin);
}

main()
  .then(() => console.log('✅ Seed terminé'))
  .catch((err) => console.error('❌ Erreur:', err))
  .finally(() => prisma.$disconnect());
