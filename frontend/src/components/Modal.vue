<script setup>
import { X } from '@lucide/vue';

defineProps({
  isOpen: Boolean,
  title: String
});

defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
        <h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>
        <button 
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors"
        >
          <X :size="20" />
        </button>
      </div>
      <div class="p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
