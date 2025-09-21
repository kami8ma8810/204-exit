import { test, expect } from '@playwright/test'

test.describe('Debug Test', () => {
  test('コンソールログを確認', async ({ page }) => {
    // コンソールメッセージをキャプチャ
    const consoleLogs: string[] = []
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`)
    })
    
    // エラーをキャプチャ
    const pageErrors: string[] = []
    page.on('pageerror', err => {
      pageErrors.push(err.toString())
    })
    
    await page.goto('/')
    
    // localStorageにデバッグ用のデータを設定
    await page.evaluate(() => {
      window.localStorage.setItem('debug', 'true')
    })
    
    // 新規ゲームボタンをクリック
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // 少し待つ
    await page.waitForTimeout(2000)
    
    // ログを出力
    console.log('=== Console Logs ===')
    consoleLogs.forEach(log => console.log(log))
    
    console.log('=== Page Errors ===')
    pageErrors.forEach(err => console.log(err))
    
    // localStorageの内容を確認
    const storageData = await page.evaluate(() => {
      const data: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          data[key] = localStorage.getItem(key) || ''
        }
      }
      return data
    })
    
    console.log('=== LocalStorage ===')
    console.log(JSON.stringify(storageData, null, 2))
    
    // ゲームが開始されたかどうか確認
    const hasGameStarted = Object.keys(storageData).some(key => 
      key.includes('204-exit') && key.includes('game')
    )
    
    expect(hasGameStarted).toBeTruthy()
  })
})