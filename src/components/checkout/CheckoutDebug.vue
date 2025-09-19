<template>
  <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
    <h3 class="font-bold text-yellow-800 mb-2">🔍 Checkout Debug Info</h3>
    <div class="text-sm text-yellow-700">
      <p><strong>Cart Items Count:</strong> {{ cart.length }}</p>
      <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
      <p><strong>Total Price:</strong> {{ formatCurrency(totalPrice) }}</p>
      
      <div v-if="cart.length > 0" class="mt-2">
        <p><strong>Sample Cart Item Fields:</strong></p>
        <pre class="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">{{ JSON.stringify(cart[0], null, 2) }}</pre>
      </div>
      
      <div class="mt-2">
        <p><strong>Customer Info:</strong></p>
        <pre class="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">{{ JSON.stringify(customerInfo, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { customerAPI } from '../../api/customerAPI.js'

const props = defineProps({
  cart: {
    type: Array,
    required: true
  },
  customerInfo: {
    type: Object,
    required: true
  },
  formatCurrency: {
    type: Function,
    required: true
  }
})

const isAuthenticated = computed(() => {
  return customerAPI.isAuthenticated()
})

const totalPrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.giaBanHienTai * item.soLuong), 0)
})
</script>
