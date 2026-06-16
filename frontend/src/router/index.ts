import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import Placeholder from '../pages/Placeholder.vue';
import Login from '../pages/Login.vue';
import Dashboard from '../pages/Dashboard.vue';
import Warga from '../pages/Warga.vue';
import Pemasukan from '../pages/Pemasukan.vue';
import Pengeluaran from '../pages/Pengeluaran.vue';
import Iuran from '../pages/Iuran.vue';
import Laporan from '../pages/Laporan.vue';
import SaldoAwal from '../pages/SaldoAwal.vue';
import Kategori from '../pages/Kategori.vue';
import Pengaturan from '../pages/Pengaturan.vue';
import { useAuthStore } from '../store/authStore';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'warga', name: 'Warga', component: Warga },
      { path: 'surat-pengantar', name: 'SuratPengantar', component: Placeholder },
      { path: 'pemasukan', name: 'Pemasukan', component: Pemasukan },
      { path: 'pengeluaran', name: 'Pengeluaran', component: Pengeluaran },
      { path: 'iuran', name: 'Iuran', component: Iuran },
      { path: 'laporan', name: 'Laporan', component: Laporan },
      { path: 'master/kategori', name: 'Kategori', component: Kategori },
      { path: 'master/saldo-awal', name: 'SaldoAwal', component: SaldoAwal },
      { path: 'master/pengurus', name: 'Pengurus', component: Placeholder },
      { path: 'master/pengaturan', name: 'Pengaturan', component: Pengaturan },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else if (authStore.token && (authStore.user?.role === 'KETUA_RT' || authStore.user?.access_level === 'READ') && to.path !== '/laporan') {
    next('/laporan');
  } else {
    next();
  }
});

export default router;
