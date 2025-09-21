<template>
  <div class="flex gap-4">
    <button
      @click="$emit('back')"
      :disabled="!canProceed || isLoading"
      :class="buttonClass('back')"
      class="flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <span class="flex items-center justify-center gap-2">
        <span>←</span>
        <span>戻る</span>
        <span class="text-xs opacity-70">(異変あり)</span>
      </span>
    </button>
    
    <button
      @click="$emit('forward')"
      :disabled="!canProceed || isLoading"
      :class="buttonClass('forward')"
      class="flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <span class="flex items-center justify-center gap-2">
        <span>進む</span>
        <span class="text-xs opacity-70">(異変なし)</span>
        <span>→</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  canProceed: boolean
  isLoading: boolean
}>()

defineEmits<{
  forward: []
  back: []
}>()

const buttonClass = computed(() => (type: 'forward' | 'back') => {
  if (type === 'forward') {
    return 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
  }
  return 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
})
</script>