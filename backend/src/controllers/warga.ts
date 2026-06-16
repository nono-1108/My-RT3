import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getWarga = async (req: Request, res: Response) => {
  try {
    const warga = await prisma.warga.findMany();
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWargaById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const warga = await prisma.warga.findUnique({ where: { id } });
    if (!warga) return res.status(404).json({ success: false, message: 'Warga not found' });
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createWarga = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const warga = await prisma.warga.create({ data });
    res.status(201).json({ success: true, data: warga });
  } catch (error: any) {
    console.error('Error creating warga:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateWarga = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const warga = await prisma.warga.update({ where: { id }, data });
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteWarga = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.warga.delete({ where: { id } });
    res.json({ success: true, message: 'Warga deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
