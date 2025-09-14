<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary-700 mb-4 font-josefin-sans">Tra cứu đơn hàng</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Nhập mã đơn hàng để kiểm tra tình trạng và thông tin chi tiết đơn hàng của bạn
        </p>
      </div>

      <!-- Search Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <form @submit.prevent="searchOrder" class="space-y-6">
          <div>
            <label class="block text-lg font-semibold text-gray-900 mb-4">Mã đơn hàng *</label>
            <div class="relative">
              <input 
                v-model="orderCode"
                type="text" 
                required
                class="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pl-14"
                placeholder="Nhập mã đơn hàng (VD: #DH001234)"
              >
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              Mã đơn hàng được gửi qua email sau khi đặt hàng thành công
            </p>
          </div>

          <div class="flex justify-center">
            <button 
              type="submit"
              :disabled="isSearching || !orderCode.trim()"
              class="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div class="flex items-center">
                <svg v-if="isSearching" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {{ isSearching ? 'Đang tìm kiếm...' : 'Tra cứu đơn hàng' }}
              </div>
            </button>
          </div>
        </form>
      </div>

      <!-- Search Results -->
      <div v-if="searchResult" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div v-if="searchResult.found" class="space-y-8">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ searchResult.order.orderNumber }}</h2>
              <p class="text-gray-600">Đặt hàng ngày {{ searchResult.order.orderDate }}</p>
            </div>
            <div class="mt-4 sm:mt-0">
              <span 
                :class="getStatusClass(searchResult.order.status)"
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
              >
                <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(searchResult.order.status)"></div>
                {{ getStatusText(searchResult.order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Progress -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Tiến trình đơn hàng</h3>
            <div class="space-y-4">
              <div 
                v-for="(step, index) in searchResult.order.timeline" 
                :key="index"
                class="flex items-start"
              >
                <div class="flex-shrink-0 mr-4">
                  <div 
                    :class="step.completed ? 'bg-green-500' : 'bg-gray-300'"
                    class="w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    <svg v-if="step.completed" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 :class="step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'" class="text-sm">
                      {{ step.title }}
                    </h4>
                    <span v-if="step.date" class="text-xs text-gray-500">{{ step.date }}</span>
                  </div>
                  <p :class="step.completed ? 'text-gray-600' : 'text-gray-400'" class="text-xs mt-1">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Sản phẩm đã đặt</h3>
            <div class="space-y-4">
              <div 
                v-for="item in searchResult.order.items" 
                :key="item.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
              >
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">{{ item.details }}</p>
                  <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ formatCurrency(item.price) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Địa chỉ giao hàng</h4>
                <p class="text-gray-600 text-sm">{{ searchResult.order.shippingAddress }}</p>
                <p class="text-gray-600 text-sm">{{ searchResult.order.phoneNumber }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Thông tin vận chuyển</h4>
                <p class="text-gray-600 text-sm">Mã vận đơn: {{ searchResult.order.trackingNumber || 'Chưa có' }}</p>
                <p class="text-gray-600 text-sm">Tổng tiền: <span class="font-semibold text-gray-900">{{ formatCurrency(searchResult.order.total) }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Not Found State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
          <p class="text-gray-600 mb-6">Mã đơn hàng "{{ orderCode }}" không tồn tại hoặc đã bị xóa</p>
          <button 
            @click="resetSearch"
            class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-12 bg-blue-50 rounded-2xl p-8">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Cần hỗ trợ?</h3>
          <p class="text-gray-600 mb-6">
            Nếu bạn không tìm thấy mã đơn hàng hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:1900123456"
              class="flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Hotline: 1900 123 456
            </a>
            <a 
              href="mailto:support@phostep.com"
              class="flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Email hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderCode = ref('')
const isSearching = ref(false)
const searchResult = ref(null)

// Sample order data for demonstration
const sampleOrders = [
  {
    orderNumber: '#DH001234',
    orderDate: '12/09/2024',
    status: 'delivered',
    total: 2500000,
    shippingAddress: '123 Nguyễn Văn Linh, Phường Tân Thuận Đông, Quận 7, TP.HCM',
    phoneNumber: '0901234567',
    trackingNumber: 'VN123456789',
    items: [
      {
        id: 1,
        name: 'Nike Air Max 270',
        details: 'Size: 42 | Màu: Đen',
        quantity: 1,
        price: 2500000,
        image: '/sneakers/sneakers-1-alt1.jpg'
      }
    ],
    timeline: [
      { title: 'Đặt hàng thành công', description: 'Đơn hàng đã được tạo', date: '12/09/2024 10:30', completed: true },
      { title: 'Xác nhận đơn hàng', description: 'Đơn hàng đã được xác nhận', date: '12/09/2024 14:20', completed: true },
      { title: 'Đang chuẩn bị hàng', description: 'Sản phẩm đang được đóng gói', date: '13/09/2024 09:15', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao', date: '14/09/2024 08:00', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng đã được giao thành công', date: '15/09/2024 16:45', completed: true }
    ]
  },
  {
    orderNumber: '#DH001235',
    orderDate: '10/09/2024',
    status: 'shipping',
    total: 3200000,
    shippingAddress: '456 Lê Văn Việt, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM',
    phoneNumber: '0907654321',
    trackingNumber: 'VN987654321',
    items: [
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        details: 'Size: 41 | Màu: Trắng',
        quantity: 1,
        price: 3200000,
        image: '/sneakers/sneakers-2-alt1.jpg'
      }
    ],
    timeline: [
      { title: 'Đặt hàng thành công', description: 'Đơn hàng đã được tạo', date: '10/09/2024 15:20', completed: true },
      { title: 'Xác nhận đơn hàng', description: 'Đơn hàng đã được xác nhận', date: '10/09/2024 18:30', completed: true },
      { title: 'Đang chuẩn bị hàng', description: 'Sản phẩm đang được đóng gói', date: '11/09/2024 10:00', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao', date: '12/09/2024 07:30', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng sẽ được giao trong hôm nay', date: '', completed: false }
    ]
  }
]

const searchOrder = async () => {
  isSearching.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const normalizedCode = orderCode.value.trim().toUpperCase()
  const foundOrder = sampleOrders.find(order => 
    order.orderNumber.toUpperCase() === normalizedCode
  )
  
  searchResult.value = {
    found: !!foundOrder,
    order: foundOrder
  }
  
  isSearching.value = false
}

const resetSearch = () => {
  orderCode.value = ''
  searchResult.value = null
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-warning-100 text-warning-800',
    'processing': 'bg-primary-100 text-primary-800',
    'shipping': 'bg-primary-100 text-primary-800',
    'delivered': 'bg-success-100 text-success-800',
    'cancelled': 'bg-accent-100 text-accent-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    'pending': 'bg-warning-500',
    'processing': 'bg-primary-500',
    'shipping': 'bg-primary-500',
    'delivered': 'bg-success-500',
    'cancelled': 'bg-accent-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    'pending': 'Chờ xác nhận',
    'processing': 'Chờ xử lý', 
    'shipping': 'Đang vận chuyển',
    'delivered': 'Đã hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
