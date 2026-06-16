import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator Sistem',
      role: 'ADMIN',
      status: true,
    },
  });

  const ketua = await prisma.user.upsert({
    where: { username: 'ketua' },
    update: {},
    create: {
      username: 'ketua',
      password: hashedPassword,
      nama: 'Bapak Ketua RT',
      role: 'KETUA_RT',
      status: true,
    },
  });

  const bendahara = await prisma.user.upsert({
    where: { username: 'bendahara' },
    update: {},
    create: {
      username: 'bendahara',
      password: hashedPassword,
      nama: 'Bapak Bendahara',
      role: 'BENDAHARA_RT',
      status: true,
    },
  });

  const sekretaris = await prisma.user.upsert({
    where: { username: 'sekretaris' },
    update: {},
    create: {
      username: 'sekretaris',
      password: hashedPassword,
      nama: 'Bapak Sekretaris',
      role: 'SEKRETARIS_RT',
      status: true,
    },
  });

  const kategoriMasuk = await prisma.kategoripemasukan.upsert({
    where: { id: 'default-iuran' },
    update: {},
    create: {
      id: 'default-iuran',
      nama: 'Iuran Wajib',
      deskripsi: 'Iuran wajib bulanan warga'
    }
  });

  console.log('Database berhasil dibuat!');
  console.log('-----------------------------------');
  console.log('Akun Default (Password semua: admin123):');
  console.log('1. admin (ADMIN)');
  console.log('2. ketua (KETUA_RT)');
  console.log('3. bendahara (BENDAHARA_RT)');
  console.log('4. sekretaris (SEKRETARIS_RT)');
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
