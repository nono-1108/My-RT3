<script setup>
import { ref, onMounted } from 'vue';
import { Edit2, Shield, User } from '@lucide/vue';
import api from '../services/api.js';
import Modal from '../components/Modal.vue';

const users = ref([]);
const loading = ref(true);

const isModalOpen = ref(false);
const editingUser = ref(null);
const isSubmitting = ref(false);

const formData = ref({
  nama: '',
  role: '',
  access_level: 'WRITE',
  password: ''
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/users');
    if (response.data.success) {
      users.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch users", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const formatRole = (role) => {
  return role.replace('_', ' ');
};

const handleEdit = (user) => {
  editingUser.value = user;
  formData.value = {
    nama: user.nama || '',
    role: user.role || '',
    access_level: user.access_level || 'WRITE',
    password: '' // empty password so we only update if typed
  };
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = { 
      nama: formData.value.nama,
      role: formData.value.role,
      access_level: formData.value.access_level
    };
    if (formData.value.password) {
      payload.password = formData.value.password;
    }

    await api.put(`/users/${editingUser.value.id}`, payload);
    alert('Data pengurus berhasil diperbarui!');
    
    isModalOpen.value = false;
    fetchUsers();
  } catch (error) {
    console.error("Failed to update user", error);
    alert(`Gagal menyimpan: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Pengaturan RT (Pengurus)</h1>
        <p class="text-slate-500 text-sm mt-1">Kelola nama dan akses masuk untuk pengurus RT</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-medium">Username</th>
              <th class="px-6 py-4 font-medium">Nama Lengkap</th>
              <th class="px-6 py-4 font-medium">Role Jabatan</th>
              <th class="px-6 py-4 font-medium">Hak Akses</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-slate-500">
                Belum ada data pengurus.
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <User class="text-slate-400 mr-2" :size="16" />
                  <span class="font-medium text-slate-700">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4 font-semibold text-slate-800">
                {{ user.nama }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center text-primary-700 font-medium bg-primary-50 px-2.5 py-1 rounded-md inline-flex">
                  <Shield class="mr-1.5" :size="14" />
                  {{ formatRole(user.role) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border"
                      :class="user.access_level === 'READ' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-200'">
                  {{ user.access_level === 'READ' ? 'Read Only' : 'Write/Read' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Aktif
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="handleEdit(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center" title="Edit Akun">
                  <Edit2 :size="16" class="mr-2" />
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false" :title="'Edit Akun: ' + formatRole(editingUser?.role || '')">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Username (Login)</label>
          <input type="text" disabled :value="editingUser?.username" class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
          <p class="text-xs text-slate-400 mt-1">Username digunakan untuk login dan tidak dapat diubah.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input type="text" required v-model="formData.nama" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nama lengkap pengurus" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role Jabatan</label>
          <select required v-model="formData.role" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="ADMIN">Admin</option>
            <option value="KETUA_RT">Ketua RT</option>
            <option value="BENDAHARA_RT">Bendahara RT</option>
            <option value="SEKRETARIS_RT">Sekretaris RT</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Hak Akses</label>
          <select required v-model="formData.access_level" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="READ">Hanya Melihat (Read Only)</option>
            <option value="WRITE">Melihat & Mengedit (Write/Read)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Password Baru (Opsional)</label>
          <input type="password" v-model="formData.password" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Biarkan kosong jika tidak ingin mengubah password" />
          <p class="text-xs text-slate-500 mt-1">Jika diisi, password untuk akun ini akan terganti.</p>
        </div>

        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="isModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Menyimpan...</template>
            <template v-else>Simpan Perubahan</template>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
