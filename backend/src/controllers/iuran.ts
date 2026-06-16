import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getTagihan = async (req: Request, res: Response) => {
  try {
    const tagihan = await prisma.tagihaniuran.findMany({
      include: {
        warga: true
      },
      orderBy: [{ tahun: 'desc' }, { bulan: 'desc' }]
    });
    res.json({ success: true, data: tagihan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const generateTagihan = async (req: Request, res: Response) => {
  try {
    const { bulan, tahun, nominal } = req.body;
    
    // Get all active warga
    const wargaAktif = await prisma.warga.findMany({
      where: { status_aktif: 'AKTIF' }
    });

    const dataToInsert = wargaAktif.map(w => ({
      bulan: Number(bulan),
      tahun: Number(tahun),
      wargaId: w.id,
      nominal: nominal,
      status: 'BELUM_LUNAS' as any
    }));

    // Create many tagihan ignoring duplicates is tricky in basic prisma without unique constraint, 
    // so we'll just use createMany
    const result = await prisma.tagihaniuran.createMany({
      data: dataToInsert
    });

    res.status(201).json({ success: true, message: `${result.count} tagihan generated`, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const bayarTagihan = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { tanggal_bayar } = req.body;

    const tagihan = await prisma.tagihaniuran.findUnique({ where: { id }, include: { warga: true } });
    if (!tagihan) return res.status(404).json({ success: false, message: 'Tagihan not found' });

    if (tagihan.status === 'LUNAS') {
      return res.status(400).json({ success: false, message: 'Tagihan already paid' });
    }

    // Find Kategori Pemasukan for Iuran
    let kategori = await prisma.kategoripemasukan.findFirst({ where: { nama: 'Iuran Bulanan' } });
    if (!kategori) {
      kategori = await prisma.kategoripemasukan.create({ data: { nama: 'Iuran Bulanan' } });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Pemasukan
      const pemasukan = await tx.pemasukan.create({
        data: {
          no_transaksi: `TRX-${Date.now()}`,
          tanggal: new Date(tanggal_bayar),
          wargaId: tagihan.wargaId,
          kategoriId: kategori!.id,
          nominal: tagihan.nominal,
          keterangan: `Pembayaran Iuran Bulan ${tagihan.bulan} Tahun ${tagihan.tahun}`,
        }
      });

      // Update Tagihan
      const updatedTagihan = await tx.tagihaniuran.update({
        where: { id },
        data: {
          status: 'LUNAS',
          tanggal_bayar: new Date(tanggal_bayar),
          pemasukanId: pemasukan.id
        }
      });

      return updatedTagihan;
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
