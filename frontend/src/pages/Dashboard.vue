<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';
import { TrendingUp, TrendingDown, Users, AlertCircle, ArrowUpRight } from '@lucide/vue';
import api from '../services/api';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

const stats = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get('/dashboard');
    if (response.data.success) {
      stats.value = response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    // Fallback dummy data for demo purposes since we don't have real data yet
    stats.value = {
      totalPemasukanBulanIni: 15000000,
      totalPengeluaranBulanIni: 8500000,
      saldoKas: 45000000,
      jumlahWarga: 124,
      wargaMenunggak: 12
    };
  } finally {
    loading.value = false;
  }
});

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
};

const dummyChartData = [
  { name: 'Jan', pemasukan: 12000000, pengeluaran: 8000000 },
  { name: 'Feb', pemasukan: 13500000, pengeluaran: 9500000 },
  { name: 'Mar', pemasukan: 11000000, pengeluaran: 7000000 },
  { name: 'Apr', pemasukan: 15000000, pengeluaran: 10000000 },
  { name: 'Mei', pemasukan: 14500000, pengeluaran: 8500000 },
];

const chartData = {
  labels: dummyChartData.map(d => d.name),
  datasets: [
    {
      label: 'Pemasukan',
      backgroundColor: '#1bb776',
      borderColor: '#1bb776',
      data: dummyChartData.map(d => d.pemasukan),
      tension: 0.4
    },
    {
      label: 'Pengeluaran',
      backgroundColor: '#f97316',
      borderColor: '#f97316',
      data: dummyChartData.map(d => d.pengeluaran),
      tension: 0.4
    }
  ]
};

const barChartData = {
  labels: dummyChartData.map(d => d.name),
  datasets: [
    {
      label: 'Pemasukan',
      backgroundColor: '#1bb776',
      data: dummyChartData.map(d => d.pemasukan),
      borderRadius: 4
    },
    {
      label: 'Pengeluaran',
      backgroundColor: '#3b82f6',
      data: dummyChartData.map(d => d.pengeluaran),
      borderRadius: 4
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatRupiah(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value: any) {
          return 'Rp' + (value / 1000000) + 'M';
        }
      }
    }
  }
};
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center h-full min-h-[400px]">
    <div class="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else class="space-y-6 animate-in fade-in duration-500">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-slate-500 text-sm mt-1">Ringkasan kondisi keuangan RT saat ini</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 bg-primary-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-sm font-medium text-slate-500">Saldo Kas Saat Ini</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-2">{{ formatRupiah(stats?.saldoKas || 0) }}</h3>
          </div>
          <div class="p-3 bg-primary-100 rounded-lg text-primary-600">
            <TrendingUp :size="20" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 relative z-10">
          <ArrowUpRight :size="16" class="mr-1" />
          <span class="font-medium">+12.5%</span>
          <span class="text-slate-400 ml-2">dari bulan lalu</span>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-sm font-medium text-slate-500">Pemasukan Bulan Ini</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-2">{{ formatRupiah(stats?.totalPemasukanBulanIni || 0) }}</h3>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
            <TrendingUp :size="20" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 bg-orange-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-sm font-medium text-slate-500">Pengeluaran Bulan Ini</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-2">{{ formatRupiah(stats?.totalPengeluaranBulanIni || 0) }}</h3>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg text-orange-600">
            <TrendingDown :size="20" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 bg-slate-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <p class="text-sm font-medium text-slate-500">Warga Terdaftar</p>
            <h3 class="text-2xl font-bold text-slate-800 mt-2">{{ stats?.jumlahWarga || 0 }} <span class="text-sm font-normal text-slate-500">KK</span></h3>
          </div>
          <div class="p-3 bg-slate-100 rounded-lg text-slate-600">
            <Users :size="20" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-red-500 relative z-10">
          <AlertCircle :size="16" class="mr-1" />
          <span class="font-medium">{{ stats?.wargaMenunggak || 0 }} Warga menunggak iuran</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Arus Kas Bulanan</h3>
        <div class="h-80">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Perbandingan Pemasukan & Pengeluaran</h3>
        <div class="h-80">
          <Bar :data="barChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
