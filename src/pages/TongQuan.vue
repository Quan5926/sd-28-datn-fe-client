<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Tổng quan</h1>
      <p class="text-gray-600">Thống kê hoạt động và thông tin tài khoản của bạn</p>
    </div>
    
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm">Tổng đơn hàng</p>
            <p class="text-2xl font-bold">24</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm">Đã giao thành công</p>
            <p class="text-2xl font-bold">18</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-yellow-100 text-sm">Đang xử lý</p>
            <p class="text-2xl font-bold">3</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Tổng chi tiêu</p>
            <p class="text-2xl font-bold">45.2M</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Orders -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Đơn hàng gần đây</h2>
        <router-link 
          to="/account/purchase-history" 
          class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors"
        >
          Xem tất cả
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
      
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div 
          v-for="(order, index) in recentOrders" 
          :key="order.id"
          :class="index !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <img 
                  :src="order.image" 
                  :alt="order.productName"
                  class="w-20 h-20 object-cover rounded-xl shadow-sm"
                >
                <div class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  x{{ order.quantity }}
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="font-semibold text-gray-900">{{ order.productName }}</h3>
                  <span 
                    :class="getStatusClass(order.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mb-1">Đơn hàng #{{ order.id }} • {{ order.date }}</p>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(order.total) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Order Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Tiến độ đơn hàng</span>
              <span>{{ getProgressText(order.status) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                :class="getProgressBarClass(order.status)"
                :style="{ width: getProgressWidth(order.status) }"
                class="h-2 rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Xem chi tiết
            </button>
            <div class="flex space-x-2">
              <button 
                v-if="order.status === 'delivered'"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Mua lại
              </button>
              <button 
                v-else-if="order.status === 'shipped'"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Theo dõi
              </button>
              <button 
                v-else
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Chờ xử lý
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div>
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link to="/account/profile" class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
          <div class="bg-blue-100 rounded-full p-3 mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">Cập nhật thông tin</h3>
            <p class="text-sm text-gray-600">Chỉnh sửa thông tin cá nhân</p>
          </div>
        </router-link>
        
        <router-link to="/account/purchase-history" class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
          <div class="bg-green-100 rounded-full p-3 mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">Xem đơn hàng</h3>
            <p class="text-sm text-gray-600">Theo dõi trạng thái đơn hàng</p>
          </div>
        </router-link>
        
        <router-link to="/account/feedback" class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
          <div class="bg-yellow-100 rounded-full p-3 mr-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">Góp ý phản hồi</h3>
            <p class="text-sm text-gray-600">Chia sẻ ý kiến của bạn</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample data for recent orders
const recentOrders = ref([
  {
    id: 'DH001234',
    productName: 'Nike Air Max 270',
    image: '/sneakers/sneakers-1-alt1.jpg',
    quantity: 1,
    total: 2500000,
    date: '15/09/2024',
    status: 'delivered'
  },
  {
    id: 'DH001235',
    productName: 'Adidas Ultraboost 22',
    image: '/sneakers/sneakers-2-alt1.jpg',
    quantity: 1,
    total: 3200000,
    date: '12/09/2024',
    status: 'shipped'
  },
  {
    id: 'DH001236',
    productName: 'Puma RS-X',
    image: '/sneakers/sneakers-3-alt1.jpg',
    quantity: 1,
    total: 1800000,
    date: '08/09/2024',
    status: 'processing'
  }
])

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Get status class for styling
const getStatusClass = (status) => {
  const classes = {
    'delivered': 'bg-green-100 text-green-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'processing': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Get status text
const getStatusText = (status) => {
  const texts = {
    'delivered': 'Đã giao',
    'shipped': 'Đang giao',
    'processing': 'Đang xử lý',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

// Get progress text
const getProgressText = (status) => {
  const texts = {
    'delivered': 'Hoàn thành',
    'shipped': 'Đang vận chuyển',
    'processing': 'Đang chuẩn bị',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

// Get progress bar class
const getProgressBarClass = (status) => {
  const classes = {
    'delivered': 'bg-green-500',
    'shipped': 'bg-blue-500',
    'processing': 'bg-yellow-500',
    'cancelled': 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
}

// Get progress width
const getProgressWidth = (status) => {
  const widths = {
    'delivered': '100%',
    'shipped': '75%',
    'processing': '25%',
    'cancelled': '0%'
  }
  return widths[status] || '0%'
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
