import prisma from '../utils/prisma.js';

export const getPengeluaran = async (req, res) => {
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

export const createPengeluaran = async (req, res) => {
  try {
    const data = req.body;
    if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
    }
    const userId = req.user.id;
    data.createdById = userId;

    if (!data.no_pengeluaran) {
      data.no_pengeluaran = `OUT-${Date.now()}`;
    }

    const pengeluaran = await prisma.pengeluaran.create({ data });
    res.status(201).json({ success: true, data: pengeluaran });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updatePengeluaran = async (req, res) => {
  try {
    const id = req.params.id;
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

export const deletePengeluaran = async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.pengeluaran.delete({ where: { id } });
    res.json({ success: true, message: 'Pengeluaran deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Kategori Pengeluaran
export const getKategoriPengeluaran = async (req, res) => {
  try {
    const kategori = await prisma.kategoripengeluaran.findMany();
    res.json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createKategoriPengeluaran = async (req, res) => {
  try {
    const kategori = await prisma.kategoripengeluaran.create({ data: req.body });
    res.status(201).json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
