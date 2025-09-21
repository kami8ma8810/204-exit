import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageGameRepository } from './LocalStorageGameRepository'
import { Game } from '@domain/entities/Game'
import { StatusCode } from '@domain/value-objects/StatusCode'

describe('LocalStorageGameRepository', () => {
  let repository: LocalStorageGameRepository
  let mockLocalStorage: Storage

  beforeEach(() => {
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    }
    
    global.localStorage = mockLocalStorage as Storage
    repository = LocalStorageGameRepository.create()
  })

  describe('save', () => {
    it('ゲームを保存できる', async () => {
      const game = Game.create()
      
      await repository.save(game)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('204-exit-current-game'),
        expect.any(String)
      )
      
      const savedData = JSON.parse(
        (mockLocalStorage.setItem as any).mock.calls[0][1]
      )
      
      expect(savedData.id).toBe(game.id)
      expect(savedData.currentStatusCode).toBe(204)
      expect(savedData.attempts).toBe(1)
    })

    it('保存データに作成日時と更新日時が含まれる', async () => {
      const game = Game.create()
      
      await repository.save(game)
      
      const savedData = JSON.parse(
        (mockLocalStorage.setItem as any).mock.calls[0][1]
      )
      
      expect(savedData.createdAt).toBeDefined()
      expect(savedData.updatedAt).toBeDefined()
    })
  })

  describe('load', () => {
    it('保存されたゲームを読み込める', async () => {
      const gameData = {
        id: 'test-game',
        currentStatusCode: 203,
        history: [],
        attempts: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockLocalStorage.getItem = vi.fn().mockReturnValue(
        JSON.stringify(gameData)
      )
      
      const loaded = await repository.load('test-game')
      
      expect(loaded).toEqual(gameData)
    })

    it('存在しないゲームはnullを返す', async () => {
      mockLocalStorage.getItem = vi.fn().mockReturnValue(null)
      
      const loaded = await repository.load('non-existent')
      
      expect(loaded).toBeNull()
    })
  })

  describe('delete', () => {
    it('ゲームを削除できる', async () => {
      const gameData = {
        id: 'test-game',
        currentStatusCode: 202,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockLocalStorage.getItem = vi.fn().mockReturnValue(
        JSON.stringify(gameData)
      )
      
      await repository.delete('test-game')
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        expect.stringContaining('204-exit-current-game')
      )
    })
  })

  describe('getCurrentGame', () => {
    it('現在のゲームを取得できる', async () => {
      const gameData = {
        id: 'current-game',
        currentStatusCode: 202,
        history: [],
        attempts: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      mockLocalStorage.getItem = vi.fn().mockReturnValue(
        JSON.stringify(gameData)
      )
      
      const current = await repository.getCurrentGame()
      
      expect(current).toEqual(gameData)
    })

    it('現在のゲームがない場合はnullを返す', async () => {
      mockLocalStorage.getItem = vi.fn().mockReturnValue(null)
      
      const current = await repository.getCurrentGame()
      
      expect(current).toBeNull()
    })
  })

  describe('getAllGames', () => {
    it('すべてのゲームを取得できる', async () => {
      const gamesData = [
        {
          id: 'game-1',
          currentStatusCode: 204,
          history: [],
          attempts: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'game-2',
          currentStatusCode: 200,
          history: [],
          attempts: 3,
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z'
        }
      ]
      
      mockLocalStorage.getItem = vi.fn()
        .mockReturnValueOnce(JSON.stringify(gamesData))
      
      const allGames = await repository.getAllGames()
      
      expect(allGames).toHaveLength(2)
      expect(allGames).toEqual(gamesData)
    })

    it('ゲームがない場合は空配列を返す', async () => {
      mockLocalStorage.getItem = vi.fn().mockReturnValue(null)
      
      const allGames = await repository.getAllGames()
      
      expect(allGames).toEqual([])
    })
  })
})