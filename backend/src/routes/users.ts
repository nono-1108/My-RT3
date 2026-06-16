import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        access_level: true,
        status: true
      },
      orderBy: { role: 'asc' }
    });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, password, role, access_level } = req.body;

    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (role) updateData.role = role;
    if (access_level) updateData.access_level = access_level;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        nama: true,
        role: true,
        access_level: true,
        status: true
      }
    });

    res.json({ success: true, data: updatedUser, message: 'User berhasil diupdate' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
