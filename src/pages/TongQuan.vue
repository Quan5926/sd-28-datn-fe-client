<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tổng quan</h1>
            <p class="text-gray-600">Thống kê hoạt động và thông tin tài khoản của bạn</p>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {{ recentOrders.length }} đơn hàng gần đây
            </div>
            <button
              @click="refreshData"
              :disabled="loading"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg 
                :class="loading ? 'animate-spin' : ''"
                class="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Đang tải...' : 'Làm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <!-- Error Message -->
    <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-800 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="ml-4 text-gray-600">Đang tải dữ liệu...</p>
    </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
              <p class="text-lg font-semibold text-blue-600">{{ overviewStats.totalOrders || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Hoàn thành</p>
              <p class="text-lg font-semibold text-green-600">{{ overviewStats.completedOrders || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Đang xử lý</p>
              <p class="text-lg font-semibold text-yellow-600">{{ overviewStats.processingOrders || 0 }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Đã hủy</p>
              <p class="text-lg font-semibold text-red-600">{{ overviewStats.cancelledOrders || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Đơn hàng gần đây</h2>
          <router-link to="/account/purchase-history"
            class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors">
            Xem tất cả
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </router-link>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <!-- Empty State -->
          <div v-if="recentOrders.length === 0" class="p-12 text-center">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p class="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            <router-link to="/products"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Bắt đầu mua sắm
            </router-link>
          </div>

          <!-- Orders List -->
          <div v-else v-for="(order, index) in recentOrders" :key="order.id" :class="[
            index !== recentOrders.length - 1 ? 'border-b border-gray-100' : '',
            'transition-all duration-300',
            { 'bg-gray-50': expandedOrder === order.id }
          ]">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-start space-x-4">
                  <!-- Order Header -->
                  <div class="flex-shrink-0">
                    <div
                      class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ order.ma || order.id }}</h3>
                      <span :class="getStatusClass(order.status || order.trangThai)"
                        class="px-3 py-1 rounded-full text-xs font-medium">
                        {{ getStatusText(order.status || order.trangThai) }}
                      </span>
                    </div>

                    <div class="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                      <span>{{ order.orderDate || formatDate(order.ngayTao) }}</span>
                      <span>•</span>
                      <span>{{ order.tenKhachHang || order.customerName }}</span>
                      <span v-if="order.items && order.items.length">•</span>
                      <span v-if="order.items && order.items.length">{{ order.items.length }} sản phẩm</span>
                    </div>

                    <!-- Product Preview -->
                    <div v-if="order.items && order.items.length > 0" class="mb-3">
                      <div class="flex items-center space-x-3">
                        <div v-for="item in order.items.slice(0, 3)" :key="item.id"
                          class="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-2">
                          <img :src="item.anhSanPham || '/images/default-product.jpg'" :alt="item.tenSanPham"
                            class="w-8 h-8 object-cover rounded border border-gray-200"
                            @error="$event.target.src = '/images/default-product.jpg'">
                          <div class="min-w-0">
                            <p class="text-xs font-medium text-gray-900 truncate max-w-20">{{ item.tenSanPham }}</p>
                            <p class="text-xs text-gray-500">x{{ item.soLuong }}</p>
                          </div>
                        </div>
                        <div v-if="order.items.length > 3" class="text-xs text-gray-500">
                          +{{ order.items.length - 3 }} khác
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <p class="text-sm text-gray-500 truncate">📍 {{ order.diaChiKhachHang || order.address }}</p>
                      <p class="text-xl font-bold text-primary-600">{{ formatCurrency(order.tongTienSauGiam ||
                        order.total) }}</p>
                    </div>
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
                  <div :class="getProgressBarClass(order.status)" :style="{ width: getProgressWidth(order.status) }"
                    class="h-2 rounded-full transition-all duration-300"></div>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <button @click="toggleOrderDetails(order.id)"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                  <svg class="w-4 h-4 mr-2 transition-transform duration-200"
                    :class="{ 'rotate-180': expandedOrder === order.id }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  {{ expandedOrder === order.id ? 'Thu gọn' : 'Xem chi tiết' }}
                </button>
                <div class="flex space-x-2">
                  <button v-if="order.status === 'delivered'"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                      </path>
                    </svg>
                    Mua lại
                  </button>
                  <button v-else-if="order.status === 'shipped'"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Theo dõi
                  </button>
                  <button v-else
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                    Chờ xử lý
                  </button>
                </div>
              </div>

              <!-- Expanded Order Details -->
              <div v-if="expandedOrder === order.id" class="mt-6 pt-6 border-t border-gray-200 animate-fadeIn">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Customer Info -->
                  <div class="space-y-3">
                    <h4 class="font-semibold text-gray-900 text-sm">Thông tin khách hàng</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Tên khách hàng:</span>
                        <span class="font-medium">{{ order.tenKhachHang }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Số điện thoại:</span>
                        <span class="font-medium">{{ order.soDienThoaiKhachHang }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Địa chỉ:</span>
                        <span class="font-medium text-right">{{ order.diaChiKhachHang }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <div class="space-y-3">
                    <h4 class="font-semibold text-gray-900 text-sm">Tóm tắt đơn hàng</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Mã đơn hàng:</span>
                        <span class="font-medium">{{ order.ma }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Ngày đặt:</span>
                        <span class="font-medium">{{ formatDate(order.ngayTao) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Trạng thái:</span>
                        <span :class="getStatusClass(order.trangThai)"
                          class="px-2 py-1 rounded-full text-xs font-medium">
                          {{ getStatusText(order.trangThai) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Items -->
                <div v-if="order.items && order.items.length > 0" class="mt-6">
                  <h4 class="font-semibold text-gray-900 text-sm mb-3">Sản phẩm đã đặt</h4>
                  <div class="space-y-3">
                    <div v-for="item in order.items" :key="item.id"
                      class="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                      <img :src="item.anhSanPham || '/images/default-product.jpg'" :alt="item.tenSanPham"
                        class="w-12 h-12 object-cover rounded-lg"
                        @error="$event.target.src = '/images/default-product.jpg'">
                      <div class="flex-1 min-w-0">
                        <h5 class="font-medium text-gray-900 text-sm">{{ item.tenSanPham }}</h5>
                        <p class="text-xs text-gray-600">Mã: {{ item.maSanPham }}</p>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span v-if="item.mauSac"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                            {{ item.mauSac }}
                          </span>
                          <span v-if="item.kichCo"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            Size {{ item.kichCo }}
                          </span>
                          <span v-if="item.thuongHieu"
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800">
                            {{ item.thuongHieu }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right text-sm">
                        <p class="text-gray-600">SL: {{ item.soLuong }}</p>
                        <p class="font-medium">{{ formatCurrency(item.giaBan) }}</p>
                        <p class="font-bold text-primary-600">{{ formatCurrency(item.thanhTien) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="font-semibold text-gray-900">Tổng cộng:</span>
                    <span class="text-xl font-bold text-primary-600">{{ formatCurrency(order.tongTienSauGiam ||
                      order.tongTien) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link to="/account/profile"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
            <div class="bg-blue-100 rounded-full p-3 mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">Cập nhật thông tin</h3>
              <p class="text-sm text-gray-600">Chỉnh sửa thông tin cá nhân</p>
            </div>
          </router-link>

          <router-link to="/account/purchase-history"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
            <div class="bg-green-100 rounded-full p-3 mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                </path>
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">Xem đơn hàng</h3>
              <p class="text-sm text-gray-600">Theo dõi trạng thái đơn hàng</p>
            </div>
          </router-link>

          <router-link to="/account/feedback"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
            <div class="bg-yellow-100 rounded-full p-3 mr-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
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
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { customerAPI } from '@/api/customerAPI'
import authService from '@/services/authService.js'

const loading = ref(false)
const error = ref('')

// Overview statistics
const overviewStats = ref({
  totalOrders: 0,
  completedOrders: 0,
  processingOrders: 0,
  cancelledOrders: 0,
  totalSpent: 0,
  averageOrderValue: 0,
  customerName: '',
  customerCode: '',
  membershipLevel: 'Thành viên',
  loyaltyPoints: 0,
  lastOrderDate: null,
  lastOrderStatus: null,
  lastOrderAmount: 0
})

// Recent orders from order history
const recentOrders = ref([])

// Expanded order for inline details
const expandedOrder = ref(null)

// Load customer overview data
const loadCustomerOverview = async () => {
  try {
    loading.value = true
    error.value = ''

    // Check authentication
    if (!authService.isAuthenticated()) {
      error.value = 'Vui lòng đăng nhập để xem thông tin'
      return
    }

    const response = await customerAPI.getOverview()

    if (response.success && response.data) {
      const data = response.data
      overviewStats.value = {
        totalOrders: data.totalOrders || 0,
        completedOrders: data.completedOrders || 0,
        processingOrders: data.processingOrders || 0,
        cancelledOrders: data.cancelledOrders || 0,
        totalSpent: data.totalSpent || 0,
        averageOrderValue: data.averageOrderValue || 0,
        customerName: data.customerName || '',
        customerCode: data.customerCode || '',
        membershipLevel: data.membershipLevel || 'Thành viên',
        loyaltyPoints: data.loyaltyPoints || 0,
        lastOrderDate: data.lastOrderDate || null,
        lastOrderStatus: data.lastOrderStatus || null,
        lastOrderAmount: data.lastOrderAmount || 0
      }
    } else {
      // Use fallback data if API returns no data
      overviewStats.value = {
        totalOrders: 0,
        completedOrders: 0,
        processingOrders: 0,
        cancelledOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        customerName: 'Khách hàng',
        customerCode: 'N/A',
        membershipLevel: 'Thành viên',
        loyaltyPoints: 0,
        lastOrderDate: null,
        lastOrderStatus: null,
        lastOrderAmount: 0
      }
    }
  } catch (err) {
    error.value = 'Không thể tải thông tin tổng quan. Vui lòng thử lại sau.'
    console.error('Error loading overview:', err)

    // Use fallback data on error
    overviewStats.value = {
      totalOrders: 0,
      completedOrders: 0,
      processingOrders: 0,
      cancelledOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      customerName: 'Khách hàng',
      customerCode: 'N/A',
      membershipLevel: 'Thành viên',
      loyaltyPoints: 0,
      lastOrderDate: null,
      lastOrderStatus: null,
      lastOrderAmount: 0
    }
  } finally {
    loading.value = false
  }
}

// Load recent orders
const loadRecentOrders = async () => {
  try {
    // Check authentication
    if (!authService.isAuthenticated()) {
      console.log('User not authenticated')
      recentOrders.value = []
      return
    }

    const response = await customerAPI.getOrderHistory(0, 10) // Get more orders to filter

    if (response && response.success) {
      // Try multiple possible data structures
      let orders = []

      if (response.data?.data?.content) {
        orders = response.data.data.content
      } else if (response.data?.content) {
        orders = response.data.content
      } else if (Array.isArray(response.data)) {
        orders = response.data
      }

      // Filter out "Hóa đơn chờ" (status 0) and only show valid orders
      orders = orders.filter(order => order.trangThai !== 0)

      // Sort by creation date (newest first)
      orders = orders.sort((a, b) => {
        const dateA = new Date(a.ngayTao)
        const dateB = new Date(b.ngayTao)
        return dateB - dateA // Descending order (newest first)
      })

      // Take only first 3 orders after filtering and sorting
      orders = orders.slice(0, 3)

      if (Array.isArray(orders) && orders.length > 0) {
        recentOrders.value = orders.map(order => {
          return {
            id: order.id,
            ma: order.ma,
            tenKhachHang: order.tenKhachHang,
            soDienThoaiKhachHang: order.soDienThoaiKhachHang,
            diaChiKhachHang: order.diaChiKhachHang,
            tongTienSauGiam: order.tongTienSauGiam,
            tongTien: order.tongTien,
            ngayTao: order.ngayTao,
            trangThai: order.trangThai,
            items: order.items || [],
            // Legacy fields for compatibility
            productName: `Đơn hàng ${order.ma}`,
            total: order.tongTienSauGiam || order.tongTien || 0,
            date: order.ngayTao ? new Date(order.ngayTao).toLocaleDateString('vi-VN') : 'N/A',
            status: getOrderStatus(order.trangThai),
            customerName: order.tenKhachHang || 'N/A',
            phone: order.soDienThoaiKhachHang || 'N/A',
            address: order.diaChiKhachHang || 'N/A'
          }
        })
        console.log('TongQuan: Processed orders:', recentOrders.value)
      } else {
        console.log('TongQuan: No orders in response')
        recentOrders.value = []
      }
    } else {
      console.log('TongQuan: Invalid response structure:', response)
      recentOrders.value = []
    }
  } catch (err) {
    console.error('Error loading recent orders:', err)
    recentOrders.value = []
  }
}


// Convert backend status to frontend status
const getOrderStatus = (backendStatus) => {
  switch (backendStatus) {
    case 5: return 'delivered'
    case 4: return 'shipped'
    case 1:
    case 2:
    case 3: return 'processing'
    case 6: return 'cancelled'
    default: return 'processing'
  }
}

// Toggle order details expansion
const toggleOrderDetails = (orderId) => {
  if (expandedOrder.value === orderId) {
    expandedOrder.value = null
  } else {
    expandedOrder.value = orderId
  }
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([
    loadCustomerOverview(),
    loadRecentOrders()
  ])
}

// Initialize data
onMounted(() => {
  refreshData()
})

// Computed properties for better data handling
const hasData = computed(() => {
  return overviewStats.value.totalOrders > 0 || recentOrders.value.length > 0
})

const isAuthenticated = computed(() => {
  return authService.isAuthenticated()
})

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch (error) {
    return 'N/A'
  }
}

// Get status class for styling
const getStatusClass = (status) => {
  // Handle both numeric and string status
  const numericStatus = typeof status === 'number' ? status : parseInt(status)

  switch (numericStatus) {
    case 0: return 'bg-gray-100 text-gray-800' // Hóa đơn chờ
    case 1: return 'bg-yellow-100 text-yellow-800' // Chờ xác nhận
    case 2: return 'bg-blue-100 text-blue-800' // Chờ xử lý
    case 3: return 'bg-purple-100 text-purple-800' // Chờ vận chuyển
    case 4: return 'bg-indigo-100 text-indigo-800' // Đang vận chuyển
    case 5: return 'bg-green-100 text-green-800' // Đã hoàn thành
    case 6: return 'bg-red-100 text-red-800' // Đã hủy
    default:
      // Fallback for string status
      const classes = {
        'delivered': 'bg-green-100 text-green-800',
        'shipped': 'bg-blue-100 text-blue-800',
        'processing': 'bg-yellow-100 text-yellow-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
  }
}

// Get status text
const getStatusText = (status) => {
  // Handle both numeric and string status
  const numericStatus = typeof status === 'number' ? status : parseInt(status)

  switch (numericStatus) {
    case 0: return 'Hóa đơn chờ'
    case 1: return 'Chờ xác nhận'
    case 2: return 'Chờ xử lý'
    case 3: return 'Chờ vận chuyển'
    case 4: return 'Đang vận chuyển'
    case 5: return 'Đã hoàn thành'
    case 6: return 'Đã hủy'
    default:
      // Fallback for string status
      const texts = {
        'delivered': 'Đã giao',
        'shipped': 'Đang giao',
        'processing': 'Đang xử lý',
        'cancelled': 'Đã hủy'
      }
      return texts[status] || 'Không xác định'
  }
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
