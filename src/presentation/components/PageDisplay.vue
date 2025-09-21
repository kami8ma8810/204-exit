<template>
  <div class="bg-white rounded-lg shadow-md p-8 mb-6 min-h-[400px]">
    <!-- ページコンテンツ（レベルによって変化） -->
    <div v-if="level === 1" class="h-full flex items-center justify-center">
      <!-- Level 1: ほぼ空のページ -->
      <div class="text-center">
        <p class="text-gray-300 text-sm page-title anomaly-target">No Content</p>
      </div>
    </div>
    
    <div v-else-if="level === 2" class="space-y-6">
      <!-- Level 2: 少し要素が現れる -->
      <h2 class="text-2xl font-bold text-gray-700 page-title anomaly-target">
        Welcome
      </h2>
      <div class="space-y-4">
        <div class="bg-gray-100 p-4 rounded page-element-1 anomaly-target">
          <p class="text-gray-600">Content Block 1</p>
        </div>
        <div class="bg-gray-100 p-4 rounded page-element-2 anomaly-target">
          <p class="text-gray-600">Content Block 2</p>
        </div>
      </div>
    </div>
    
    <div v-else-if="level === 3" class="space-y-6">
      <!-- Level 3: 基本的なレイアウト -->
      <header class="border-b pb-4">
        <h2 class="text-3xl font-bold text-gray-800 page-title anomaly-target">
          Page Content
        </h2>
      </header>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 p-6 rounded-lg page-element-1 anomaly-target">
          <h3 class="font-semibold mb-2">Section A</h3>
          <p class="text-sm text-gray-600">Lorem ipsum dolor sit amet</p>
        </div>
        <div class="bg-green-50 p-6 rounded-lg page-element-2 anomaly-target">
          <h3 class="font-semibold mb-2">Section B</h3>
          <p class="text-sm text-gray-600">Consectetur adipiscing elit</p>
        </div>
      </div>
      <button class="px-6 py-2 bg-gray-200 rounded-lg page-button anomaly-target">
        Continue
      </button>
    </div>
    
    <div v-else-if="level === 4" class="space-y-6">
      <!-- Level 4: ほぼ完成形 -->
      <header class="flex items-center justify-between border-b pb-4">
        <h2 class="text-3xl font-bold text-gray-800 page-title anomaly-target">
          Dashboard
        </h2>
        <span class="text-sm text-gray-500 page-icon anomaly-target">⚙️</span>
      </header>
      
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white border p-4 rounded-lg shadow-sm page-element-1 anomaly-target">
          <div class="text-2xl font-bold text-blue-500">123</div>
          <div class="text-sm text-gray-600">Active Users</div>
        </div>
        <div class="bg-white border p-4 rounded-lg shadow-sm page-element-2 anomaly-target">
          <div class="text-2xl font-bold text-green-500">456</div>
          <div class="text-sm text-gray-600">Total Views</div>
        </div>
        <div class="bg-white border p-4 rounded-lg shadow-sm page-element-3 anomaly-target">
          <div class="text-2xl font-bold text-purple-500">789</div>
          <div class="text-sm text-gray-600">Downloads</div>
        </div>
      </div>
      
      <div class="bg-gray-50 p-6 rounded-lg anomaly-target">
        <h3 class="font-semibold mb-3">Recent Activity</h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between py-2 border-b">
            <span class="text-sm">User logged in</span>
            <span class="text-xs text-gray-500">2 min ago</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b">
            <span class="text-sm">File uploaded</span>
            <span class="text-xs text-gray-500">5 min ago</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Level 5: 完全に正常なページ -->
      <header class="flex items-center justify-between border-b pb-4">
        <h1 class="text-4xl font-bold text-gray-900 page-title anomaly-target">
          Complete Page
        </h1>
        <nav class="flex gap-4">
          <a href="#" class="text-blue-500 hover:underline">Home</a>
          <a href="#" class="text-blue-500 hover:underline">About</a>
          <a href="#" class="text-blue-500 hover:underline">Contact</a>
        </nav>
      </header>
      
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold">Main Content</h2>
          <p class="text-gray-600 leading-relaxed anomaly-target">
            This is a fully formed page with all elements in their proper place.
            Everything is exactly as it should be, with no anomalies or irregularities.
          </p>
          <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors page-button anomaly-target">
            Continue
          </button>
        </div>
        <div class="bg-gray-100 rounded-lg p-6 anomaly-target">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='20'%3EImage Placeholder%3C/text%3E%3C/svg%3E"
            alt="Placeholder"
            class="w-full rounded"
          />
        </div>
      </div>
      
      <footer class="border-t pt-4 text-center text-sm text-gray-500">
        © 2024 204番出口 - All rights reserved
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAnomalyDisplay } from '../composables/useAnomalyDisplay'

const props = defineProps<{
  statusCode: number
  level: number
  hasAnomaly: boolean
}>()

const { applyAnomalyStyles, handleStructuralAnomalies } = useAnomalyDisplay()

onMounted(() => {
  if (props.hasAnomaly) {
    applyAnomalyStyles()
    setTimeout(() => {
      handleStructuralAnomalies()
    }, 100)
  }
})

watch(() => props.hasAnomaly, (newVal) => {
  if (newVal) {
    applyAnomalyStyles()
    setTimeout(() => {
      handleStructuralAnomalies()
    }, 100)
  }
})
</script>