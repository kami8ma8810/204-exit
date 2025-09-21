import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

export const useAnomalyDisplay = () => {
  const store = useGameStore()
  const styleElement = ref<HTMLStyleElement | null>(null)

  const generateAnomalyCSS = computed(() => {
    if (!store.hasAnomaly || !store.activeAnomalies.length) {
      return ''
    }

    const cssRules: string[] = []
    
    store.activeAnomalies.forEach(anomaly => {
      const typeId = anomaly.typeId
      
      // 各異変タイプに応じたCSSを生成
      switch (typeId) {
        case 'padding-difference':
          cssRules.push('.anomaly-target { padding: 21px !important; }')
          break
        case 'margin-difference':
          cssRules.push('.anomaly-target { margin: 16px !important; }')
          break
        case 'color-difference':
          cssRules.push('.anomaly-target { color: #FEFEFE !important; }')
          break
        case 'font-weight-difference':
          cssRules.push('.anomaly-target { font-weight: 500 !important; }')
          break
        case 'border-radius-difference':
          cssRules.push('.anomaly-target { border-radius: 5px !important; }')
          break
        case 'line-height-difference':
          cssRules.push('.anomaly-target { line-height: 1.55 !important; }')
          break
        case 'letter-spacing-difference':
          cssRules.push('.anomaly-target { letter-spacing: 0.01em !important; }')
          break
        case 'opacity-difference':
          cssRules.push('.anomaly-target { opacity: 0.99 !important; }')
          break
        case 'shadow-direction-difference':
          cssRules.push('.anomaly-target { box-shadow: -2px 2px 4px rgba(0,0,0,0.1) !important; }')
          break
        case 'transform-rotation-difference':
          cssRules.push('.anomaly-target { transform: rotate(0.5deg) !important; }')
          break
        case 'border-position-difference':
          cssRules.push('.anomaly-target { border-bottom: 1px solid #ccc !important; border-top: none !important; }')
          break
        case 'z-index-order-difference':
          cssRules.push('.anomaly-target { z-index: 2 !important; }')
          break
      }
    })

    return cssRules.join('\n')
  })

  const applyAnomalyStyles = () => {
    if (styleElement.value) {
      styleElement.value.textContent = generateAnomalyCSS.value
    }
  }

  const createStyleElement = () => {
    styleElement.value = document.createElement('style')
    styleElement.value.id = 'anomaly-styles'
    document.head.appendChild(styleElement.value)
  }

  const removeStyleElement = () => {
    if (styleElement.value && styleElement.value.parentNode) {
      styleElement.value.parentNode.removeChild(styleElement.value)
      styleElement.value = null
    }
  }

  const handleStructuralAnomalies = () => {
    store.activeAnomalies.forEach(anomaly => {
      const typeId = anomaly.typeId
      
      switch (typeId) {
        case 'element-order-swap':
          swapElements('.page-element-1', '.page-element-2')
          break
        case 'text-character-difference':
          replaceText('.page-title', 'Continue', 'Continua')
          break
        case 'icon-direction-flip':
          flipIcon('.page-icon')
          break
      }
    })
  }

  const swapElements = (selector1: string, selector2: string) => {
    const elem1 = document.querySelector(selector1) as HTMLElement
    const elem2 = document.querySelector(selector2) as HTMLElement
    
    if (elem1 && elem2 && elem1.parentNode) {
      const temp = document.createElement('div')
      elem1.parentNode.insertBefore(temp, elem1)
      elem2.parentNode?.insertBefore(elem1, elem2)
      temp.parentNode?.insertBefore(elem2, temp)
      temp.parentNode?.removeChild(temp)
    }
  }

  const replaceText = (selector: string, original: string, replacement: string) => {
    const elem = document.querySelector(selector)
    if (elem && elem.textContent?.includes(original)) {
      elem.textContent = elem.textContent.replace(original, replacement)
    }
  }

  const flipIcon = (selector: string) => {
    const elem = document.querySelector(selector) as HTMLElement
    if (elem) {
      elem.style.transform = 'rotate(180deg)'
    }
  }

  onMounted(() => {
    createStyleElement()
    applyAnomalyStyles()
    
    // 構造的異変を適用
    if (store.hasAnomaly) {
      setTimeout(() => {
        handleStructuralAnomalies()
      }, 100)
    }
  })

  onUnmounted(() => {
    removeStyleElement()
  })

  return {
    generateAnomalyCSS,
    applyAnomalyStyles,
    handleStructuralAnomalies
  }
}