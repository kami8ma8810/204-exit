import { ref, computed } from 'vue'

export function useGameLogic() {
  const currentLevel = ref(0)
  const gameWon = ref(false)
  const anomalyLevel = ref(-1)
  const consecutiveCorrect = ref(0)
  const anomalyType = ref<'none' | 'typo' | 'style'>('none')
  const anomalyIndex = ref(-1)

  const hasAnomaly = computed(() => {
    return anomalyType.value !== 'none'
  })

  const generateNewAnomaly = () => {
    // 30%の確率で異変を生成
    if (Math.random() < 0.3) {
      // 異変の種類を決定（今はタイポのみ、将来的にスタイル異変も追加可能）
      anomalyType.value = 'typo'
      
      // どの階層に異変を起こすか決定（現在の階層から±3の範囲）
      const minIndex = Math.max(0, currentLevel.value - 3)
      const maxIndex = Math.min(currentLevel.value, 19)
      
      if (maxIndex >= minIndex) {
        anomalyIndex.value = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex
      } else {
        anomalyIndex.value = currentLevel.value
      }
    } else {
      anomalyType.value = 'none'
      anomalyIndex.value = -1
    }
  }

  const checkForExit = () => {
    if (hasAnomaly.value) {
      // 異変があるのに進もうとした場合
      if (currentLevel.value === 0) {
        generateNewAnomaly()
      } else {
        currentLevel.value = Math.max(0, Math.floor(currentLevel.value / 2))
        consecutiveCorrect.value = 0
        generateNewAnomaly()
      }
      return false
    } else {
      // 正しく進んだ場合
      consecutiveCorrect.value++
      currentLevel.value++
      
      if (consecutiveCorrect.value >= 8 || currentLevel.value >= 20) {
        gameWon.value = true
        return true
      }
      
      // 次の問題を生成
      generateNewAnomaly()
      
      return false
    }
  }

  const resetGame = () => {
    currentLevel.value = 0
    gameWon.value = false
    anomalyLevel.value = -1
    consecutiveCorrect.value = 0
    anomalyType.value = 'none'
    anomalyIndex.value = -1
    generateNewAnomaly()
  }

  // 初回の異変を生成
  generateNewAnomaly()

  return {
    currentLevel,
    gameWon,
    hasAnomaly,
    checkForExit,
    resetGame,
    consecutiveCorrect,
    generateNewAnomaly,
    anomalyType,
    anomalyIndex
  }
}