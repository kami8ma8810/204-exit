import { IGameRepository, GameSaveData } from '@domain/repositories/IGameRepository'
import { Game } from '@domain/entities/Game'

const STORAGE_KEY = '204-exit-current-game'
const HISTORY_KEY = '204-exit-game-history'

export class LocalStorageGameRepository implements IGameRepository {
  private storage: Storage

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage
  }

  async save(game: Game): Promise<void> {
    const saveData: GameSaveData = {
      id: game.id,
      currentStatusCode: game.currentPage.statusCode.value,
      history: game.history,
      attempts: game.attempts,
      createdAt: this.getCreatedAt(game.id) || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.storage.setItem(STORAGE_KEY, JSON.stringify(saveData))
    this.addToHistory(saveData)
  }

  async load(id: string): Promise<GameSaveData | null> {
    const data = this.storage.getItem(STORAGE_KEY)
    if (!data) return null

    const saveData = JSON.parse(data) as GameSaveData
    if (saveData.id !== id) return null

    return saveData
  }

  async delete(id: string): Promise<void> {
    const current = await this.getCurrentGame()
    if (current?.id === id) {
      this.storage.removeItem(STORAGE_KEY)
    }
  }

  async getCurrentGame(): Promise<GameSaveData | null> {
    const data = this.storage.getItem(STORAGE_KEY)
    if (!data) return null

    return JSON.parse(data) as GameSaveData
  }

  async getAllGames(): Promise<GameSaveData[]> {
    const historyData = this.storage.getItem(HISTORY_KEY)
    if (!historyData) return []

    return JSON.parse(historyData) as GameSaveData[]
  }

  private getCreatedAt(id: string): string | null {
    const current = this.storage.getItem(STORAGE_KEY)
    if (!current) return null

    const currentData = JSON.parse(current) as GameSaveData
    if (currentData.id === id) {
      return currentData.createdAt
    }

    return null
  }

  private addToHistory(saveData: GameSaveData): void {
    const historyData = this.storage.getItem(HISTORY_KEY)
    const history = historyData ? JSON.parse(historyData) as GameSaveData[] : []
    
    const existingIndex = history.findIndex(game => game.id === saveData.id)
    if (existingIndex >= 0) {
      history[existingIndex] = saveData
    } else {
      history.push(saveData)
    }

    this.storage.setItem(HISTORY_KEY, JSON.stringify(history))
  }

  static create(): LocalStorageGameRepository {
    return new LocalStorageGameRepository()
  }
}