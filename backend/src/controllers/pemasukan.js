import prisma from '../utils/prisma.js';

export const getPemasukan = async (req, res) => {
  try {
    const pemasukan = await prisma.pemasukan.findMany({
      include: {
        kategoripemasukan: true,
        warga: true
      },
      orderBy: { tanggal: 'desc' }
    });
    res.json({ success: true, data: pemasukan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createPemasukan = async (req, res) => {
  try {
    const data = req.body;
    if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
    }
    const userId = req.user.id;
    data.createdById = userId;
    
    if (!data.no_transaksi) {
      data.no_transaksi = `TRX-${Date.now()}`;
    }

    const pemasukan = await prisma.pemasukan.create({ data });
    res.status(201).json({ success: true, data: pemasukan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error', error });
  }
};

export const updatePemasukan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
    }
    const pemasukan = await prisma.pemasukan.update({ where: { id }, data });
    res.json({ success: true, data: pemasukan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePemasukan = async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.pemasukan.delete({ where: { id } });
    res.json({ success: true, message: 'Pemasukan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Kategori Pemasukan
export const getKategoriPemasukan = async (req, res) => {
  try {
    const kategori = await prisma.kategoripemasukan.findMany();
    res.json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createKategoriPemasukan = async (req, res) => {
  try {
    const kategori = await prisma.kategoripemasukan.create({ data: req.body });
    res.status(201).json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
