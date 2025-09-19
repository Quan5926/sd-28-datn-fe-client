<template>
  <div v-if="showDebug" class="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto z-50">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-sm font-bold">Debug Panel</h3>
      <button @click="showDebug = false" class="text-white hover:text-gray-300">×</button>
    </div>
    <div class="text-xs">
      <div class="mb-2">
        <strong>API Response:</strong>
        <pre class="bg-gray-800 p-2 rounded mt-1 text-xs overflow-auto">{{ JSON.stringify(debugData, null, 2) }}</pre>
      </div>
    </div>
  </div>
  
  <!-- Debug Toggle Button -->
  <button 
    v-if="!showDebug"
    @click="showDebug = true"
    class="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full z-50 hover:bg-red-700"
  >
    🐛
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const showDebug = ref(false)
const debugData = ref({})

watch(() => props.data, (newData) => {
  debugData.value = newData
}, { deep: true, immediate: true })
</script>
