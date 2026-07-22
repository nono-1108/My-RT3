import prisma from '../utils/prisma.js';

export const getWarga = async (req, res) => {
  try {
    const warga = await prisma.warga.findMany();
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getWargaById = async (req, res) => {
  try {
    const id = req.params.id;
    const warga = await prisma.warga.findUnique({ where: { id } });
    if (!warga) return res.status(404).json({ success: false, message: 'Warga not found' });
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createWarga = async (req, res) => {
  try {
    const data = req.body;
    const warga = await prisma.warga.create({ data });
    res.status(201).json({ success: true, data: warga });
  } catch (error) {
    console.error('Error creating warga:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateWarga = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const warga = await prisma.warga.update({ where: { id }, data });
    res.json({ success: true, data: warga });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteWarga = async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.warga.delete({ where: { id } });
    res.json({ success: true, message: 'Warga deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
