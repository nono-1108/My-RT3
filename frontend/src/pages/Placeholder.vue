<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Halaman Sedang Dikerjakan</h2>
      <p class="text-slate-500">Halaman rute <span class="font-semibold text-primary-600">{{ route.path }}</span> ini sedang dalam proses migrasi ke Vue.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>
