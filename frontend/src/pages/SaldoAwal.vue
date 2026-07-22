<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit2, Trash2 } from '@lucide/vue';
import api from '../services/api.js';
import Modal from '../components/Modal.vue';

const dataList = ref([]);
const loading = ref(true);
const searchTerm = ref('');

const isModalOpen = ref(false);
const editingId = ref(null);
const formData = ref({
  periode: '',
  saldo_awal: '',
  keterangan: ''
});
const isSubmitting = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/saldo-awal');
    if (response.data.success) {
      dataList.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch saldo awal", error);
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
    periode: '',
    saldo_awal: '',
    keterangan: ''
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
  formData.value.saldo_awal = formatted;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    const payload = {
      ...formData.value,
      saldo_awal: Number(formData.value.saldo_awal.replace(/\./g, ''))
    };
    
    if (editingId.value) {
      await api.put(`/saldo-awal/${editingId.value}`, payload);
    } else {
      await api.post('/saldo-awal', payload);
    }
    
    isModalOpen.value = false;
    resetForm();
    fetchData();
  } catch (error) {
    console.error("Failed to submit", error);
    alert(`Gagal menyimpan saldo awal: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleEdit = (item) => {
  editingId.value = item.id;
  formData.value = {
    periode: item.periode,
    saldo_awal: formatRupiahInput(item.saldo_awal.toString()),
    keterangan: item.keterangan || ''
  };
  isModalOpen.value = true;
};

const handleDelete = async (id, periode) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus data saldo awal periode ${periode}?`)) {
    try {
      await api.delete(`/saldo-awal/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete", error);
      alert(`Gagal menghapus saldo awal: ${error.response?.data?.message || error.message}`);
    }
  }
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
};

const filteredData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return dataList.value.filter(d => 
    (d.periode || '').toLowerCase().includes(term) ||
    (d.keterangan || '').toLowerCase().includes(term)
  );
});

const openModalForAdd = () => {
  resetForm();
  isModalOpen.value = true;
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Saldo Awal Kas</h1>
        <p class="text-slate-500 text-sm mt-1">Data saldo awal kas per periode</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="openModalForAdd"
          class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus :size="16" class="mr-2" />
          Tambah Saldo Awal
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="text-slate-400" :size="18" />
          </div>
          <input
            type="text"
            class="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Cari periode atau keterangan..."
            v-model="searchTerm"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-medium">No</th>
              <th class="px-6 py-4 font-medium">Periode</th>
              <th class="px-6 py-4 font-medium text-right">Saldo Awal</th>
              <th class="px-6 py-4 font-medium">Keterangan</th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Tidak ada data saldo awal.</td>
            </tr>
            <tr v-else v-for="(item, index) in filteredData" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-600">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-medium text-slate-700">{{ item.periode }}</td>
              <td class="px-6 py-4 text-right font-semibold text-green-600">
                {{ formatRupiah(item.saldo_awal) }}
              </td>
              <td class="px-6 py-4 text-slate-600">{{ item.keterangan || '-' }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-2">
                  <button @click="handleEdit(item)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 :size="16" />
                  </button>
                  <button @click="handleDelete(item.id, item.periode)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :isOpen="isModalOpen" @close="isModalOpen = false; resetForm()" :title="editingId ? 'Edit Saldo Awal' : 'Tambah Saldo Awal'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Periode</label>
          <input type="text" required v-model="formData.periode" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Contoh: Mei 2026" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Saldo Awal (Rp)</label>
          <input type="text" required v-model="formData.saldo_awal" @input="handleNominalChange" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Contoh: 1.500.000" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
          <textarea v-model="formData.keterangan" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows="3" placeholder="Keterangan tambahan (Opsional)..."></textarea>
        </div>
        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Menyimpan...</template>
            <template v-else>Simpan</template>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
