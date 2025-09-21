<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <h2 class="text-3xl font-mono font-bold">
          {{ statusCodeLabel }}
        </h2>
        <span class="text-sm text-gray-500 font-mono">
          Level {{ level }}/5
        </span>
      </div>
    </div>
    
    <!-- プログレスバー -->
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div 
        :class="progressBarClass"
        class="h-full transition-all duration-500 ease-out"
        :style="{ width: `${progress * 100}%` }"
      />
    </div>
    
    <div class="flex justify-between mt-2 text-xs text-gray-600 font-mono">
      <span>204 No Content</span>
      <span>200 OK</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  statusCode: number
  level: number
  progress: number
}>()

const statusCodeLabel = computed(() => {
  const labels: Record<number, string> = {
    200: '200 OK',
    201: '201 Created',
    202: '202 Accepted',
    203: '203 Non-Authoritative',
    204: '204 No Content',
    404: '404 Not Found'
  }
  return labels[props.statusCode] || `${props.statusCode}`
})

const progressBarClass = computed(() => {
  if (props.statusCode === 404) return 'bg-red-500'
  if (props.statusCode === 200) return 'bg-green-500'
  return 'bg-blue-500'
})
</script>