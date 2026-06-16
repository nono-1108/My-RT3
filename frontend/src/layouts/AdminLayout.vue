<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';
import { RouterView, RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutGrid, Users, CreditCard, Receipt, 
  FileText, LogOut, Menu, Bell, Wallet, Database, ChevronDown, ChevronUp, Circle, Mail
} from '@lucide/vue';

interface NavChild {
  name: string;
  path: string;
}

interface NavItem {
  name: string;
  path?: string;
  icon: Component;
  isParent?: boolean;
  children?: NavChild[];
}

const sidebarOpen = ref(true);
const masterDataOpen = ref(false);

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const filteredNavItems = computed<NavItem[]>(() => {
  const currentRole = user.value?.role || 'ADMIN';
  const accessLevel = user.value?.access_level || 'WRITE';
  
  if (currentRole === 'KETUA_RT' || accessLevel === 'READ') {
    return [
      { name: 'Laporan', path: '/laporan', icon: FileText as Component },
    ];
  } else if (currentRole === 'ADMIN') {
    return [
      { name: 'Dashboard', path: '/', icon: LayoutGrid as Component },
      { 
        name: 'Master Data', 
        icon: Database as Component, 
        isParent: true,
        children: [
          { name: 'Kategori Transaksi', path: '/master/kategori' },
          { name: 'Saldo Awal Kas', path: '/master/saldo-awal' },
          { name: 'Data Pengurus', path: '/master/pengurus' },
          { name: 'Pengaturan RT', path: '/master/pengaturan' },
        ]
      },
      { name: 'Data Warga', path: '/warga', icon: Users as Component },
      { name: 'Surat Pengantar', path: '/surat-pengantar', icon: Mail as Component },
      { name: 'Pemasukan', path: '/pemasukan', icon: Wallet as Component },
      { name: 'Pengeluaran', path: '/pengeluaran', icon: CreditCard as Component },
      { name: 'Iuran Warga', path: '/iuran', icon: Receipt as Component },
      { name: 'Laporan', path: '/laporan', icon: FileText as Component },
    ];
  } else if (currentRole === 'BENDAHARA_RT') {
    return [
      { name: 'Dashboard', path: '/', icon: LayoutGrid as Component },
      { name: 'Pemasukan', path: '/pemasukan', icon: Wallet as Component },
      { name: 'Pengeluaran', path: '/pengeluaran', icon: CreditCard as Component },
      { name: 'Iuran Warga', path: '/iuran', icon: Receipt as Component },
      { name: 'Laporan', path: '/laporan', icon: FileText as Component },
      { 
        name: 'Master Data', 
        icon: Database as Component, 
        isParent: true,
        children: [
          { name: 'Kategori Transaksi', path: '/master/kategori' },
          { name: 'Saldo Awal Kas', path: '/master/saldo-awal' },
        ]
      },
    ];
  } else if (currentRole === 'SEKRETARIS_RT') {
    return [
      { name: 'Dashboard', path: '/', icon: LayoutGrid as Component },
      { name: 'Data Warga', path: '/warga', icon: Users as Component },
      { name: 'Surat Pengantar', path: '/surat-pengantar', icon: Mail as Component },
      { 
        name: 'Master Data', 
        icon: Database as Component, 
        isParent: true,
        children: [
          { name: 'Data Pengurus', path: '/master/pengurus' },
          { name: 'Pengaturan RT', path: '/master/pengaturan' },
        ]
      },
    ];
  }

  // Fallback
  return [
    { name: 'Dashboard', path: '/', icon: LayoutGrid as Component }
  ];
});

const isPathActive = (path: string | undefined) => {
  if (!path) return false;
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const isChildActive = (children: NavChild[] | undefined) => {
  if (!children) return false;
  return children.some(child => route.path.startsWith(child.path));
};

const toggleMasterData = () => {
  masterDataOpen.value = !masterDataOpen.value;
  if (!sidebarOpen.value) {
    sidebarOpen.value = true;
  }
};

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <div :class="[
      'bg-primary-800 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:static lg:z-auto',
      sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'
    ]">
      <div class="h-16 flex items-center justify-center px-4 shrink-0">
        <Wallet class="text-primary-300 mr-2 shrink-0" :size="24" />
        <span v-if="sidebarOpen" class="font-bold text-lg whitespace-nowrap">Keuangan RT</span>
      </div>
      
      <div class="flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1 px-3">
          <template v-for="item in filteredNavItems" :key="item.name">
            <li v-if="item.isParent && item.children">
              <button
                @click="toggleMasterData"
                :class="[
                  'w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors',
                  isChildActive(item.children) || masterDataOpen
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                ]"
              >
                <div class="flex items-center">
                  <component :is="item.icon" :size="20" class="shrink-0" />
                  <span v-if="sidebarOpen" class="ml-3 font-medium text-[15px] truncate">{{ item.name }}</span>
                </div>
                <template v-if="sidebarOpen">
                  <ChevronUp v-if="masterDataOpen" :size="16" class="shrink-0" />
                  <ChevronDown v-else :size="16" class="shrink-0" />
                </template>
              </button>
              
              <ul v-if="sidebarOpen && masterDataOpen" class="mt-1 space-y-1 pl-9">
                <li v-for="child in item.children" :key="child.path">
                  <RouterLink
                    :to="child.path"
                    @click="closeSidebarOnMobile"
                    :class="[
                      'flex items-center px-3 py-2 rounded-lg transition-colors text-sm',
                      isPathActive(child.path)
                        ? 'bg-primary-600 text-white font-medium' 
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                    ]"
                  >
                    <Circle :size="6" class="mr-3 shrink-0" :class="isPathActive(child.path) ? 'fill-current' : ''" />
                    {{ child.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            
            <li v-else-if="item.path">
              <RouterLink
                :to="item.path"
                @click="closeSidebarOnMobile"
                :class="[
                  'flex items-center px-3 py-3 rounded-lg transition-colors',
                  isPathActive(item.path)
                    ? 'bg-primary-700 text-white shadow-sm' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                ]"
              >
                <component :is="item.icon" :size="20" class="shrink-0" />
                <span v-if="sidebarOpen" class="ml-3 font-medium text-[15px] truncate">{{ item.name }}</span>
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
      
      <div class="p-4 shrink-0">
        <button 
          @click="handleLogout"
          class="flex items-center w-full px-3 py-3 text-primary-100 hover:text-white hover:bg-primary-700 rounded-lg transition-colors"
        >
          <LogOut :size="20" class="shrink-0" />
          <span v-if="sidebarOpen" class="ml-3 font-medium text-[15px]">Logout</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-10 shrink-0">
        <div class="flex items-center">
          <button 
            @click="sidebarOpen = !sidebarOpen"
            class="text-slate-500 hover:text-slate-700 focus:outline-none transition-colors"
          >
            <Menu :size="24" />
          </button>
        </div>
        
        <div class="flex items-center space-x-3 lg:space-x-5">
          <button class="text-slate-400 hover:text-primary-600 relative transition-colors hidden sm:block">
            <Bell :size="20" />
            <span class="absolute top-0 right-0.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div class="flex items-center sm:border-l border-slate-200 sm:pl-5">
            <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-2 lg:mr-3 shrink-0">
              {{ user?.nama?.charAt(0) || 'A' }}
            </div>
            <div class="text-sm">
              <p class="font-bold text-slate-800 leading-none mb-0.5 truncate max-w-[100px] sm:max-w-none">{{ user?.nama || 'Administrator' }}</p>
              <p class="text-[10px] lg:text-[11px] font-medium text-slate-400 uppercase tracking-wide">{{ (user?.role || 'ADMIN').replace('_', ' ') }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-4 lg:p-6">
        <RouterView />
      </main>

      <footer class="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500 shrink-0">
        nono@Gesit Global Solutions 2026
      </footer>
    </div>
  </div>
</template>
