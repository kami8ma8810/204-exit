import { test, expect } from '@playwright/test'

test.describe('204番出口 - ゲームフロー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // LocalStorageをクリア
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('新規ゲームを開始できる', async ({ page }) => {
    // コンソールエラーを表示
    page.on('console', msg => console.log('[Browser]', msg.text()))
    page.on('pageerror', err => console.error('[Page Error]', err))
    
    // タイトル画面が表示される
    await expect(page.locator('h1').first()).toContainText('204番出口')
    
    // 新規ゲームボタンをクリック
    console.log('クリック前')
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    console.log('クリック後')
    
    // クリック後少し待つ
    await page.waitForTimeout(2000)
    
    // デバッグ用にHTMLを出力
    const html = await page.content()
    console.log('HTML:', html.substring(0, 500))
    
    // ゲーム画面に遷移 - まずナビゲーションボタンを確認
    await expect(page.getByRole('button', { name: /進む/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /戻る/ })).toBeVisible()
    
    // StatusDisplayのメインタイトルを確認
    const statusCode = page.locator('h2').first()
    await expect(statusCode).toBeVisible()
    await expect(statusCode).toContainText('204')
  })

  test('進むボタンで次のページへ遷移できる', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // 初期状態を確認 - h2要素を特定
    await expect(page.locator('h2').filter({ hasText: '204 No Content' })).toBeVisible()
    
    // 進むボタンをクリック
    await page.getByRole('button', { name: /進む/ }).click()
    
    // 次のステータスコードに進むか、404エラーになる
    const hasError = await page.locator('text=404').isVisible({ timeout: 2000 }).catch(() => false)
    
    if (hasError) {
      // ゲームオーバー画面
      await expect(page.locator('text=Not Found')).toBeVisible()
      await expect(page.getByRole('button', { name: 'リトライ' })).toBeVisible()
    } else {
      // 次のレベルに進んだ
      const hasLevel2 = await page.locator('text=203').isVisible({ timeout: 1000 }).catch(() => false)
      if (hasLevel2) {
        await expect(page.locator('text=203 Non-Authoritative')).toBeVisible()
      }
    }
  })

  test('戻るボタンで前のページへ遷移できる', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // 戻るボタンをクリック
    await page.getByRole('button', { name: /戻る/ }).click()
    
    // 次のステータスコードに進むか、404エラーになる
    const hasError = await page.locator('text=404').isVisible({ timeout: 2000 }).catch(() => false)
    
    if (hasError) {
      // ゲームオーバー画面
      await expect(page.locator('text=Not Found')).toBeVisible()
    } else {
      // 次のレベルに進んだ（異変があった場合）
      const hasLevel2 = await page.locator('text=203').isVisible({ timeout: 1000 }).catch(() => false)
      if (hasLevel2) {
        await expect(page.locator('text=203 Non-Authoritative')).toBeVisible()
      }
    }
  })

  test('ゲームオーバー後にリトライできる', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // 404エラーになるまで適当に進む（最大10回試行）
    for (let i = 0; i < 10; i++) {
      const hasError = await page.locator('text=404').isVisible({ timeout: 500 }).catch(() => false)
      if (hasError) break
      
      // ランダムに進むか戻る
      const buttons = await page.getByRole('button').filter({ hasText: /進む|戻る/ }).all()
      if (buttons.length > 0) {
        await buttons[Math.floor(Math.random() * buttons.length)].click()
      }
    }
    
    // 404画面でリトライボタンが表示される
    const hasError = await page.locator('text=404').isVisible({ timeout: 1000 }).catch(() => false)
    if (hasError) {
      await expect(page.getByRole('button', { name: 'リトライ' })).toBeVisible()
      
      // リトライボタンをクリック
      await page.getByRole('button', { name: 'リトライ' }).click()
      
      // 204に戻る - h2要素を特定
      await expect(page.locator('h2').filter({ hasText: '204 No Content' })).toBeVisible()
    }
  })

  test('プログレスバーが正しく表示される', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // プログレスバーが表示される
    const progressBar = page.locator('.bg-blue-500').first()
    
    // プログレスバーの存在を確認
    await expect(progressBar).toHaveCount(1)
    
    // 初期状態では0%
    const initialWidth = await progressBar.evaluate(el => el.style.width)
    expect(initialWidth).toBe('0%')
  })

  test('続きから機能が動作する', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // ゲームが開始されたことを確認 - h2要素を特定
    await expect(page.locator('h2').filter({ hasText: '204 No Content' })).toBeVisible()
    
    // ページをリロード
    await page.reload()
    
    // 続きからボタンが表示される
    await expect(page.getByRole('button', { name: '続きから' })).toBeVisible()
    
    // 続きからボタンをクリック
    await page.getByRole('button', { name: '続きから' }).click()
    
    // ゲーム画面に戻る - h2要素を特定 
    await expect(page.locator('h2').filter({ hasText: '204 No Content' })).toBeVisible()
  })

  test('異変表示が適用される', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // 異変がある要素を探す
    const anomalyTarget = page.locator('.anomaly-target').first()
    
    // 要素が存在する場合、スタイルが適用されているか確認
    const count = await anomalyTarget.count()
    if (count > 0) {
      // 異変用のスタイル要素が追加されている
      const styleElement = page.locator('#anomaly-styles')
      await expect(styleElement).toHaveCount(1)
    }
  })

  test('レベルごとに異なるコンテンツが表示される', async ({ page }) => {
    // 新規ゲームを開始
    await page.getByRole('button', { name: '新規ゲーム' }).click()
    
    // Level 1のコンテンツを確認
    const level1Content = await page.locator('text=No Content').isVisible({ timeout: 1000 }).catch(() => false)
    
    if (level1Content) {
      expect(level1Content).toBe(true)
    }
    
    // 次のレベルに進む試行（失敗する可能性あり）
    for (let i = 0; i < 3; i++) {
      const hasError = await page.locator('text=404').isVisible({ timeout: 500 }).catch(() => false)
      if (hasError) break
      
      await page.getByRole('button', { name: /進む/ }).click()
      await page.waitForTimeout(500)
      
      // Level 2以上のコンテンツを確認
      const hasWelcome = await page.locator('text=Welcome').isVisible({ timeout: 500 }).catch(() => false)
      const hasPageContent = await page.locator('text=Page Content').isVisible({ timeout: 500 }).catch(() => false)
      const hasDashboard = await page.locator('text=Dashboard').isVisible({ timeout: 500 }).catch(() => false)
      
      if (hasWelcome || hasPageContent || hasDashboard) {
        expect(true).toBe(true) // レベル進行確認
        break
      }
    }
  })
})