import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GameStateDTO } from '@application/dto/GameStateDTO'
import { StartGameUseCase } from '@application/use-cases/StartGameUseCase'
import { AdvancePageUseCase } from '@application/use-cases/AdvancePageUseCase'
import { GoBackPageUseCase } from '@application/use-cases/GoBackPageUseCase'
import { RestartGameUseCase } from '@application/use-cases/RestartGameUseCase'
import { LocalStorageGameRepository } from '@infrastructure/repositories/LocalStorageGameRepository'

export const useGameStore = defineStore('game', () => {
  // State
  const gameState = ref<GameStateDTO | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const showResult = ref(false)
  const lastChoice = ref<'forward' | 'back' | null>(null)
  const isCorrect = ref(false)

  // Repository and UseCases
  const repository = LocalStorageGameRepository.create()
  const startGameUseCase = StartGameUseCase.create(repository)
  const advancePageUseCase = AdvancePageUseCase.create(repository)
  const goBackPageUseCase = GoBackPageUseCase.create(repository)
  const restartGameUseCase = RestartGameUseCase.create(repository)

  // Computed
  const currentStatusCode = computed(() => gameState.value?.currentStatusCode ?? 204)
  const currentLevel = computed(() => gameState.value?.currentLevel ?? 1)
  const progress = computed(() => gameState.value?.progress ?? 0)
  const isGameOver = computed(() => gameState.value?.isGameOver ?? false)
  const isCleared = computed(() => gameState.value?.isCleared ?? false)
  const hasAnomaly = computed(() => gameState.value?.hasAnomaly ?? false)
  const attempts = computed(() => gameState.value?.attempts ?? 0)
  const accuracy = computed(() => gameState.value?.statistics.accuracy ?? 0)
  const activeAnomalies = computed(() => gameState.value?.activeAnomalies ?? [])

  // Actions
  const startNewGame = async () => {
    isLoading.value = true
    error.value = null
    showResult.value = false
    lastChoice.value = null

    try {
      const result = await startGameUseCase.execute()
      if (result.isSuccess) {
        gameState.value = result.value
      } else {
        error.value = result.error
      }
    } catch (e) {
      error.value = 'ゲーム開始に失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const continueGame = async () => {
    isLoading.value = true
    error.value = null
    showResult.value = false
    lastChoice.value = null

    try {
      const result = await startGameUseCase.executeWithContinue()
      if (result.isSuccess) {
        gameState.value = result.value
      } else {
        error.value = result.error
      }
    } catch (e) {
      error.value = 'ゲーム読み込みに失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const advancePage = async () => {
    if (isLoading.value || !gameState.value) return

    isLoading.value = true
    error.value = null
    lastChoice.value = 'forward'

    const previousState = gameState.value

    try {
      const result = await advancePageUseCase.execute()
      if (result.isSuccess) {
        gameState.value = result.value
        
        // 正解判定
        if (result.value.isGameOver) {
          isCorrect.value = false
        } else {
          isCorrect.value = !previousState.hasAnomaly
        }
        
        showResult.value = true
        
        // 結果表示後、少し待ってから非表示に
        setTimeout(() => {
          showResult.value = false
        }, 1500)
      } else {
        error.value = result.error
      }
    } catch (e) {
      error.value = '進行に失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const goBack = async () => {
    if (isLoading.value || !gameState.value) return

    isLoading.value = true
    error.value = null
    lastChoice.value = 'back'

    const previousState = gameState.value

    try {
      const result = await goBackPageUseCase.execute()
      if (result.isSuccess) {
        gameState.value = result.value
        
        // 正解判定
        if (result.value.isGameOver) {
          isCorrect.value = false
        } else {
          isCorrect.value = previousState.hasAnomaly
        }
        
        showResult.value = true
        
        // 結果表示後、少し待ってから非表示に
        setTimeout(() => {
          showResult.value = false
        }, 1500)
      } else {
        error.value = result.error
      }
    } catch (e) {
      error.value = '戻るに失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const restartGame = async () => {
    isLoading.value = true
    error.value = null
    showResult.value = false
    lastChoice.value = null

    try {
      const result = await restartGameUseCase.execute()
      if (result.isSuccess) {
        gameState.value = result.value
      } else {
        error.value = result.error
      }
    } catch (e) {
      error.value = 'リスタートに失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const resetError = () => {
    error.value = null
  }

  return {
    // State
    gameState,
    isLoading,
    error,
    showResult,
    lastChoice,
    isCorrect,
    
    // Computed
    currentStatusCode,
    currentLevel,
    progress,
    isGameOver,
    isCleared,
    hasAnomaly,
    attempts,
    accuracy,
    activeAnomalies,
    
    // Actions
    startNewGame,
    continueGame,
    advancePage,
    goBack,
    restartGame,
    resetError
  }
})