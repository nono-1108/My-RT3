<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/vue';
import api from '../services/api.js';
import Modal from '../components/Modal.vue';

const dataList = ref([]);
const loading = ref(true);
const searchTerm = ref('');
const filterBulan = ref('');
const sortKey = ref('tanggal');
const sortOrder = ref('desc');

const kategoriList = ref([]);
const isModalOpen = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);

const formData = ref({
  tanggal: new Date().toISOString().split('T')[0],
  kategoriId: '',
  nominal: '',
  penerima: '',
  deskripsi: ''
});

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/pengeluaran');
    if (response.data.success) {
      dataList.value = response.data.data;
    }
    const katResponse = await api.get('/pengeluaran/kategori');
    if (katResponse.data.success) {
      kategoriList.value = katResponse.data.data;
      if (katResponse.data.data.length > 0 && !formData.value.kategoriId) {
        formData.value.kategoriId = katResponse.data.data[0].id;
      }
    }
  } catch (error) {
    console.error("Failed to fetch pengeluaran", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const resetForm = () => {
  editingId.value = null;
  formData.value = {
    tanggal: new Date().toISOString().split('T')[0],
    kategoriId: kategoriList.value[0]?.id || '',
    nominal: '',
    penerima: '',
    deskripsi: ''
  };
};

const formatRupiahInput = (value) => {
  const numberString = value.replace(/[^,\d]/g, '').toString();
  const split = numberString.split(',');
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return rupiah;
};

const handleNominalChange = (e) => {
  const target = e.target;
  const formatted = formatRupiahInput(target.value);
  formData.value.nominal = formatted;
};

const handleAddKategori = async () => {
  const namaKategori = window.prompt('Masukkan nama kategori baru (contoh: Biaya Listrik, Keamanan, dll):');
  if (!namaKategori) return;

  try {
    const response = await api.post('/pengeluaran/kategori', { nama: namaKategori });
    if (response.data.success) {
      const newKategori = response.data.data;
      kategoriList.value.push(newKategori);
      formData.value.kategoriId = newKategori.id;
    }
  } catch (error) {
    console.error(error);
    alert('Gagal menambahkan kategori');
  }
};

const handleSubmit = async () => {
  if (!formData.value.kategoriId && kategoriList.value.length === 0) {
    try {
      const newKat = await api.post('/pengeluaran/kategori', { nama: 'Pengeluaran Umum' });
      if (newKat.data.success) {
        formData.value.kategoriId = newKat.data.data.id;
        kategoriList.value.push(newKat.data.data);
      }
    } catch (err) {
      alert('Gagal membuat kategori default');
      return;
    }
  }

  isSubmitting.value = true;
  try {
    const payload = {
      ...formData.value,
      nominal: Number(formData.value.nominal.replace(/\./g, ''))
    };

    if (editingId.value) {
      await api.put(`/pengeluaran/${editingId.value}`, payload);
    } else {
      await api.post('/pengeluaran', payload);
    }
    
    isModalOpen.value = false;
    resetForm();
    fetchData();
  } catch (error) {
    console.error("Failed to submit", error);
    alert(`Gagal menyimpan pengeluaran: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleEdit = (item) => {
  editingId.value = item.id;
  formData.value = {
    tanggal: item.tanggal ? item.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
    kategoriId: item.kategoriId || '',
    nominal: formatRupiahInput(item.nominal.toString()),
    penerima: item.penerima || '',
    deskripsi: item.deskripsi || ''
  };
  isModalOpen.value = true;
};

const handleDelete = async (id, no_pengeluaran) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus data pengeluaran ${no_pengeluaran}?`)) {
    try {
      await api.delete(`/pengeluaran/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete", error);
      alert(`Gagal menghapus pengeluaran: ${error.response?.data?.message || error.message}`);
    }
  }
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const filteredData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  let result = dataList.value.filter(d => {
    const matchTerm = (d.deskripsi || '').toLowerCase().includes(term) ||
                      (d.no_pengeluaran || '').toLowerCase().includes(term);
    let matchBulan = true;
    if (filterBulan.value) {
      const dDate = new Date(d.tanggal);
      const [fYear, fMonth] = filterBulan.value.split('-');
      matchBulan = dDate.getFullYear() === parseInt(fYear) && (dDate.getMonth() + 1) === parseInt(fMonth);
    }
    return matchTerm && matchBulan;
  });

  result.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];

    // Handle null or undefined values
    if (valA == null) valA = '';
    if (valB == null) valB = '';

    if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
});

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const openModalForAdd = () => {
  resetForm();
  isModalOpen.value = true;
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Pengeluaran Kas</h1>
        <p class="text-slate-500 text-sm mt-1">Catatan seluruh transaksi keluar RT</p>
      </div>
      <div class="flex space-x-2">
        <button
          @click="openModalForAdd"
          class="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus :size="16" class="mr-2" />
          Catat Pengeluaran
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-slate-50 gap-4">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="text-slate-400" :size="18" />
          </div>
          <input
            type="text"
            class="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Cari transaksi atau deskripsi..."
            v-model="searchTerm"
          />
        </div>
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-slate-600">Bulan:</label>
          <input 
            type="month" 
            v-model="filterBulan"
            class="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none" @click="handleSort('no_pengeluaran')">
                <div class="flex items-center space-x-1">
                  <span>No. Pengeluaran</span>
                  <ArrowUp v-if="sortKey === 'no_pengeluaran' && sortOrder === 'asc'" :size="14" class="text-orange-600" />
                  <ArrowDown v-else-if="sortKey === 'no_pengeluaran' && sortOrder === 'desc'" :size="14" class="text-orange-600" />
                  <ArrowUpDown v-else :size="14" class="text-slate-400" />
                </div>
              </th>
              <th class="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none" @click="handleSort('tanggal')">
                <div class="flex items-center space-x-1">
                  <span>Tanggal</span>
                  <ArrowUp v-if="sortKey === 'tanggal' && sortOrder === 'asc'" :size="14" class="text-orange-600" />
                  <ArrowDown v-else-if="sortKey === 'tanggal' && sortOrder === 'desc'" :size="14" class="text-orange-600" />
                  <ArrowUpDown v-else :size="14" class="text-slate-400" />
                </div>
              </th>
              <th class="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none" @click="handleSort('penerima')">
                <div class="flex items-center space-x-1">
                  <span>Penerima</span>
                  <ArrowUp v-if="sortKey === 'penerima' && sortOrder === 'asc'" :size="14" class="text-orange-600" />
                  <ArrowDown v-else-if="sortKey === 'penerima' && sortOrder === 'desc'" :size="14" class="text-orange-600" />
                  <ArrowUpDown v-else :size="14" class="text-slate-400" />
                </div>
              </th>
              <th class="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none" @click="handleSort('deskripsi')">
                <div class="flex items-center space-x-1">
                  <span>Deskripsi</span>
                  <ArrowUp v-if="sortKey === 'deskripsi' && sortOrder === 'asc'" :size="14" class="text-orange-600" />
                  <ArrowDown v-else-if="sortKey === 'deskripsi' && sortOrder === 'desc'" :size="14" class="text-orange-600" />
                  <ArrowUpDown v-else :size="14" class="text-slate-400" />
                </div>
              </th>
              <th class="px-6 py-4 font-medium cursor-pointer hover:bg-slate-100 transition-colors select-none" @click="handleSort('nominal')">
                <div class="flex items-center justify-end space-x-1">
                  <span>Nominal</span>
                  <ArrowUp v-if="sortKey === 'nominal' && sortOrder === 'asc'" :size="14" class="text-orange-600" />
                  <ArrowDown v-else-if="sortKey === 'nominal' && sortOrder === 'desc'" :size="14" class="text-orange-600" />
                  <ArrowUpDown v-else :size="14" class="text-slate-400" />
                </div>
              </th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">Tidak ada data pengeluaran.</td>
            </tr>
            <tr v-else v-for="item in filteredData" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-700">{{ item.no_pengeluaran }}</td>
              <td class="px-6 py-4 text-slate-600">{{ formatDate(item.tanggal) }}</td>
              <td class="px-6 py-4">
                <span class="font-medium text-slate-800">{{ item.penerima || '-' }}</span>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.deskripsi || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <p class="font-semibold text-orange-600">{{ formatRupiah(item.nominal) }}</p>
                <p class="text-slate-500 text-xs mt-0.5">{{ item.kategoripengeluaran?.nama || 'Lainnya' }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-2">
                  <button @click="handleEdit(item)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 :size="16" />
                  </button>
                  <button @click="handleDelete(item.id, item.no_pengeluaran)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :isOpen="isModalOpen" @close="isModalOpen = false; resetForm()" :title="editingId ? 'Edit Pengeluaran' : 'Catat Pengeluaran'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
          <input type="date" required v-model="formData.tanggal" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
          <div class="flex space-x-2">
            <select required v-model="formData.kategoriId" class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama }}</option>
              <option v-if="kategoriList.length === 0" value="">-- Kategori Kosong --</option>
            </select>
            <button
              type="button"
              @click="handleAddKategori"
              class="px-3 py-2 bg-slate-100 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium whitespace-nowrap"
              title="Tambah Kategori Baru"
            >
              + Kategori
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
          <input type="text" required v-model="formData.nominal" @input="handleNominalChange" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Contoh: 150.000" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Penerima</label>
          <input type="text" required v-model="formData.penerima" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nama penerima dana..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
          <textarea v-model="formData.deskripsi" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="3" placeholder="Deskripsi pengeluaran..."></textarea>
        </div>
        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Menyimpan...</template>
            <template v-else>Simpan</template>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
