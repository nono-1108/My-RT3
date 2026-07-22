import prisma from '../utils/prisma.js';

export const getSaldoAwal = async (req, res) => {
  try {
    const saldoAwal = await prisma.saldoawal.findMany({
      orderBy: { tanggal_input: 'desc' }
    });
    res.json({ success: true, data: saldoAwal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSaldoAwal = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user?.id;
    data.createdById = userId;

    const saldoAwal = await prisma.saldoawal.create({ data });
    res.status(201).json({ success: true, data: saldoAwal });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Saldo awal untuk periode ini sudah ada.' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updateSaldoAwal = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const saldoAwal = await prisma.saldoawal.update({ where: { id }, data });
    res.json({ success: true, data: saldoAwal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSaldoAwal = async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.saldoawal.delete({ where: { id } });
    res.json({ success: true, message: 'Saldo awal deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
