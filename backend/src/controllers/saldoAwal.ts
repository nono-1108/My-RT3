import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getSaldoAwal = async (req: Request, res: Response) => {
  try {
    const saldoAwal = await prisma.saldoawal.findMany({
      orderBy: { tanggal_input: 'desc' }
    });
    res.json({ success: true, data: saldoAwal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSaldoAwal = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = (req as any).user?.id;
    data.createdById = userId;

    const saldoAwal = await prisma.saldoawal.create({ data });
    res.status(201).json({ success: true, data: saldoAwal });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Saldo awal untuk periode ini sudah ada.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateSaldoAwal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const saldoAwal = await prisma.saldoawal.update({ where: { id }, data });
    res.json({ success: true, data: saldoAwal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSaldoAwal = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.saldoawal.delete({ where: { id } });
    res.json({ success: true, message: 'Saldo awal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
