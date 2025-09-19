<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <!-- Breadcrumb Navigation -->
    <div class="container mx-auto px-6 py-4 max-w-7xl">
      <nav class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl px-6 py-4 mb-6">
        <div class="flex items-center gap-3 text-lg">
          <router-link to="/" class="text-gray-500 hover:text-accent transition-colors duration-200">
            <i class="fas fa-home mr-2"></i>Trang chủ
          </router-link>
          <i class="fas fa-chevron-right text-gray-400"></i>
          <router-link to="/cart" class="text-gray-500 hover:text-accent transition-colors duration-200">
            Giỏ hàng
          </router-link>
          <i class="fas fa-chevron-right text-gray-400"></i>
          <span class="text-accent font-medium">Thanh toán</span>
        </div>
      </nav>
    </div>

    <div class="container mx-auto px-6 pb-6 max-w-7xl">
      <!-- Step Progress Indicator -->
      <StepIndicator 
        :current-step="currentStep" 
        :steps="steps" 
        class="mb-6"
      />

      <!-- Clean UI Toggle - Chỉ hiển thị khi cần debug -->
      <div v-if="showDebugControls" class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fas fa-cog text-gray-600 text-sm"></i>
            <span class="text-sm font-medium text-gray-700">Dev Controls:</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="toggleDataMode"
              class="px-3 py-1 text-xs rounded-md font-medium transition-colors"
              :class="useFakeData ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'"
            >
              {{ useFakeData ? 'Fake Data' : 'Real Data' }}
            </button>
            <button
              @click="toggleAuthMode"
              v-if="useFakeData"
              class="px-3 py-1 text-xs rounded-md font-medium transition-colors"
              :class="fakeDataState?.isAuthenticated ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
            >
              {{ fakeDataState?.isAuthenticated ? 'Logged In' : 'Guest' }}
            </button>
            <button
              @click="showDebugControls = false"
              class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Mock Data Loader (hidden) -->
      <MockDataLoader 
        v-if="useFakeData"
        @load-mock-data="handleFakeDataUpdate"
      />

      <!-- Hidden Debug Controls Trigger -->
      <div 
        v-if="!showDebugControls"
        @click="showDebugControls = true"
        class="fixed bottom-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity z-50"
        title="Show debug controls"
      >
        <i class="fas fa-cog text-gray-600 text-xs"></i>
      </div>

      <!-- Empty Cart Check -->
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-12 max-w-md mx-auto">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <i class="fas fa-shopping-cart text-4xl text-gray-400"></i>
          </div>
          <h3 class="text-2xl font-semibold text-gray-700 mb-4">Giỏ hàng trống</h3>
          <p class="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng. Vui lòng quay lại trang chủ để mua sắm nhé!</p>
          <div class="space-y-4">
            <button
              @click="router.push('/')"
              class="w-full bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              <i class="fas fa-arrow-left mr-2"></i>Quay lại trang chủ
            </button>
            <button
              @click="router.push('/products')"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              <i class="fas fa-search mr-2"></i>Khám phá sản phẩm
            </button>
          </div>
        </div>
      </div>

      <!-- Main Checkout Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Step Content -->
        <div class="lg:col-span-2">
          <div class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-6 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10"></div>
            <div class="relative">
              <transition name="fade" mode="out-in">
                <!-- Step 1: Customer Information -->
                <CustomerInfoStep
                  v-if="currentStep === 1"
                  key="step1"
                  v-model:customer-info="customerInfo"
                  v-model:selected-address="selectedAddress"
                  :is-authenticated="isAuthenticated"
                  :fake-addresses="useFakeData && fakeDataState && fakeDataState.isAuthenticated ? fakeDataState.customer.authenticated.addresses : null"
                  @next-step="nextStep"
                  @prev-step="prevStep"
                  @update:customer-info="handleCustomerInfoUpdate"
                  @update:selected-address="handleAddressUpdate"
                />

                <!-- Step 2: Voucher/Discount -->
                <VoucherStep
                  v-else-if="currentStep === 2"
                  key="step2"
                  v-model:voucher-code="voucherCode"
                  v-model:discount-amount="discountAmount"
                  :total-price="totalPrice"
                  :fake-vouchers="useFakeData && fakeDataState ? fakeDataState.vouchers : null"
                  @next-step="nextStep"
                  @prev-step="prevStep"
                />

                <!-- Step 3: Payment Method -->
                <PaymentStep
                  v-else-if="currentStep === 3"
                  key="step3"
                  v-model:payment-method="paymentMethod"
                  :customer-info="customerInfo"
                  :selected-address="selectedAddress"
                  :cart-items="cartItems"
                  :total-price="finalTotalPrice"
                  :discount-amount="discountAmount"
                  :voucher-code="voucherCode"
                  @prev-step="prevStep"
                  @complete-order="completeOrder"
                />
              </transition>
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-5 sticky top-8">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <i class="fas fa-receipt text-white text-sm"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Đơn hàng</h3>
            </div>

            <!-- Cart Items Summary -->
            <div class="space-y-2 mb-4 max-h-60 overflow-y-auto">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="relative">
                  <img
                    :src="getImageUrl(item)"
                    :alt="item.tenSanPham"
                    class="w-10 h-10 object-cover rounded-lg shadow-sm"
                    @error="handleImageError"
                  />
                  <div class="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {{ item.soLuong }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate text-sm">{{ item.tenSanPham }}</h4>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <span v-if="item.tenKichCo" class="px-1 py-0.5 bg-white rounded text-xs">{{ item.tenKichCo }}</span>
                    <span v-if="item.tenMauSac" class="px-1 py-0.5 bg-white rounded text-xs">{{ item.tenMauSac }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-accent text-sm">
                    {{ formatCurrency((item.giaBanHienTai || item.gia) * item.soLuong) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Totals -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700">Tạm tính:</span>
                  <span class="font-semibold text-gray-900">{{ formatCurrency(totalPrice) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700">Phí ship:</span>
                  <span class="font-semibold text-gray-900" :class="shippingFee === 0 ? 'text-green-600' : ''">
                    {{ shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee) }}
                  </span>
                </div>
                <div v-if="discountAmount > 0" class="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg text-sm">
                  <span class="font-medium flex items-center">
                    <i class="fas fa-tag mr-1 text-xs"></i>Giảm giá:
                  </span>
                  <span class="font-bold">-{{ formatCurrency(discountAmount) }}</span>
                </div>
                <div class="border-t border-dashed border-gray-300 pt-3">
                  <div class="flex justify-between items-center bg-accent/10 p-3 rounded-lg">
                    <span class="text-lg font-bold text-gray-900">Tổng:</span>
                    <span class="text-xl font-bold text-accent">{{ formatCurrency(finalTotalPrice) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trust Badges -->
            <div class="mt-4 bg-white rounded-xl p-3 border border-gray-200">
              <h4 class="font-medium text-gray-900 mb-2 text-center text-sm">Cam kết PhoStep</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-shield-alt text-green-600 text-xs"></i>
                  </div>
                  <span class="text-xs text-green-800 font-medium">Thanh toán bảo mật</span>
                </div>
                <div class="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-undo-alt text-blue-600 text-xs"></i>
                  </div>
                  <span class="text-xs text-blue-800 font-medium">Đổi trả 30 ngày</span>
                </div>
                <div class="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-award text-purple-600 text-xs"></i>
                  </div>
                  <span class="text-xs text-purple-800 font-medium">Bảo hành 12 tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div class="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Đang xử lý đơn hàng</h3>
        <p class="text-gray-600">Vui lòng không đóng trang này...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import StepIndicator from '../components/checkout/StepIndicator.vue'
import CustomerInfoStep from '../components/checkout/CustomerInfoStep.vue'
import VoucherStep from '../components/checkout/VoucherStep.vue'
import PaymentStep from '../components/checkout/PaymentStep.vue'
import CheckoutDebug from '../components/checkout/CheckoutDebug.vue'
import MockDataLoader from '../components/checkout/MockDataLoader.vue'
import { customerAPI } from '../api/customerAPI.js'
import { cartAPI } from '../api/cartAPI.js'
import { useFakeCheckoutData } from '../data/fakeCheckoutData.js'
import { useCheckout } from '@/composables/useCheckout'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const toast = useToast()

// Use real cart and checkout composables
const { cart: realCart, totalAmount, formatCurrency: realFormatCurrency, loadCart } = useCart()
const { 
  checkoutState, 
  loading, 
  error, 
  updateCustomerInfo, 
  updatePaymentMethod, 
  processCheckout,
  getCurrentInvoiceId 
} = useCheckout()

// Inject cart data from parent (App.vue) as fallback
const cartActions = inject('cartActions', {
  cart: ref([]),
  updateQuantity: () => {},
  removeFromCart: () => {},
  formatCurrency: (amount) => amount,
  totalPrice: ref(0),
  clearCart: () => {}
})

// Fake data mode toggle
const useFakeData = ref(false) // Set to false to use real cart data
const fakeDataState = ref(null)
const showDebugControls = ref(false) // Hide debug controls by default for clean UI

// Get fake data helper
const fakeDataHelper = useFakeCheckoutData()

// Cart data - use fake or real based on mode
const cart = computed(() => {
  return useFakeData.value && fakeDataState.value ? fakeDataState.value.cart : realCart.value
})

// Cart items for template iteration
const cartItems = computed(() => {
  if (useFakeData.value && fakeDataState.value) {
    // Fake data: cart is array
    return cart.value || []
  } else {
    // Real data: cart is object with items array
    return cart.value?.items || []
  }
})

const updateQuantity = cartActions.updateQuantity
const removeFromCart = cartActions.removeFromCart

// Step management - Always start at step 1 when navigating to /checkout
const currentStep = ref(1)
const steps = [
  { label: 'Thông tin khách hàng', description: 'Thông tin giao hàng', icon: 'fas fa-user' },
  { label: 'Mã giảm giá', description: 'Áp dụng voucher ưu đãi', icon: 'fas fa-tag' },
  { label: 'Thanh toán', description: 'Chọn phương thức thanh toán', icon: 'fas fa-credit-card' }
]

// Form data
const customerInfo = ref({
  ten: '',
  soDienThoai: '',
  email: '',
  ghiChu: ''
})

const selectedAddress = ref(null)
const voucherCode = ref('')
const discountAmount = ref(0)
const paymentMethod = ref('')
const isLoading = ref(false)

// Authentication check - use fake or real based on mode
const isAuthenticated = computed(() => {
  if (useFakeData.value && fakeDataState.value) {
    return fakeDataState.value.isAuthenticated
  } else {
    // Ensure we return boolean, not user object
    return Boolean(customerAPI.isAuthenticated())
  }
})

// Price calculations
const totalPrice = computed(() => {
  if (cartItems.value.length === 0) return 0
  
  return cartItems.value.reduce((sum, item) => {
    const price = item.giaBanHienTai || item.gia || 0
    return sum + (price * item.soLuong)
  }, 0)
})

const shippingFee = computed(() => {
  return totalPrice.value >= 1000000 ? 0 : 50000
})

const finalTotalPrice = computed(() => {
  return Math.max(0, totalPrice.value + shippingFee.value - discountAmount.value)
})

// Image handling functions
const getImageUrl = (item) => {
  const imageUrl = item.urlAnhSanPham || item.urlAnhDaiDien
  
  console.log('Getting image URL for item:', item.tenSanPham)
  console.log('urlAnhSanPham:', item.urlAnhSanPham)
  console.log('urlAnhDaiDien:', item.urlAnhDaiDien)
  console.log('Final imageUrl:', imageUrl)
  
  if (!imageUrl) {
    console.log('No image URL found, using placeholder')
    return '/placeholder-product.svg'
  }
  
  // If URL is already complete (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    console.log('Complete URL found:', imageUrl)
    return imageUrl
  }
  
  // If URL starts with /, it's relative to domain
  if (imageUrl.startsWith('/')) {
    const fullUrl = `http://localhost:8080${imageUrl}`
    console.log('Relative URL found, full URL:', fullUrl)
    return fullUrl
  }
  
  // Otherwise, assume it's a filename and prepend the uploads path
  const fullUrl = `http://localhost:8080/uploads/${imageUrl}`
  console.log('Filename found, full URL:', fullUrl)
  return fullUrl
}

const handleImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
  event.target.src = '/placeholder-product.svg'
}

// Format currency - use fake or real based on mode
const formatCurrency = computed(() => {
  return useFakeData.value && fakeDataState.value ? 
    fakeDataState.value.formatCurrency : 
    realFormatCurrency
})

// Handle customer info updates
const handleCustomerInfoUpdate = (info) => {
  console.log('Customer info updated from Step 1:', info)
  customerInfo.value = { ...info }
  console.log('Updated customerInfo.value:', customerInfo.value)
}

const handleAddressUpdate = (address) => {
  console.log('Selected address updated from Step 1:', address)
  selectedAddress.value = address
}

// Step navigation
const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Complete order
const completeOrder = async (orderData) => {
  isLoading.value = true
  try {
    console.log('Completing order:', orderData)
    console.log('Customer info from orderData:', orderData.customerInfo)
    console.log('Selected address from orderData:', orderData.selectedAddress)
    
    // Use real checkout service for payment processing
    if (!useFakeData.value) {
      // Get customer info with fallbacks
      const customerName = orderData.selectedAddress?.tenKhachHang || orderData.selectedAddress?.ten || orderData.customerInfo?.ten || customerInfo.value.ten
      const customerPhone = orderData.selectedAddress?.soDienThoai || orderData.customerInfo?.soDienThoai || customerInfo.value.soDienThoai
      const customerEmail = orderData.customerInfo?.email || customerInfo.value.email || ''
      const customerAddress = orderData.selectedAddress ? 
        `${orderData.selectedAddress.diaChiCuThe}, ${orderData.selectedAddress.phuong}, ${orderData.selectedAddress.quan}, ${orderData.selectedAddress.thanhPho}` :
        (orderData.customerInfo?.diaChi || customerInfo.value.diaChi)
      
      console.log('Final customer data:', { customerName, customerPhone, customerEmail, customerAddress })
      
      // Validate required fields
      if (!customerName?.trim()) {
        toast.error('Vui lòng nhập tên khách hàng')
        return
      }
      if (!customerPhone?.trim()) {
        toast.error('Vui lòng nhập số điện thoại')
        return
      }
      if (!customerAddress?.trim()) {
        toast.error('Vui lòng nhập địa chỉ giao hàng')
        return
      }
      
      // Update checkout state with customer info
      const customerData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress
      }
      console.log('Calling updateCustomerInfo with:', customerData)
      updateCustomerInfo(customerData)
      console.log('Checkout state after update:', checkoutState)
      
      // Update payment method
      updatePaymentMethod(orderData.paymentMethod)
      
      console.log('Processing checkout with real API...')
      console.log('Customer info:', checkoutState.customerInfo)
      console.log('Payment method:', checkoutState.paymentMethod)
      
      // Process checkout
      const result = await processCheckout()
      
      console.log('Checkout result:', result)
      
      // Show success message
      toast.success('Đặt hàng thành công!')
      
      // Redirect to purchase history page
      router.push({
        path: '/account/purchase-history',
        query: {
          orderId: result.id || result.ma,
          paymentMethod: orderData.paymentMethod,
          status: 'success'
        }
      })
      
    }
    
    // Fallback to fake data processing if enabled
    if (useFakeData.value) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Đặt hàng thành công! (Demo mode)')
      
      // Clear cart and redirect to purchase history
      cartActions.clearCart()
      router.push('/account/purchase-history')
    }
    
  } catch (error) {
    console.error('Error completing order:', error)
    toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!')
  } finally {
    isLoading.value = false
  }
}

// Handle fake data updates
const handleFakeDataUpdate = (data) => {
  fakeDataState.value = data
  
  // Auto-populate customer info if authenticated in fake mode
  if (data.isAuthenticated && data.customer.authenticated) {
    const profile = data.customer.authenticated.profile
    customerInfo.value = {
      ten: profile.ten,
      soDienThoai: profile.soDienThoai,
      email: profile.email,
      ghiChu: ''
    }
    
    // Auto-select default address
    const defaultAddress = data.customer.authenticated.addresses.find(addr => addr.macDinh)
    if (defaultAddress) {
      selectedAddress.value = defaultAddress
    }
  } else {
    // Reset for guest mode
    customerInfo.value = {
      ten: '',
      soDienThoai: '',
      email: '',
      ghiChu: ''
    }
    selectedAddress.value = null
  }
}

// Toggle between fake and real data
const toggleDataMode = () => {
  useFakeData.value = !useFakeData.value
  if (!useFakeData.value) {
    fakeDataState.value = null
  }
}

// Toggle auth mode in fake data
const toggleAuthMode = () => {
  if (fakeDataState.value) {
    const newAuthState = !fakeDataState.value.isAuthenticated
    handleFakeDataUpdate({
      ...fakeDataState.value,
      isAuthenticated: newAuthState
    })
  }
}

// Reset to step 1 when component mounts (when navigating to /checkout)
onMounted(async () => {
  currentStep.value = 1
  
  // Load real cart data
  if (!useFakeData.value) {
    await loadCart()
    console.log('Real cart loaded:', realCart.value)
    
    // Check if we have a valid invoice ID
    const invoiceId = getCurrentInvoiceId()
    console.log('Current invoice ID:', invoiceId)
    
    if (!invoiceId && cartItems.value.length > 0) {
      toast.error('Không tìm thấy thông tin giỏ hàng. Vui lòng thêm sản phẩm lại.')
      router.push('/cart')
      return
    }
  }
  
  // Initialize with fake data if enabled
  if (useFakeData.value) {
    const initialFakeData = {
      cart: fakeDataHelper.fakeCartData,
      customer: fakeDataHelper.fakeCustomerData,
      isAuthenticated: fakeDataHelper.isAuthenticated(),
      vouchers: fakeDataHelper.fakeVoucherData,
      formatCurrency: fakeDataHelper.formatCurrency
    }
    handleFakeDataUpdate(initialFakeData)
  }
  
  if (cartItems.value.length === 0) {
    console.log('Cart is empty. User will see the empty cart message.')
  }
})

// Watch for route changes to reset to step 1
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath === '/checkout') {
      currentStep.value = 1
    }
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>