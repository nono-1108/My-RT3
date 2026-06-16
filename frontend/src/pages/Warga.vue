<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Edit2, Trash2, Download } from '@lucide/vue';
import api from '../services/api';
import Modal from '../components/Modal.vue';

const wargaList = ref<any[]>([]);
const loading = ref(true);
const searchTerm = ref('');

const isModalOpen = ref(false);
const editingId = ref<string | null>(null);
const isSubmitting = ref(false);

const formData = ref({
  nik: '',
  no_kk: '',
  nama_lengkap: '',
  no_telp: '',
  alamat: '',
  rt: '01',
  rw: '05',
  no_rumah: '',
  status_aktif: 'AKTIF'
});

const fetchWarga = async () => {
  loading.value = true;
  try {
    const response = await api.get('/warga');
    if (response.data.success) {
      wargaList.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch warga", error);
    wargaList.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWarga();
});

const resetForm = () => {
  editingId.value = null;
  formData.value = {
    nik: '',
    no_kk: '',
    nama_lengkap: '',
    no_telp: '',
    alamat: '',
    rt: '01',
    rw: '05',
    no_rumah: '',
    status_aktif: 'AKTIF'
  };
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (editingId.value) {
      await api.put(`/warga/${editingId.value}`, formData.value);
      alert('Data warga berhasil diperbarui!');
    } else {
      await api.post('/warga', formData.value);
    }
    isModalOpen.value = false;
    resetForm();
    fetchWarga();
  } catch (error: any) {
    console.error("Failed to submit", error);
    alert(`Gagal menyimpan warga: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleEdit = (warga: any) => {
  editingId.value = warga.id;
  formData.value = {
    nik: warga.nik || '',
    no_kk: warga.no_kk || '',
    nama_lengkap: warga.nama_lengkap || '',
    no_telp: warga.no_telp || '',
    alamat: warga.alamat || '',
    rt: warga.rt || '',
    rw: warga.rw || '',
    no_rumah: warga.no_rumah || '',
    status_aktif: warga.status_aktif || 'AKTIF'
  };
  isModalOpen.value = true;
};

const handleDelete = async (id: string, nama: string) => {
  if (window.confirm(`Apakah Anda yakin ingin menghapus data warga ${nama}?`)) {
    try {
      await api.delete(`/warga/${id}`);
      fetchWarga();
    } catch (error: any) {
      console.error("Failed to delete", error);
      alert(`Gagal menghapus warga: ${error.response?.data?.message || error.message}`);
    }
  }
};

const filteredWarga = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return wargaList.value.filter(w => 
    w.nama_lengkap.toLowerCase().includes(term) ||
    w.no_rumah.includes(term)
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
        <h1 class="text-2xl font-bold text-slate-800">Data Warga</h1>
        <p class="text-slate-500 text-sm mt-1">Kelola data informasi kependudukan RT</p>
      </div>
      <div class="flex space-x-2">
        <button class="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
          <Download :size="16" class="mr-2" />
          Import Excel
        </button>
        <button 
          @click="openModalForAdd"
          class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus :size="16" class="mr-2" />
          Tambah Warga
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
            placeholder="Cari nama atau nomor rumah..."
            v-model="searchTerm"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-medium">Nama Lengkap</th>
              <th class="px-6 py-4 font-medium">NIK / No. KK</th>
              <th class="px-6 py-4 font-medium">Blok / No. Rumah</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="filteredWarga.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                Tidak ada data warga ditemukan.
              </td>
            </tr>
            <tr v-else v-for="warga in filteredWarga" :key="warga.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ warga.nama_lengkap }}</p>
                <p class="text-slate-500 text-xs mt-0.5">{{ warga.no_telp || '-' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-700">{{ warga.nik }}</p>
                <p class="text-slate-500 text-xs mt-0.5">{{ warga.no_kk }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-700">RT {{ warga.rt }} / RW {{ warga.rw }}</p>
                <p class="text-slate-500 font-medium text-xs mt-0.5">Rumah: {{ warga.no_rumah }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="['inline-flex px-2.5 py-1 rounded-full text-xs font-medium', warga.status_aktif === 'AKTIF' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
                  {{ warga.status_aktif === 'AKTIF' ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end space-x-2">
                  <button @click="handleEdit(warga)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit2 :size="16" />
                  </button>
                  <button @click="handleDelete(warga.id, warga.nama_lengkap)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Dummy -->
      <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
        <span class="text-sm text-slate-500">
          Menampilkan 1 hingga {{ filteredWarga.length }} dari {{ wargaList.length }} data
        </span>
        <div class="flex space-x-1">
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50">Sebelumnnya</button>
          <button class="px-3 py-1 border border-primary-500 rounded text-sm text-white bg-primary-600">1</button>
          <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-500 bg-white hover:bg-slate-50">Selanjutnya</button>
        </div>
      </div>
    </div>

    <Modal :isOpen="isModalOpen" @close="isModalOpen = false; resetForm()" :title="editingId ? 'Edit Data Warga' : 'Tambah Warga Baru'">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">NIK</label>
            <input type="text" required maxlength="16" v-model="formData.nik" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="16 Digit NIK" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">No. KK</label>
            <input type="text" required maxlength="16" v-model="formData.no_kk" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="16 Digit No. KK" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input type="text" required v-model="formData.nama_lengkap" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nama sesuai KTP" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">No. Telepon / WhatsApp</label>
          <input type="text" v-model="formData.no_telp" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="08..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Alamat Singkat</label>
          <input type="text" v-model="formData.alamat" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Cth: Jl. Mawar Blok A" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">RT</label>
            <input type="text" v-model="formData.rt" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">RW</label>
            <input type="text" v-model="formData.rw" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">No Rumah</label>
            <input type="text" v-model="formData.no_rumah" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Cth: 12A" />
          </div>
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
