const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const mainIuranId = '749e04bc-dc7d-4936-9c14-59f7e9469e8d';
    const duplicates = ['789c073e-e093-4a72-8b01-bc17b85d901e', '9a98b5c7-e93a-4465-9be8-73132fa49dfc'];

    for (const dupId of duplicates) {
      await prisma.pemasukan.updateMany({
        where: { kategoriId: dupId },
        data: { kategoriId: mainIuranId }
      });
      await prisma.kategoripemasukan.delete({ where: { id: dupId } });
    }

    console.log("Re-assigned and deleted duplicates.");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
