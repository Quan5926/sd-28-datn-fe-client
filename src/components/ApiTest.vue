<template>
  <div class="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg p-4 max-w-md z-50 shadow-lg">
    <h3 class="font-bold mb-2">API Test</h3>
    <button @click="testAPI" class="bg-blue-500 text-white px-3 py-1 rounded mb-2">Test API</button>
    <div v-if="result" class="text-xs">
      <pre class="bg-gray-100 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { customerAPI } from '@/api/customerAPI'

const result = ref(null)

const testAPI = async () => {
  try {
    console.log('Testing API...')
    const response = await customerAPI.getOrderHistory(0, 5)
    result.value = response
    console.log('API Test Result:', response)
  } catch (error) {
    result.value = { error: error.message }
    console.error('API Test Error:', error)
  }
}
</script>
