const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const kats = await prisma.kategoripemasukan.findMany();
    console.log("Pemasukan Categories:", kats);
    
    const katsOut = await prisma.kategoripengeluaran.findMany();
    console.log("Pengeluaran Categories:", katsOut);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
