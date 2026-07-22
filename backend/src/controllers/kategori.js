import prisma from '../utils/prisma.js';

// Kategori Pemasukan
export const getKategoriPemasukan = async (req, res) => {
  try {
    const kategori = await prisma.kategoripemasukan.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createKategoriPemasukan = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const kategori = await prisma.kategoripemasukan.create({
      data: { nama, deskripsi }
    });
    res.status(201).json({ success: true, data: kategori, message: 'Kategori berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateKategoriPemasukan = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama, deskripsi } = req.body;
    const kategori = await prisma.kategoripemasukan.update({
      where: { id },
      data: { nama, deskripsi }
    });
    res.json({ success: true, data: kategori, message: 'Kategori berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteKategoriPemasukan = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if it's used
    const count = await prisma.pemasukan.count({ where: { kategoriId: id } });
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Kategori tidak dapat dihapus karena sedang digunakan.' });
    }

    await prisma.kategoripemasukan.delete({ where: { id } });
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Kategori Pengeluaran
export const getKategoriPengeluaran = async (req, res) => {
  try {
    const kategori = await prisma.kategoripengeluaran.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json({ success: true, data: kategori });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createKategoriPengeluaran = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    const kategori = await prisma.kategoripengeluaran.create({
      data: { nama, deskripsi }
    });
    res.status(201).json({ success: true, data: kategori, message: 'Kategori berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateKategoriPengeluaran = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama, deskripsi } = req.body;
    const kategori = await prisma.kategoripengeluaran.update({
      where: { id },
      data: { nama, deskripsi }
    });
    res.json({ success: true, data: kategori, message: 'Kategori berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteKategoriPengeluaran = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if it's used
    const count = await prisma.pengeluaran.count({ where: { kategoriId: id } });
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Kategori tidak dapat dihapus karena sedang digunakan.' });
    }

    await prisma.kategoripengeluaran.delete({ where: { id } });
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
