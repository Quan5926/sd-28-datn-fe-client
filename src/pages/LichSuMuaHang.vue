<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-primary-700 mb-2 font-josefin-sans border-b-4 border-primary-500 pb-2 inline-block">Lịch sử mua hàng</h1>
      <p class="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
    </div>
    
    <!-- Filter Section -->
    <div class="bg-gray-50 rounded-xl p-6 mb-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="status in filterOptions" 
            :key="status.value"
            @click="activeFilter = status.value"
            :class="activeFilter === status.value ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200"
          >
            {{ status.label }}
            <span 
              v-if="getOrderCountByStatus(status.value) > 0"
              :class="activeFilter === status.value ? 'bg-primary-400 text-white' : 'bg-gray-200 text-gray-600'"
              class="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ getOrderCountByStatus(status.value) }}
            </span>
          </button>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select 
              v-model="sortBy"
              class="appearance-none bg-white px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date-desc">Mới nhất</option>
              <option value="date-asc">Cũ nhất</option>
              <option value="amount-desc">Giá cao nhất</option>
              <option value="amount-asc">Giá thấp nhất</option>
            </select>
            <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <div class="text-sm text-gray-500">
            {{ filteredOrders.length }} đơn hàng
          </div>
        </div>
      </div>
    </div>
    
    <!-- Orders List -->
    <div class="space-y-6">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center space-x-4">
              <div class="bg-primary-50 rounded-lg p-3">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Đơn hàng #{{ order.id }}</h3>
                <div class="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 0v4m-4 4h8m-4-8h4m-4 4h4"></path>
                    </svg>
                    {{ order.date }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                    {{ order.items.length }} sản phẩm
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <span 
                :class="getStatusClass(order.status)"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              >
                <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(order.status)"></span>
                {{ getStatusText(order.status) }}
              </span>
              <p class="text-xl font-bold text-gray-900 mt-2">{{ formatCurrency(order.total) }}</p>
            </div>
          </div>
          
          <!-- Order Items Preview -->
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="item in order.items.slice(0, 2)" 
                :key="item.id"
                class="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <div class="relative">
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  >
                  <div class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    x{{ item.quantity }}
                  </div>
                </div>
                <div class="flex-1">
                  <h5 class="font-semibold text-gray-900">{{ item.name }}</h5>
                  <p class="text-sm text-gray-500">{{ item.details }}</p>
                  <p class="text-lg font-bold text-primary-600">{{ formatCurrency(item.price) }}</p>
                </div>
              </div>
              <div 
                v-if="order.items.length > 2"
                class="flex items-center justify-center p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
              >
                <div class="text-center">
                  <p class="text-gray-600 font-medium">+{{ order.items.length - 2 }} sản phẩm khác</p>
                  <button 
                    @click="toggleOrderDetails(order.id)"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1"
                  >
                    Xem tất cả
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Progress -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
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
          
          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
            <button 
              @click="toggleOrderDetails(order.id)"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {{ expandedOrders.includes(order.id) ? 'Thu gọn chi tiết' : 'Xem chi tiết' }}
            </button>
            <div class="flex space-x-2">
              <button 
                v-if="order.status === 'delivered'"
                class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center"
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
        
        <!-- Expanded Order Details -->
        <div v-if="expandedOrders.includes(order.id)" class="border-t border-gray-200 bg-gray-50">
          <div class="p-6">
            <!-- All Items -->
            <div class="mb-6">
              <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                Tất cả sản phẩm ({{ order.items.length }})
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div class="relative">
                    <img 
                      :src="item.image" 
                      :alt="item.name" 
                      class="w-16 h-16 object-cover rounded-lg"
                    >
                    <div class="absolute -top-2 -right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      x{{ item.quantity }}
                    </div>
                  </div>
                  <div class="flex-1">
                    <h6 class="font-semibold text-gray-900">{{ item.name }}</h6>
                    <p class="text-sm text-gray-500">{{ item.details }}</p>
                    <p class="text-lg font-bold text-primary-600">{{ formatCurrency(item.price) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Timeline -->
            <div class="mb-6">
              <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Lịch sử đơn hàng
              </h5>
              <div class="space-y-4">
                <div 
                  v-for="(timeline, index) in order.timeline" 
                  :key="index"
                  class="flex items-start space-x-4"
                >
                  <div class="flex flex-col items-center">
                    <div 
                      :class="timeline.completed ? 'bg-green-500' : 'bg-gray-300'"
                      class="w-3 h-3 rounded-full"
                    ></div>
                    <div 
                      v-if="index !== order.timeline.length - 1"
                      :class="timeline.completed ? 'bg-green-500' : 'bg-gray-300'"
                      class="w-0.5 h-8 mt-2"
                    ></div>
                  </div>
                  <div class="flex-1 pb-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <h6 
                          :class="timeline.completed ? 'text-green-700' : 'text-gray-600'"
                          class="font-medium"
                        >
                          {{ timeline.title }}
                        </h6>
                        <p class="text-sm text-gray-500">{{ timeline.description }}</p>
                      </div>
                      <span class="text-sm text-gray-500">{{ timeline.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shipping Info -->
            <div v-if="order.shipping" class="bg-white rounded-lg p-4 border border-gray-200">
              <h5 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Thông tin giao hàng
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Địa chỉ giao hàng:</p>
                  <p class="font-medium text-gray-900">{{ order.shipping.address }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Phương thức vận chuyển:</p>
                  <p class="font-medium text-gray-900">{{ order.shipping.method }}</p>
                </div>
                <div v-if="order.shipping.trackingCode">
                  <p class="text-gray-600">Mã vận đơn:</p>
                  <p class="font-medium text-primary-600">{{ order.shipping.trackingCode }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Phí vận chuyển:</p>
                  <p class="font-medium text-gray-900">{{ formatCurrency(order.shipping.fee) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
      <p class="text-gray-600 mb-6">Bạn chưa có đơn hàng nào phù hợp với bộ lọc đã chọn.</p>
      <router-link 
        to="/products"
        class="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
      >
        Mua sắm ngay
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Filter and sort options
const activeFilter = ref('all')
const sortBy = ref('date-desc')
const expandedOrders = ref([])

// Updated filter options to match admin status mapping (0-6)
const filterOptions = ref([
  { value: 'all', label: 'Tất cả' },
  { value: 0, label: 'Hóa đơn chờ' },
  { value: 1, label: 'Chờ xác nhận' },
  { value: 2, label: 'Chờ xử lý' },
  { value: 3, label: 'Chờ vận chuyển' },
  { value: 4, label: 'Đang vận chuyển' },
  { value: 5, label: 'Đã hoàn thành' },
  { value: 6, label: 'Đã hủy' }
])

// Sample orders data
const orders = ref([
  {
    id: 'DH001234',
    date: '15/09/2024',
    status: 'delivered',
    total: 2500000,
    items: [
      {
        id: 1,
        name: 'Nike Air Max 270',
        details: 'Size: 42, Màu: Đen',
        image: '/sneakers/sneakers-1-alt1.jpg',
        quantity: 1,
        price: 2500000
      }
    ],
    timeline: [
      {
        title: 'Đơn hàng đã được tạo',
        description: 'Đơn hàng của bạn đã được xác nhận',
        time: '15/09/2024 09:00',
        completed: true
      },
      {
        title: 'Đang chuẩn bị hàng',
        description: 'Sản phẩm đang được đóng gói',
        time: '15/09/2024 14:30',
        completed: true
      },
      {
        title: 'Đã giao cho đơn vị vận chuyển',
        description: 'Đơn hàng đã được giao cho shipper',
        time: '16/09/2024 08:00',
        completed: true
      },
      {
        title: 'Đã giao thành công',
        description: 'Đơn hàng đã được giao đến địa chỉ',
        time: '17/09/2024 15:30',
        completed: true
      }
    ],
    shipping: {
      address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      method: 'Giao hàng nhanh',
      trackingCode: 'VN123456789',
      fee: 30000
    }
  },
  {
    id: 'DH001235',
    date: '12/09/2024',
    status: 'shipped',
    total: 3200000,
    items: [
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        details: 'Size: 41, Màu: Trắng',
        image: '/sneakers/sneakers-2-alt1.jpg',
        quantity: 1,
        price: 3200000
      }
    ],
    timeline: [
      {
        title: 'Đơn hàng đã được tạo',
        description: 'Đơn hàng của bạn đã được xác nhận',
        time: '12/09/2024 10:15',
        completed: true
      },
      {
        title: 'Đang chuẩn bị hàng',
        description: 'Sản phẩm đang được đóng gói',
        time: '12/09/2024 16:00',
        completed: true
      },
      {
        title: 'Đã giao cho đơn vị vận chuyển',
        description: 'Đơn hàng đang trên đường giao',
        time: '13/09/2024 09:30',
        completed: true
      },
      {
        title: 'Đang giao hàng',
        description: 'Shipper đang giao hàng đến địa chỉ',
        time: 'Dự kiến 14/09/2024',
        completed: false
      }
    ],
    shipping: {
      address: '456 Lê Văn Việt, Quận 9, TP.HCM',
      method: 'Giao hàng tiêu chuẩn',
      trackingCode: 'VN987654321',
      fee: 25000
    }
  },
  {
    id: 'DH001236',
    date: '08/09/2024',
    status: 'processing',
    total: 1800000,
    items: [
      {
        id: 3,
        name: 'Puma RS-X',
        details: 'Size: 43, Màu: Xanh',
        image: '/sneakers/sneakers-3-alt1.jpg',
        quantity: 1,
        price: 1800000
      }
    ],
    timeline: [
      {
        title: 'Đơn hàng đã được tạo',
        description: 'Đơn hàng của bạn đã được xác nhận',
        time: '08/09/2024 11:20',
        completed: true
      },
      {
        title: 'Đang xử lý',
        description: 'Đơn hàng đang được xử lý',
        time: 'Đang xử lý',
        completed: false
      }
    ],
    shipping: {
      address: '789 Võ Văn Tần, Quận 3, TP.HCM',
      method: 'Giao hàng nhanh',
      trackingCode: null,
      fee: 30000
    }
  }
])

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeFilter.value)
  }
  
  // Sort orders
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))
      case 'date-asc':
        return new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))
      case 'amount-desc':
        return b.total - a.total
      case 'amount-asc':
        return a.total - b.total
      default:
        return 0
    }
  })
  
  return filtered
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-gray-100 text-gray-800',        // Hóa đơn chờ
    1: 'bg-warning-100 text-warning-800',  // Chờ xác nhận
    2: 'bg-primary-100 text-primary-800',  // Chờ xử lý
    3: 'bg-secondary-100 text-secondary-800', // Chờ vận chuyển
    4: 'bg-primary-100 text-primary-800',  // Đang vận chuyển
    5: 'bg-success-100 text-success-800',  // Đã hoàn thành
    6: 'bg-accent-100 text-accent-800',    // Đã hủy
    // Legacy support for old string-based statuses
    'delivered': 'bg-success-100 text-success-800',
    'shipped': 'bg-primary-100 text-primary-800',
    'processing': 'bg-warning-100 text-warning-800',
    'cancelled': 'bg-accent-100 text-accent-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    0: 'bg-gray-500',        // Hóa đơn chờ
    1: 'bg-warning-500',     // Chờ xác nhận
    2: 'bg-primary-500',     // Chờ xử lý
    3: 'bg-secondary-500',   // Chờ vận chuyển
    4: 'bg-primary-500',     // Đang vận chuyển
    5: 'bg-success-500',     // Đã hoàn thành
    6: 'bg-accent-500',      // Đã hủy
    // Legacy support
    'delivered': 'bg-success-500',
    'shipped': 'bg-primary-500',
    'processing': 'bg-warning-500',
    'cancelled': 'bg-accent-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    0: 'Hóa đơn chờ',
    1: 'Chờ xác nhận',
    2: 'Chờ xử lý',
    3: 'Chờ vận chuyển',
    4: 'Đang vận chuyển',
    5: 'Đã hoàn thành',
    6: 'Đã hủy',
    // Legacy support
    'delivered': 'Đã hoàn thành',
    'shipped': 'Đang vận chuyển',
    'processing': 'Chờ xử lý',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const getProgressText = (status) => {
  const texts = {
    'delivered': 'Hoàn thành',
    'shipped': 'Đang vận chuyển',
    'processing': 'Đang chuẩn bị',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const getProgressBarClass = (status) => {
  const classes = {
    'delivered': 'bg-green-500',
    'shipped': 'bg-blue-500',
    'processing': 'bg-yellow-500',
    'cancelled': 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getProgressWidth = (status) => {
  const widths = {
    'delivered': '100%',
    'shipped': '75%',
    'processing': '25%',
    'cancelled': '0%'
  }
  return widths[status] || '0%'
}

const getOrderCountByStatus = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

const toggleOrderDetails = (orderId) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
