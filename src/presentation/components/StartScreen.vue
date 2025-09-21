<template>
  <div class="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
    <h1 class="text-4xl font-mono font-bold mb-4">204番出口</h1>
    <p class="text-gray-600 mb-8">
      微細な「異変」を見つけながら進む観察型ゲーム
    </p>
    
    <div class="space-y-4 mb-8 text-left bg-gray-50 p-6 rounded-lg">
      <h2 class="font-bold text-lg mb-3">遊び方</h2>
      <div class="space-y-2 text-sm text-gray-700">
        <p class="flex items-start">
          <span class="mr-2">📌</span>
          <span>各ページには「異変」が潜んでいるかもしれません</span>
        </p>
        <p class="flex items-start">
          <span class="mr-2">👀</span>
          <span>異変があると思ったら「戻る」を選択</span>
        </p>
        <p class="flex items-start">
          <span class="mr-2">➡️</span>
          <span>異変がないと思ったら「進む」を選択</span>
        </p>
        <p class="flex items-start">
          <span class="mr-2">🎯</span>
          <span>204から200へ到達すればクリア！</span>
        </p>
        <p class="flex items-start">
          <span class="mr-2">❌</span>
          <span>間違えると404でゲームオーバー</span>
        </p>
      </div>
    </div>
    
    <div class="flex gap-4">
      <button
        @click="$emit('start')"
        class="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold"
      >
        新規ゲーム
      </button>
      <button
        @click="$emit('continue')"
        class="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold"
      >
        続きから
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  start: []
  continue: []
}>()
</script>