import prisma from '../utils/prisma.js';

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const totalPemasukanBulanIni = await prisma.pemasukan.aggregate({
      _sum: { nominal: true },
      where: { tanggal: { gte: startOfMonth, lte: endOfMonth } }
    });

    const totalPengeluaranBulanIni = await prisma.pengeluaran.aggregate({
      _sum: { nominal: true },
      where: { tanggal: { gte: startOfMonth, lte: endOfMonth } }
    });

    const totalPemasukan = await prisma.pemasukan.aggregate({ _sum: { nominal: true } });
    const totalPengeluaran = await prisma.pengeluaran.aggregate({ _sum: { nominal: true } });

    const saldoKas = (Number(totalPemasukan._sum.nominal || 0)) - (Number(totalPengeluaran._sum.nominal || 0));

    const jumlahWarga = await prisma.warga.count({ where: { status_aktif: 'AKTIF' } });

    const wargaMenunggak = await prisma.tagihaniuran.count({
      where: { status: 'BELUM_LUNAS' }
    });

    res.json({
      success: true,
      data: {
        totalPemasukanBulanIni: Number(totalPemasukanBulanIni._sum.nominal || 0),
        totalPengeluaranBulanIni: Number(totalPengeluaranBulanIni._sum.nominal || 0),
        saldoKas,
        jumlahWarga,
        wargaMenunggak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
