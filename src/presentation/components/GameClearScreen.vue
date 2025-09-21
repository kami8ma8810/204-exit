<template>
  <div class="max-w-md mx-auto text-center p-8">
    <div class="mb-8 animate-pulse">
      <h1 class="text-8xl font-mono font-bold text-green-500 mb-4">200</h1>
      <p class="text-2xl text-gray-700 font-mono">OK</p>
    </div>
    
    <div class="bg-green-50 p-6 rounded-lg mb-8">
      <p class="text-2xl font-bold text-green-600 mb-4">
        🎉 クリアおめでとう！
      </p>
      <div class="space-y-2 text-gray-700">
        <p>挑戦回数: {{ attempts }}回</p>
        <p>正解率: {{ Math.round(accuracy * 100) }}%</p>
      </div>
    </div>
    
    <button
      @click="$emit('restart')"
      class="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold shadow-lg"
    >
      もう一度プレイ
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  attempts: number
  accuracy: number
}>()

defineEmits<{
  restart: []
}>()
</script>