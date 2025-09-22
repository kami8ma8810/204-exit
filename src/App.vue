<template>
  <div class="website-container">
    <header class="main-header">
      <div class="header-top">
        <div class="header-content">
          <div class="logo">
            <span class="logo-text">テックコープ</span>
            <span class="logo-sub">ソリューションズ</span>
          </div>
          <nav class="main-nav">
            <a href="#" class="nav-link">製品</a>
            <a href="#" class="nav-link">サービス</a>
            <a href="#" class="nav-link">リソース</a>
            <a href="#" class="nav-link">企業情報</a>
            <a href="#" class="nav-link">サポート</a>
            <button class="contact-btn">お問い合わせ</button>
          </nav>
        </div>
      </div>
      <div class="breadcrumb-bar">
        <nav class="breadcrumb" ref="breadcrumbNav">
          <span v-for="(item, index) in levelBreadcrumbs" :key="`${index}-${item}`" class="breadcrumb-item">
            <span v-if="index > 0" class="separator">›</span>
            <span class="breadcrumb-text">
              {{ item }}
            </span>
          </span>
          <div class="level-indicator">
            <span class="level-badge">{{ currentLevel }}F / 8F</span>
          </div>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="content-wrapper">
        <section class="hero-section">
          <h1 class="hero-title" @click="handleElementClick('hero-title', $event)" :class="{ 'has-anomaly': anomalyTarget === 'hero-title' }">
            {{ anomalyTarget === 'hero-title' ? '次世代ビジネスのためのエンタブライズソリューション' : '次世代ビジネスのためのエンタープライズソリューション' }}
          </h1>
          <p class="hero-subtitle" @click="handleElementClick('hero-subtitle', $event)" :class="{ 'has-anomaly': anomalyTarget === 'hero-subtitle' }">
            {{ anomalyTarget === 'hero-subtitle' ? '最先端のクラウドインフラとエンタープライズソフトウェアで、組職を変革しましょう。' : '最先端のクラウドインフラとエンタープライズソフトウェアで、組織を変革しましょう。' }}
          </p>
          <div class="hero-buttons">
            <button class="primary-btn" @click="handleElementClick('btn-primary', $event)" :class="{ 'has-anomaly': anomalyTarget === 'btn-primary' }">
              {{ anomalyTarget === 'btn-primary' ? 'はじめる' : 'はじめる' }}
            </button>
            <button class="secondary-btn" @click="handleElementClick('btn-secondary', $event)" :class="{ 'has-anomaly': anomalyTarget === 'btn-secondary' }">
              {{ anomalyTarget === 'btn-secondary' ? 'デモを見る' : 'デモを見る' }}
            </button>
          </div>
        </section>

        <section class="features-grid">
          <div class="feature-card" @click="handleElementClick('card-1', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'card-1' }">
            <div class="feature-icon">{{ anomalyTarget === 'card-1' ? '🚂' : '🚀' }}</div>
            <h3>{{ anomalyTarget === 'card-1' ? '高牲能' : '高性能' }}</h3>
            <p>{{ anomalyTarget === 'card-1' ? '99.99%の稼働率保証による超高速処理' : '99.99%の稼働率保証による超高速処理' }}</p>
          </div>
          <div class="feature-card" @click="handleElementClick('card-2', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'card-2' }" :style="anomalyTarget === 'card-2' ? 'transform: rotate(1deg)' : ''">
            <div class="feature-icon">{{ anomalyTarget === 'card-2' ? '🔓' : '🔒' }}</div>
            <h3>{{ anomalyTarget === 'card-2' ? 'エンタープライズセキュリティ' : 'エンタープライズセキュリティ' }}</h3>
            <p>{{ anomalyTarget === 'card-2' ? '銀行レベルの暗号化と業界標準への準拠' : '銀行レベルの暗号化と業界標準への準拠' }}</p>
          </div>
          <div class="feature-card" @click="handleElementClick('card-3', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'card-3' }" :style="anomalyTarget === 'card-3' ? 'margin-top: 25px' : 'margin-top: 15px'">
            <div class="feature-icon">{{ anomalyTarget === 'card-3' ? '📊' : '📊' }}</div>
            <h3>{{ anomalyTarget === 'card-3' ? '高度な分析機能' : '高度な分析機能' }}</h3>
            <p>{{ anomalyTarget === 'card-3' ? 'リアルタイムインサイトと予測分析でより良い意思決定を' : 'リアルタイムインサイトと予測分析でより良い意思決定を' }}</p>
          </div>
          <div class="feature-card" @click="handleElementClick('card-4', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'card-4' }">
            <div class="feature-icon">{{ anomalyTarget === 'card-4' ? '🌏' : '🌍' }}</div>
            <h3>{{ anomalyTarget === 'card-4' ? 'グローバル展開' : 'グローバル展開' }}</h3>
            <p>{{ anomalyTarget === 'card-4' ? '50カ所以上のデータセンターで世界中に展開' : '50カ所以上のデータセンターで世界中に展開' }}</p>
          </div>
        </section>

        <section class="stats-section">
          <div class="stat-item" @click="handleElementClick('stat-1', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'stat-1' }">
            <div class="stat-number">{{ anomalyTarget === 'stat-1' ? '1000方+' : '1000万+' }}</div>
            <div class="stat-label">{{ anomalyTarget === 'stat-1' ? 'アクティブユーザー' : 'アクティブユーザー' }}</div>
          </div>
          <div class="stat-item" @click="handleElementClick('stat-2', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'stat-2' }">
            <div class="stat-number">{{ anomalyTarget === 'stat-2' ? '99.98%' : '99.99%' }}</div>
            <div class="stat-label">{{ anomalyTarget === 'stat-2' ? '稼働率SLA' : '稼働率SLA' }}</div>
          </div>
          <div class="stat-item" @click="handleElementClick('stat-3', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'stat-3' }">
            <div class="stat-number">{{ anomalyTarget === 'stat-3' ? '150+' : '150+' }}</div>
            <div class="stat-label">{{ anomalyTarget === 'stat-3' ? '対応国敷' : '対応国数' }}</div>
          </div>
          <div class="stat-item" @click="handleElementClick('stat-4', $event)" :class="{ 'clickable': true, 'has-anomaly': anomalyTarget === 'stat-4' }">
            <div class="stat-number">{{ anomalyTarget === 'stat-4' ? '24/7' : '24/7' }}</div>
            <div class="stat-label">{{ anomalyTarget === 'stat-4' ? 'サポート体勢' : 'サポート体制' }}</div>
          </div>
        </section>
      </div>
    </main>

    <footer class="main-footer">
      <div class="footer-content">
        <p>&copy; 2024 テックコープソリューションズ. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">プライバシーポリシー</a>
          <a href="#">利用規約</a>
          <a href="#">Cookie設定</a>
        </div>
      </div>
    </footer>

    <div v-if="gameWon" class="victory-modal">
      <div class="victory-content">
        <h2>🎉 8階到達！</h2>
        <p>全ての異変を見つけて脱出成功！</p>
        <p class="victory-path">お見事でした！</p>
        <button @click="resetGame" class="reset-btn">もう一度挑戦</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameLogic } from '@/composables/useGameLogic'

const { 
  currentLevel,
  gameWon,
  hasAnomaly,
  checkForExit,
  resetGame: resetGameLogic,
  consecutiveCorrect,
  generateNewAnomaly,
  anomalyType,
  anomalyIndex
} = useGameLogic()

const breadcrumbNav = ref<HTMLElement>()
const showClickHint = ref(false)
const anomalyTarget = ref<string>('')

// 階層ごとのパンくずリスト項目
const levelPaths = [
  'ホーム',
  '製品',
  'クラウドサービス', 
  'インフラストラクチャー',
  'コンピュートエンジン',
  '仮想マシン',
  'インスタンスタイプ',
  '構成設定',
  '詳細オプション'
]

// 階層に応じてパンくずリストを生成
const levelBreadcrumbs = computed(() => {
  const items = []
  for (let i = 0; i <= currentLevel.value && i < levelPaths.length; i++) {
    items.push(levelPaths[i])
  }
  return items
})


// 異変のターゲットをランダムに生成（必ず1つ生成）
const generateAnomalyTarget = () => {
  const targets = [
    'hero-title', 'hero-subtitle', 
    'card-1', 'card-2', 'card-3', 'card-4',
    'stat-1', 'stat-2', 'stat-3', 'stat-4'
  ]
  
  // 必ず1つの異変を生成
  anomalyTarget.value = targets[Math.floor(Math.random() * targets.length)]
}

// 要素をクリックした時の処理  
const handleElementClick = (elementId: string, event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const element = event.currentTarget as HTMLElement
  
  if (anomalyTarget.value === elementId) {
    // 異変をクリック = 正解！次の階層へ
    element.classList.add('correct-click')
    setTimeout(() => {
      element.classList.remove('correct-click')
      currentLevel.value++
      
      // 8階に到達 = クリア
      if (currentLevel.value >= 8) {
        gameWon.value = true
      } else {
        // 次の異変を生成
        generateAnomalyTarget()
      }
    }, 600)
    
  } else {
    // 間違った場所をクリック = 0階に戻る
    element.classList.add('wrong-click')
    document.body.classList.add('shake-screen')
    
    setTimeout(() => {
      element.classList.remove('wrong-click')
      document.body.classList.remove('shake-screen')
      currentLevel.value = 0
      generateAnomalyTarget()
    }, 600)
  }
}

const resetGame = () => {
  resetGameLogic()
  showClickHint.value = false
  anomalyTarget.value = ''
  currentLevel.value = 0
  generateAnomalyTarget()
}

onMounted(() => {
  generateAnomalyTarget()
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.website-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-top {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.logo-sub {
  font-size: 1.2rem;
  color: #764ba2;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #667eea;
}

.contact-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.contact-btn:hover {
  transform: translateY(-2px);
}

.breadcrumb-bar {
  background: linear-gradient(135deg, rgba(249, 250, 251, 0.98) 0%, rgba(237, 242, 247, 0.98) 100%);
  padding: 0.75rem 0;
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-image-slice: 1;
  position: relative;
  overflow: hidden;
}

.breadcrumb-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  position: relative;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: slideIn 0.3s ease-out backwards;
}

.breadcrumb-item:nth-child(1) { animation-delay: 0.05s; }
.breadcrumb-item:nth-child(2) { animation-delay: 0.1s; }
.breadcrumb-item:nth-child(3) { animation-delay: 0.15s; }
.breadcrumb-item:nth-child(4) { animation-delay: 0.2s; }
.breadcrumb-item:nth-child(5) { animation-delay: 0.25s; }

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.separator {
  color: #a0aec0;
  font-size: 1rem;
  font-weight: 300;
  margin: 0 0.25rem;
}

.breadcrumb-text {
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s;
  background: transparent;
}

.breadcrumb-text:hover {
  background: rgba(102, 126, 234, 0.05);
  color: #2d3748;
}

.breadcrumb-text.anomaly-text {
  position: relative;
  color: #e53e3e;
  font-weight: 600;
}

.breadcrumb-text.anomaly-text::before {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0.75rem;
  right: 0.75rem;
  height: 2px;
  background: #fc8181;
  opacity: 0.5;
  transform: scaleX(0);
  animation: underline 1s ease-out forwards;
}

@keyframes underline {
  to { transform: scaleX(1); }
}

.level-indicator {
  margin-left: auto;
  padding-left: 1rem;
}

.level-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.main-content {
  padding: 3rem 2rem;
  margin-top: 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  color: white;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.primary-btn {
  background: white;
  color: #667eea;
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.primary-btn:hover, .secondary-btn:hover {
  transform: translateY(-2px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
}

.stats-section {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  color: #718096;
  margin-top: 0.5rem;
}

.documentation-nav {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  margin-top: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.doc-nav-header {
  text-align: center;
  margin-bottom: 2rem;
}

.doc-nav-header h2 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.doc-nav-header p {
  color: #718096;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  text-align: left;
}

.nav-btn:hover:not(:disabled) {
  background: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn {
  justify-content: flex-start;
}

.next-btn {
  justify-content: flex-end;
  text-align: right;
}

.nav-arrow {
  font-size: 1.5rem;
  color: #667eea;
}

.nav-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-label {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  font-weight: 600;
}

.current-page {
  font-size: 1.25rem;
}

.page-separator {
  opacity: 0.7;
}

.total-pages {
  opacity: 0.9;
}

/* クリック可能な要素のスタイル */
.clickable {
  cursor: pointer;
  transition: all 0.2s;
}

.has-anomaly {
  position: relative;
}

/* 正解クリック時のアニメーション */
@keyframes correct-click {
  0% { transform: scale(1); }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(72, 187, 120, 0.6);
    border-color: #48bb78;
  }
  100% { transform: scale(1); }
}

.correct-click {
  animation: correct-click 0.5s;
  background: rgba(72, 187, 120, 0.1) !important;
}

/* 間違いクリック時のアニメーション */
@keyframes wrong-click {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.wrong-click {
  animation: wrong-click 0.5s;
  background: rgba(252, 129, 129, 0.2) !important;
}

/* 画面全体を揺らす */
@keyframes shake-screen {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-10px, -10px); }
  20% { transform: translate(10px, -10px); }
  30% { transform: translate(-10px, 10px); }
  40% { transform: translate(10px, 10px); }
  50% { transform: translate(-5px, -5px); }
  60% { transform: translate(5px, -5px); }
  70% { transform: translate(-5px, 5px); }
  80% { transform: translate(5px, 5px); }
  90% { transform: translate(0, 0); }
}

.shake-screen {
  animation: shake-screen 0.5s;
}

/* 進行状況セクション */
.progress-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.progress-container h3 {
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.progress-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.progress-bar-wrapper {
  flex: 1;
  max-width: 200px;
}

.progress-bar-bg {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
}

/* 異変があるカードを少しだけ目立たせる */
.feature-card.has-anomaly {
  animation: subtle-glow 2s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% { 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  50% { 
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
}

.stat-item.has-anomaly {
  animation: subtle-pulse 2s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.main-footer {
  background: #2d3748;
  color: white;
  padding: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: #a0aec0;
  text-decoration: none;
}

.footer-links a:hover {
  color: white;
}

.victory-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.victory-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
}

.victory-content h2 {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.victory-path {
  color: #718096;
  margin: 1rem 0;
}

.reset-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.reset-btn:hover {
  transform: translateY(-2px);
}
</style>