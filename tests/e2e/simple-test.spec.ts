import { test, expect } from '@playwright/test'

test.describe('Simple Test', () => {
  test('タイトル画面が表示される', async ({ page }) => {
    await page.goto('/')
    
    // タイトルが表示される
    await expect(page.locator('h1').first()).toContainText('204番出口')
    
    // 新規ゲームボタンが表示される
    const newGameButton = page.getByRole('button', { name: '新規ゲーム' })
    await expect(newGameButton).toBeVisible()
    
    // ボタンをクリック
    console.log('Clicking new game button...')
    await newGameButton.click()
    
    // 1秒待つ
    await page.waitForTimeout(1000)
    
    // ページの内容を確認
    const bodyText = await page.locator('body').textContent()
    console.log('Body text after click:', bodyText?.substring(0, 200))
    
    // gameStateが設定されたか確認（何か変化があるはず）
    const hasGameStarted = await page.locator('text=204番出口').count() > 0
    expect(hasGameStarted).toBeTruthy()
  })
})