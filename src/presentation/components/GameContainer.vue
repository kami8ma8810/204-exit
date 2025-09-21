<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- ヘッダー -->
    <header class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <h1 class="text-xl font-mono font-bold">204番出口</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600 font-mono">
            Attempts: {{ attempts }}
          </span>
          <span v-if="accuracy > 0" class="text-sm text-gray-600 font-mono">
            Accuracy: {{ Math.round(accuracy * 100) }}%
          </span>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <div v-if="!gameState" class="text-center">
        <StartScreen @start="handleStartGame" @continue="handleContinueGame" />
      </div>
      
      <div v-else-if="isGameOver" class="text-center">
        <GameOverScreen 
          :attempts="attempts"
          @restart="restartGame" 
        />
      </div>
      
      <div v-else-if="isCleared" class="text-center">
        <GameClearScreen 
          :attempts="attempts"
          :accuracy="accuracy"
          @restart="startNewGame" 
        />
      </div>
      
      <div v-else class="w-full max-w-4xl">
        <StatusDisplay 
          :statusCode="currentStatusCode"
          :level="currentLevel"
          :progress="progress"
        />
        
        <PageDisplay 
          :statusCode="currentStatusCode"
          :level="currentLevel"
          :hasAnomaly="hasAnomaly"
        />
        
        <NavigationControls 
          :canProceed="canProceed"
          :isLoading="isLoading"
          @forward="advancePage"
          @back="goBack"
        />
        
        <!-- 結果表示 -->
        <transition name="fade">
          <div v-if="showResult" class="mt-4 text-center">
            <p :class="resultClass" class="text-lg font-bold">
              {{ resultMessage }}
            </p>
          </div>
        </transition>
      </div>
    </main>

    <!-- エラー表示 -->
    <transition name="slide-up">
      <div v-if="error" class="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
          <span>{{ error }}</span>
          <button @click="resetError" class="ml-3 text-white hover:text-red-100">
            ✕
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGame } from '../composables/useGame'
import StartScreen from './StartScreen.vue'
import GameOverScreen from './GameOverScreen.vue'
import GameClearScreen from './GameClearScreen.vue'
import StatusDisplay from './StatusDisplay.vue'
import PageDisplay from './PageDisplay.vue'
import NavigationControls from './NavigationControls.vue'

const {
  gameState,
  isLoading,
  error,
  showResult,
  isGameOver,
  isCleared,
  hasAnomaly,
  currentStatusCode,
  currentLevel,
  progress,
  attempts,
  accuracy,
  canProceed,
  resultMessage,
  resultClass,
  startNewGame,
  continueGame,
  advancePage,
  goBack,
  restartGame,
  resetError
} = useGame()

const handleStartGame = async () => {
  console.log('[GameContainer] handleStartGame called')
  await startNewGame()
  // gameStateはrefなので、script内では.valueが必要
  console.log('[GameContainer] Game started, state:', (gameState as any).value || gameState)
}

const handleContinueGame = async () => {
  console.log('[GameContainer] handleContinueGame called')
  await continueGame()
  // gameStateはrefなので、script内では.valueが必要  
  console.log('[GameContainer] Game continued, state:', (gameState as any).value || gameState)
}

onMounted(() => {
  console.log('[GameContainer] Component mounted')
  // 初回起動時はタイトル画面を表示
  // gameStateがnullのままなので、StartScreenが表示される
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>