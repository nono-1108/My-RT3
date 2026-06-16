<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit2, Trash2 } from '@lucide/vue';
import api from '../services/api';
import Modal from '../components/Modal.vue';

const kategoriPemasukan = ref<any[]>([]);
const kategoriPengeluaran = ref<any[]>([]);
const loading = ref(true);

const fetchKategori = async () => {
  loading.value = true;
  try {
    const [resPemasukan, resPengeluaran] = await Promise.all([
      api.get('/kategori/pemasukan'),
      api.get('/kategori/pengeluaran')
    ]);
    if (resPemasukan.data.success) {
      kategoriPemasukan.value = resPemasukan.data.data;
    }
    if (resPengeluaran.data.success) {
      kategoriPengeluaran.value = resPengeluaran.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch kategori", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchKategori();
});

// Modal state
const isModalOpen = ref(false);
const modalType = ref<'pemasukan' | 'pengeluaran'>('pemasukan');
const isEditing = ref(false);
const editingId = ref('');
const formData = ref({
  nama: '',
  deskripsi: ''
});
const isSubmitting = ref(false);

const openModal = (type: 'pemasukan' | 'pengeluaran', editData?: any) => {
  modalType.value = type;
  if (editData) {
    isEditing.value = true;
    editingId.value = editData.id;
    formData.value = {
      nama: editData.nama,
      deskripsi: editData.deskripsi || ''
    };
  } else {
    isEditing.value = false;
    editingId.value = '';
    formData.value = { nama: '', deskripsi: '' };
  }
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const endpoint = `/kategori/${modalType.value}`;
    if (isEditing.value) {
      await api.put(`${endpoint}/${editingId.value}`, formData.value);
    } else {
      await api.post(endpoint, formData.value);
    }
    isModalOpen.value = false;
    fetchKategori();
  } catch (error: any) {
    alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (type: 'pemasukan' | 'pengeluaran', id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
  try {
    await api.delete(`/kategori/${type}/${id}`);
    fetchKategori();
  } catch (error: any) {
    alert(`Gagal menghapus: ${error.response?.data?.message || error.message}`);
  }
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Master Kategori Transaksi</h1>
      <p class="text-slate-500 text-sm mt-1">Kelola daftar kategori pemasukan dan pengeluaran kas RT</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-40">
      <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Kategori Pemasukan -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-slate-800 text-lg">Kategori Pemasukan</h2>
          <button @click="openModal('pemasukan')" class="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
            <Plus :size="16" class="mr-1" />
            Tambah
          </button>
        </div>
        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                <th class="px-4 py-3 font-medium">Nama Kategori</th>
                <th class="px-4 py-3 font-medium">Deskripsi</th>
                <th class="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm">
              <tr v-if="kategoriPemasukan.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-slate-500">Belum ada kategori.</td>
              </tr>
              <tr v-for="item in kategoriPemasukan" :key="item.id" class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ item.nama }}</td>
                <td class="px-4 py-3 text-slate-500">{{ item.deskripsi || '-' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="openModal('pemasukan', item)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 :size="16" />
                    </button>
                    <button @click="handleDelete('pemasukan', item.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Kategori Pengeluaran -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 class="font-semibold text-slate-800 text-lg">Kategori Pengeluaran</h2>
          <button @click="openModal('pengeluaran')" class="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
            <Plus :size="16" class="mr-1" />
            Tambah
          </button>
        </div>
        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                <th class="px-4 py-3 font-medium">Nama Kategori</th>
                <th class="px-4 py-3 font-medium">Deskripsi</th>
                <th class="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm">
              <tr v-if="kategoriPengeluaran.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-slate-500">Belum ada kategori.</td>
              </tr>
              <tr v-for="item in kategoriPengeluaran" :key="item.id" class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ item.nama }}</td>
                <td class="px-4 py-3 text-slate-500">{{ item.deskripsi || '-' }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button @click="openModal('pengeluaran', item)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 :size="16" />
                    </button>
                    <button @click="handleDelete('pengeluaran', item.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modal Form -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false" :title="(isEditing ? 'Edit ' : 'Tambah ') + (modalType === 'pemasukan' ? 'Kategori Pemasukan' : 'Kategori Pengeluaran')">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nama Kategori</label>
          <input type="text" required v-model="formData.nama" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Misal: Iuran Bulanan / Beli ATK" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
          <textarea v-model="formData.deskripsi" rows="3" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Keterangan tambahan..."></textarea>
        </div>
        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Menyimpan...</template>
            <template v-else>Simpan Kategori</template>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
