import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

export const useGame = () => {
  const store = useGameStore()

  const statusCodeDisplay = computed(() => {
    const code = store.currentStatusCode
    const labels: Record<number, string> = {
      200: '200 OK',
      201: '201 Created',
      202: '202 Accepted',
      203: '203 Non-Authoritative',
      204: '204 No Content',
      404: '404 Not Found'
    }
    return labels[code] || `${code}`
  })

  const levelDisplay = computed(() => {
    if (store.isGameOver) return 'GAME OVER'
    if (store.isCleared) return 'CLEAR!'
    return `Level ${store.currentLevel}`
  })

  const progressPercentage = computed(() => {
    return Math.round(store.progress * 100)
  })

  const canProceed = computed(() => {
    return !store.isLoading && 
           !store.isGameOver && 
           !store.isCleared &&
           store.gameState !== null
  })

  const needsRestart = computed(() => {
    return store.isGameOver || store.isCleared
  })

  const resultMessage = computed(() => {
    if (!store.showResult) return ''
    
    if (store.isGameOver) {
      return '不正解... 404 Not Found'
    }
    
    if (store.isCleared) {
      return '🎉 クリア！200 OK に到達しました！'
    }
    
    if (store.isCorrect) {
      return '正解！'
    } else {
      return '不正解...'
    }
  })

  const resultClass = computed(() => {
    if (store.isGameOver) return 'text-red-500'
    if (store.isCleared) return 'text-green-500'
    if (store.isCorrect) return 'text-blue-500'
    return 'text-red-400'
  })

  return {
    statusCodeDisplay,
    levelDisplay,
    progressPercentage,
    canProceed,
    needsRestart,
    resultMessage,
    resultClass,
    ...store
  }
}