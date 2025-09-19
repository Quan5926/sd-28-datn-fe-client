<template>
  <!-- This component doesn't render anything, just loads mock data -->
</template>

<script setup>
import { onMounted } from 'vue'
import { useFakeCheckoutData } from '../../data/fakeCheckoutData.js'

const emit = defineEmits(['load-mock-data'])

const {
  fakeCartData,
  fakeCustomerData,
  fakeVoucherData,
  formatCurrency,
  isAuthenticated
} = useFakeCheckoutData()

// Load mock data on mount
onMounted(() => {
  const mockData = {
    cart: fakeCartData,
    customer: fakeCustomerData,
    isAuthenticated: isAuthenticated(),
    vouchers: fakeVoucherData,
    formatCurrency: formatCurrency
  }
  
  emit('load-mock-data', mockData)
})
</script>
