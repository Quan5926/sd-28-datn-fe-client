<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
    <div class="container mx-auto px-6 py-12 max-w-4xl">
      <!-- Success Header -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <i class="fas fa-check text-4xl text-white"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
        <p class="text-xl text-gray-600">Cảm ơn bạn đã tin tưởng và mua sắm tại PhoStep</p>
      </div>

      <!-- Order Information -->
      <div class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 mb-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <i class="fas fa-receipt text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Thông tin đơn hàng</h2>
            <p class="text-gray-600">Chi tiết đơn hàng của bạn</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>

        <!-- Order Details -->
        <div v-else-if="orderDetails" class="space-y-6">
          <!-- Order Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Mã đơn hàng:</span>
                  <span class="font-medium text-accent">{{ orderDetails.maHoaDon }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ngày đặt:</span>
                  <span class="font-medium">{{ formatDate(orderDetails.ngayTao) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Trạng thái:</span>
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {{ getStatusText(orderDetails.trangThai) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Phương thức thanh toán:</span>
                  <span class="font-medium">{{ getPaymentMethodText(orderDetails.phuongThucThanhToan) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="font-semibold text-gray-900 mb-4">Thông tin giao hàng</h3>
              <div class="space-y-2">
                <p class="font-medium text-gray-900">{{ orderDetails.tenKhachHang }}</p>
                <p class="text-gray-600">{{ orderDetails.soDienThoaiKhachHang }}</p>
                <p class="text-gray-600">{{ orderDetails.diaChiGiaoHang }}</p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h3>
            <div class="space-y-4">
              <div
                v-for="item in orderDetails.chiTietHoaDon"
                :key="item.id"
                class="flex items-center gap-4 p-4 bg-white rounded-lg"
              >
                <img
                  :src="item.hinhAnh || '/placeholder-product.png'"
                  :alt="item.tenSanPham"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ item.tenSanPham }}</h4>
                  <div class="text-sm text-gray-500 mt-1">
                    <span v-if="item.tenKichCo">{{ item.tenKichCo }}</span>
                    <span v-if="item.tenKichCo && item.tenMauSac"> • </span>
                    <span v-if="item.tenMauSac">{{ item.tenMauSac }}</span>
                  </div>
                  <div class="text-sm text-gray-600 mt-1">Số lượng: {{ item.soLuong }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900">
                    {{ formatCurrency(item.giaBan * item.soLuong) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatCurrency(item.giaBan) }} x {{ item.soLuong }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="bg-accent/10 rounded-xl p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Tổng kết đơn hàng</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính:</span>
                <span class="font-medium">{{ formatCurrency(orderDetails.tongTienTruocGiam || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <span class="font-medium">{{ formatCurrency(orderDetails.phiVanChuyen || 0) }}</span>
              </div>
              <div v-if="orderDetails.giaTriGiam > 0" class="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span class="font-medium">-{{ formatCurrency(orderDetails.giaTriGiam) }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between items-center">
                <span class="text-lg font-bold text-gray-900">Tổng cộng:</span>
                <span class="text-2xl font-bold text-accent">{{ formatCurrency(orderDetails.tongTienSauGiam) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Không thể tải thông tin đơn hàng</h3>
          <p class="text-gray-600 mb-4">Có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng thử lại.</p>
          <button
            @click="loadOrderDetails"
            class="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
          >
            <i class="fas fa-redo mr-2"></i>Thử lại
          </button>
        </div>
      </div>

      <!-- Payment Status (for VNPay) -->
      <div v-if="paymentStatus" class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center"
               :class="paymentStatus === 'success' ? 'bg-green-500' : 'bg-red-500'">
            <i class="text-white text-xl"
               :class="paymentStatus === 'success' ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Trạng thái thanh toán</h3>
            <p class="text-gray-600">
              {{ paymentStatus === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại' }}
            </p>
          </div>
        </div>
        
        <div v-if="paymentStatus === 'success'" class="p-4 bg-green-50 rounded-lg">
          <p class="text-green-800">
            <i class="fas fa-check-circle mr-2"></i>
            Thanh toán qua VNPay đã được xử lý thành công. Đơn hàng của bạn sẽ được xử lý và giao trong thời gian sớm nhất.
          </p>
        </div>
        
        <div v-else class="p-4 bg-red-50 rounded-lg">
          <p class="text-red-800 mb-2">
            <i class="fas fa-exclamation-circle mr-2"></i>
            Thanh toán qua VNPay không thành công. Đơn hàng của bạn vẫn được giữ với trạng thái chờ thanh toán.
          </p>
          <p class="text-red-600 text-sm">
            Bạn có thể liên hệ với chúng tôi để được hỗ trợ hoặc thử thanh toán lại.
          </p>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 mb-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Bước tiếp theo</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-blue-50 rounded-xl">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-envelope text-white"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Kiểm tra email</h4>
            <p class="text-sm text-gray-600">Chúng tôi đã gửi xác nhận đơn hàng đến email của bạn</p>
          </div>
          
          <div class="text-center p-6 bg-yellow-50 rounded-xl">
            <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-truck text-white"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Theo dõi đơn hàng</h4>
            <p class="text-sm text-gray-600">Bạn có thể theo dõi trạng thái giao hàng trong tài khoản</p>
          </div>
          
          <div class="text-center p-6 bg-green-50 rounded-xl">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-headset text-white"></i>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Hỗ trợ khách hàng</h4>
            <p class="text-sm text-gray-600">Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <!-- Show different buttons based on authentication status -->
        <router-link
          v-if="isAuthenticated"
          to="/account/purchase-history"
          class="px-8 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-medium transition-colors text-center"
        >
          <i class="fas fa-history mr-2"></i>Xem lịch sử đơn hàng
        </router-link>
        
        <router-link
          to="/products"
          class="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-center"
        >
          <i class="fas fa-shopping-bag mr-2"></i>Tiếp tục mua sắm
        </router-link>
        
        <router-link
          to="/"
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center"
        >
          <i class="fas fa-home mr-2"></i>Về trang chủ
        </router-link>
        
        <!-- Guest user option to create account -->
        <router-link
          v-if="!isAuthenticated"
          to="/auth"
          class="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-center"
        >
          <i class="fas fa-user-plus mr-2"></i>Tạo tài khoản để theo dõi đơn hàng
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { cartAPI } from '../api/cartAPI.js'
import { customerAPI } from '../api/customerAPI.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Props from route query
const orderId = route.query.orderId
const paymentMethod = route.query.paymentMethod
const paymentStatus = route.query.status

// Reactive data
const loading = ref(true)
const orderDetails = ref(null)

// Authentication check
const isAuthenticated = computed(() => {
  return customerAPI.isAuthenticated()
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status) => {
  const statusMap = {
    0: 'Hóa đơn chờ',
    1: 'Chờ xác nhận',
    2: 'Chờ xử lý',
    3: 'Chờ vận chuyển',
    4: 'Đang vận chuyển',
    5: 'Đã hoàn thành',
    6: 'Đã hủy'
  }
  return statusMap[status] || 'Không xác định'
}

const getPaymentMethodText = (method) => {
  const methodMap = {
    'COD': 'Thanh toán khi nhận hàng',
    'VNPAY': 'Thanh toán qua VNPay',
    'MOMO': 'Thanh toán qua MoMo'
  }
  return methodMap[method] || method
}

const loadOrderDetails = async () => {
  if (!orderId) {
    toast.error('Không tìm thấy mã đơn hàng')
    loading.value = false
    return
  }

  loading.value = true
  try {
    const response = await cartAPI.getOrderDetails(orderId)
    orderDetails.value = response.data
  } catch (error) {
    console.error('Error loading order details:', error)
    toast.error('Không thể tải thông tin đơn hàng')
  } finally {
    loading.value = false
  }
}

// Load order details on mount
onMounted(() => {
  loadOrderDetails()
  
  // Show payment status message
  if (paymentStatus === 'success') {
    toast.success('Thanh toán thành công!')
  } else if (paymentStatus === 'failed') {
    toast.error('Thanh toán thất bại!')
  }
  
  // Auto redirect guest users to home page after 3 seconds
  if (!isAuthenticated.value) {
    setTimeout(() => {
      toast.info('Chuyển về trang chủ...')
      router.push('/')
    }, 3000) // Give time to see order details
  }
})
</script>
