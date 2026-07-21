<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Wallet, Lock, User } from '@lucide/vue';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await api.post('/auth/login', { 
      username: username.value, 
      password: password.value 
    });
    
    if (response.data.success) {
      authStore.setAuth(response.data.data.token, response.data.data.user);
      router.push('/');
    }
  } catch (err: any) {
    if (err.message === 'Network Error') {
      error.value = 'Tidak dapat terhubung ke server. Pastikan backend berjalan (port 5005).';
    } else {
      error.value = err.response?.data?.message || 'Terjadi kesalahan pada server';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-primary-600 p-8 text-center">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Wallet class="text-primary-600" :size="32" />
        </div>
        <h2 class="text-2xl font-bold text-white">Sistem Keuangan RT</h2>
        <p class="text-primary-100 mt-1 text-sm">Masuk ke akun Anda</p>
      </div>
      
      <div class="p-8">
        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="text-slate-400" :size="18" />
              </div>
              <input
                type="text"
                v-model="username"
                class="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="text-slate-400" :size="18" />
              </div>
              <input
                type="password"
                v-model="password"
                class="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center"
          >
            <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
