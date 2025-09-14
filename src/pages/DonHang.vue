<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-700 mb-4 font-josefin-sans border-b-4 border-primary-500 pb-2 inline-block">Đơn hàng</h1>
      <p class="text-gray-600">Theo dõi và quản lý đơn hàng của bạn</p>
    </div>
    
    <!-- Order Status Filter -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="status in orderStatuses" 
          :key="status.id"
          @click="filterByStatus(status.id)"
          :class="[
            'px-4 py-2 rounded-lg transition-colors font-medium',
            selectedStatus === status.id 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ status.name }}
        </button>
      </div>
    </div>
    
    <!-- Orders List -->
    <div class="space-y-4">
      <!-- Sample Order 1 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Đơn hàng #001234</h3>
            <p class="text-sm text-gray-600">Đặt ngày: 10/09/2024</p>
          </div>
          <div class="mt-2 md:mt-0">
            <span :class="getStatusClass(5)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getStatusText(5) }}
            </span>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <div class="flex items-center space-x-4 mb-3">
            <img src="/sneakers/sneakers-1-alt1.jpg" alt="Sản phẩm" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">Nike Air Max 270</h4>
              <p class="text-sm text-gray-600">Size: 42 | Màu: Đen</p>
              <p class="text-sm text-gray-600">Số lượng: 1</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">2.500.000 ₫</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-3 border-t">
            <p class="text-sm text-gray-600">Tổng cộng: <span class="font-semibold text-gray-800">2.500.000 ₫</span></p>
            <div class="space-x-2">
              <button class="bg-primary-500 text-white px-4 py-2 rounded text-sm hover:bg-primary-600 transition-colors">
                Xem chi tiết
              </button>
              <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300 transition-colors">
                Mua lại
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sample Order 2 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Đơn hàng #001235</h3>
            <p class="text-sm text-gray-600">Đặt ngày: 12/09/2024</p>
          </div>
          <div class="mt-2 md:mt-0">
            <span :class="getStatusClass(4)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ getStatusText(4) }}
            </span>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <div class="flex items-center space-x-4 mb-3">
            <img src="/sneakers/sneakers-2-alt1.jpg" alt="Sản phẩm" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">Adidas Ultraboost 22</h4>
              <p class="text-sm text-gray-600">Size: 41 | Màu: Trắng</p>
              <p class="text-sm text-gray-600">Số lượng: 1</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-800">3.200.000 ₫</p>
            </div>
          </div>
          
          <div class="flex justify-between items-center pt-3 border-t">
            <p class="text-sm text-gray-600">Tổng cộng: <span class="font-semibold text-gray-800">3.200.000 ₫</span></p>
            <div class="space-x-2">
              <button class="bg-primary-500 text-white px-4 py-2 rounded text-sm hover:bg-primary-600 transition-colors">
                Theo dõi đơn hàng
              </button>
              <button class="bg-accent-500 text-white px-4 py-2 rounded text-sm hover:bg-accent-600 transition-colors">
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div class="bg-white rounded-lg shadow-md p-12 text-center" style="display: none;">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-gray-600 mb-4">Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!</p>
        <router-link to="/" class="bg-primary-500 text-white px-6 py-3 rounded hover:bg-primary-600 transition-colors inline-block">
          Mua sắm ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Order status mapping synchronized with admin (0-6)
const orderStatuses = [
  { id: null, name: 'Tất cả' },
  { id: 0, name: 'Hóa đơn chờ' },
  { id: 1, name: 'Chờ xác nhận' },
  { id: 2, name: 'Chờ xử lý' },
  { id: 3, name: 'Chờ vận chuyển' },
  { id: 4, name: 'Đang vận chuyển' },
  { id: 5, name: 'Đã hoàn thành' },
  { id: 6, name: 'Đã hủy' }
]

const selectedStatus = ref(null)
const orders = ref([])

const filterByStatus = (statusId) => {
  selectedStatus.value = statusId
  // TODO: Implement API call to filter orders by status
}

const getStatusClass = (statusId) => {
  const statusClasses = {
    0: 'bg-gray-100 text-gray-800',      // Hóa đơn chờ
    1: 'bg-warning-100 text-warning-800', // Chờ xác nhận
    2: 'bg-primary-100 text-primary-800', // Chờ xử lý
    3: 'bg-secondary-100 text-secondary-800', // Chờ vận chuyển
    4: 'bg-primary-100 text-primary-800',  // Đang vận chuyển
    5: 'bg-success-100 text-success-800',  // Đã hoàn thành
    6: 'bg-accent-100 text-accent-800'     // Đã hủy
  }
  return statusClasses[statusId] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (statusId) => {
  const status = orderStatuses.find(s => s.id === statusId)
  return status ? status.name : 'Không xác định'
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
