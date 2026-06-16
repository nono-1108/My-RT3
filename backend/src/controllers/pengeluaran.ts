import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getPengeluaran = async (req: Request, res: Response) => {
  try {
    const pengeluaran = await prisma.pengeluaran.findMany({
      include: {
        kategoripengeluaran: true
      },
      orderBy: { tanggal: 'desc' }
    });
    res.json({ success: true, data: pengeluaran });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createPengeluaran = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
    }
    const userId = (req as any).user.id;
    data.createdById = userId;

    if (!data.no_pengeluaran) {
      data.no_pengeluaran = `OUT-${Date.now()}`;
    }

    const pengeluaran = await prisma.pengeluaran.create({ data });
    res.status(201).json({ success: true, data: pengeluaran });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updatePengeluaran = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
    }
    const pengeluaran = await prisma.pengeluaran.update({ where: { id }, data });
    res.json({ success: true, data: pengeluaran });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePengeluaran = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.pengeluaran.delete({ where: { id } });
    res.json({ success: true, message: 'Pengeluaran deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Kategori Pengeluaran
export const getKategoriPengeluaran = async (req: Request, res: Response) => {
  try {
    const kategori = await prisma.kategoripengeluaran.findMany();
    res.json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createKategoriPengeluaran = async (req: Request, res: Response) => {
  try {
    const kategori = await prisma.kategoripengeluaran.create({ data: req.body });
    res.status(201).json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
