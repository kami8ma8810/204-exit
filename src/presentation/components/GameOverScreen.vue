<template>
  <div class="max-w-md mx-auto text-center p-8">
    <div class="mb-8 animate-glitch">
      <h1 class="text-8xl font-mono font-bold text-red-500 mb-4">404</h1>
      <p class="text-2xl text-gray-700 font-mono">Not Found</p>
    </div>
    
    <div class="bg-red-50 p-6 rounded-lg mb-8">
      <p class="text-gray-700 mb-2">
        不正解でした...
      </p>
      <p class="text-sm text-gray-600">
        挑戦回数: {{ attempts }}回目
      </p>
    </div>
    
    <button
      @click="$emit('restart')"
      class="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold shadow-lg"
    >
      リトライ
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  attempts: number
}>()

defineEmits<{
  restart: []
}>()
</script>

<style scoped>
@keyframes glitch {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateX(2px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(1px);
  }
}

.animate-glitch {
  animation: glitch 0.5s ease-in-out;
}
</style>