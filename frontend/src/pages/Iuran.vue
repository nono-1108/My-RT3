<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Settings2, CheckCircle2 } from '@lucide/vue';
import api from '../services/api.js';
import Modal from '../components/Modal.vue';

const dataList = ref([]);
const loading = ref(true);
const searchTerm = ref('');

const isGenerateModalOpen = ref(false);
const generateData = ref({
  bulan: new Date().getMonth() + 1,
  tahun: new Date().getFullYear(),
  nominal: ''
});

const payModalOpen = ref(false);
const selectedIuran = ref(null);
const payData = ref({
  tanggal_bayar: new Date().toISOString().split('T')[0],
  metode_pembayaran: 'Tunai'
});
const isSubmitting = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/iuran');
    if (response.data.success) {
      dataList.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch iuran", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const handleGenerate = async () => {
  isSubmitting.value = true;
  try {
    await api.post('/iuran/generate', {
      bulan: Number(generateData.value.bulan),
      tahun: Number(generateData.value.tahun),
      nominal: Number(generateData.value.nominal)
    });
    isGenerateModalOpen.value = false;
    generateData.value.nominal = '';
    fetchData();
    alert('Tagihan berhasil dibuat!');
  } catch (error) {
    console.error(error);
    alert('Gagal membuat tagihan');
  } finally {
    isSubmitting.value = false;
  }
};

const handlePay = async () => {
  if (!selectedIuran.value) return;
  isSubmitting.value = true;
  try {
    await api.put(`/iuran/bayar/${selectedIuran.value.id}`, payData.value);
    payModalOpen.value = false;
    selectedIuran.value = null;
    fetchData();
  } catch (error) {
    console.error(error);
    alert('Gagal menandai lunas');
  } finally {
    isSubmitting.value = false;
  }
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(angka));
};

const getBulanNama = (bulan) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[bulan - 1] || bulan.toString();
};

const filteredData = computed(() => {
  const term = searchTerm.value.toLowerCase();
  return dataList.value.filter(d => 
    (d.warga?.nama_lengkap || '').toLowerCase().includes(term)
  );
});

const openPayModal = (item) => {
  selectedIuran.value = item;
  payModalOpen.value = true;
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Iuran Warga</h1>
        <p class="text-slate-500 text-sm mt-1">Pengelolaan tagihan bulanan warga RT</p>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="isGenerateModalOpen = true"
          class="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <Settings2 :size="16" class="mr-2" />
          Generate Tagihan Masal
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
            placeholder="Cari nama warga..."
            v-model="searchTerm"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-medium">Bulan/Tahun</th>
              <th class="px-6 py-4 font-medium">Nama Warga</th>
              <th class="px-6 py-4 font-medium">Nominal</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-sm">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Memuat data...</td>
            </tr>
            <tr v-else-if="filteredData.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">Tidak ada tagihan iuran.</td>
            </tr>
            <tr v-else v-for="item in filteredData" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-medium text-slate-700">
                {{ getBulanNama(item.bulan) }} {{ item.tahun }}
              </td>
              <td class="px-6 py-4 text-slate-800 font-medium">
                {{ item.warga?.nama_lengkap || '-' }}
                <div class="text-xs text-slate-500 font-normal mt-0.5">Rumah: {{ item.warga?.no_rumah }}</div>
              </td>
              <td class="px-6 py-4 text-slate-700 font-medium">
                {{ formatRupiah(item.nominal) }}
              </td>
              <td class="px-6 py-4">
                <span v-if="item.status === 'LUNAS'" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Lunas
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Belum Lunas
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  v-if="item.status !== 'LUNAS'"
                  @click="openPayModal(item)"
                  class="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded text-xs font-medium transition-colors"
                >
                  <CheckCircle2 :size="14" class="mr-1" />
                  Tandai Lunas
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Generate Tagihan -->
    <Modal :isOpen="isGenerateModalOpen" @close="isGenerateModalOpen = false" title="Generate Tagihan Masal">
      <form @submit.prevent="handleGenerate" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Bulan</label>
            <select v-model="generateData.bulan" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option v-for="i in 12" :key="i" :value="i">{{ getBulanNama(i) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
            <input type="number" required v-model="generateData.tahun" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
          <input type="number" required min="1" v-model="generateData.nominal" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Contoh: 50000" />
        </div>
        <p class="text-xs text-slate-500">Tagihan akan digenerate untuk semua warga aktif yang ada di sistem.</p>
        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="isGenerateModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Memproses...</template>
            <template v-else>Generate Tagihan</template>
          </button>
        </div>
      </form>
    </Modal>

    <!-- Modal Bayar Iuran -->
    <Modal :isOpen="payModalOpen" @close="payModalOpen = false" title="Pembayaran Iuran">
      <form @submit.prevent="handlePay" class="space-y-4">
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
          <div class="text-sm text-blue-800">
            Menandai lunas tagihan <strong>{{ selectedIuran?.warga?.nama_lengkap }}</strong> untuk bulan <strong>{{ selectedIuran ? getBulanNama(selectedIuran.bulan) : '' }} {{ selectedIuran?.tahun }}</strong> sejumlah <strong>{{ formatRupiah(selectedIuran?.nominal || 0) }}</strong>.
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal Bayar</label>
          <input type="date" required v-model="payData.tanggal_bayar" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Metode Pembayaran</label>
          <select required v-model="payData.metode_pembayaran" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="Tunai">Tunai</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="E-Wallet">E-Wallet</option>
          </select>
        </div>
        <div class="pt-4 flex justify-end space-x-2">
          <button type="button" @click="payModalOpen = false" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50">
            <template v-if="isSubmitting">Memproses...</template>
            <template v-else>Tandai Lunas</template>
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>
