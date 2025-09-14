<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import CartItem from './CartItem.vue'
import InfoBlock from './InfoBlock.vue'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { gsap } from 'gsap'
import axios from 'axios'
import { useToast } from 'vue-toastification' // Thêm dòng này

// Inject necessary values and functions from App.vue
const {
  cart,
  totalPrice,
  formatCurrency,
  createOrder,
  isCreatingOrder,
  clearCart,
  updateQuantity,
  removeFromCart
} = inject('cartActions')
const router = useRouter()

const toast = useToast()
// Customer information
const customerInfo = ref({
  email: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  province: null,
  district: null,
  ward: null,
  note: ''
})

// Location data
const provinces = ref([])
const districts = ref([])
const wards = ref([])

// Validation errors
const errors = ref({})

// Payment method
const paymentMethod = ref('bankTransfer') // Default to bank transfer

// Shipping fee
const shippingFee = ref(30000) // Hardcoded for demo, consider dynamic fee in a real app

// VNPAY variables
const vnpayQrCodeUrl = ref('')
const showVnpayQr = ref(false)
const countdownTime = ref(600) // 10 minutes
let countdownInterval = null
const isVnpayPaymentProcessing = ref(false)

// =================== LOGIC MÃ GIẢM GIÁ ===================
const voucherCode = ref('')
const appliedVoucher = ref(null)
const discountAmount = ref(0)
const voucherError = ref('')
const isApplyingVoucher = ref(false)

// UI state
const isShowErrorModal = ref(false)
const errorMessage = ref('')

// Computed property for final total price
const finalTotalPrice = computed(() => {
  let total = totalPrice.value + shippingFee.value
  total -= discountAmount.value
  return total > 0 ? total : 0
})
const applyVoucher = async () => {
  // Reset trạng thái trước khi gọi API mới
  voucherError.value = ''
  appliedVoucher.value = null
  discountAmount.value = 0

  if (!voucherCode.value) {
    toast.error('Vui lòng nhập mã giảm giá.')
    return
  }

  isApplyingVoucher.value = true
  try {
    const totalOrderAmount = finalTotalPrice.value

    // Gọi API để validate mã giảm giá
    const response = await axios.get(
      `http://localhost:8080/api/ma-giam-gia/validate/${voucherCode.value}`,
      {
        params: {
          total: totalOrderAmount,
          // Giả sử idKhachHang được lấy từ state hoặc localStorage sau khi đăng nhập
          idKhachHang: 1033 // Thay thế bằng id khách hàng thực tế
        }
      }
    )

    // Xử lý khi mã hợp lệ
    appliedVoucher.value = response.data
    discountAmount.value = response.data.discountAmount
    voucherError.value = '' // Xóa lỗi nếu có
    toast.success(
      `🎉 Mã **${voucherCode.value}** đã được áp dụng thành công. Giảm: ${formatCurrency(discountAmount.value)}`
    )
  } catch (error) {
  // Gán thông báo lỗi mặc định
  let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';

  // Kiểm tra các mã lỗi cụ thể từ API
  if (error.response) {
    if (error.response.status === 400) {
      errorMessage = error.response.data.message || 'Mã giảm giá không hợp lệ.';
    } else if (error.response.status === 404) {
      errorMessage = 'Không tìm thấy mã giảm giá.';
    }
  }

  // Hiển thị toast lỗi với thông báo đã được xác định
  toast.error(errorMessage);
  
    // Đảm bảo các giá trị được reset khi có lỗi
    appliedVoucher.value = null
    discountAmount.value = 0
  } finally {
    isApplyingVoucher.value = false
  }
}
// Hàm mới để xóa mã giảm giá
const removeVoucher = () => {
  voucherCode.value = ''
  appliedVoucher.value = null
  discountAmount.value = 0
  voucherError.value = ''
}

// Real API calls for locations using axios
const fetchProvinces = async () => {
  try {
    const response = await axios.get('api/viettel-post/provinces')
    // Ánh xạ các trường dữ liệu theo cấu trúc của ViettelPost
    provinces.value = response.data.map((item) => ({
      PROVINCE_ID: item.PROVINCE_ID,
      PROVINCE_NAME: item.PROVINCE_NAME
    }))
  } catch (error) {
    console.error('Error fetching provinces:', error)
    showError('Không thể tải danh sách tỉnh/thành phố.')
  }
}

const fetchDistricts = async (provinceId) => {
  if (!provinceId) {
    districts.value = []
    return
  }
  try {
    const response = await axios.get(`api/viettel-post/districts/${provinceId}`)
    // Ánh xạ các trường dữ liệu theo cấu trúc của ViettelPost
    districts.value = response.data.map((item) => ({
      DISTRICT_ID: item.DISTRICT_ID,
      DISTRICT_NAME: capitalizeWords(item.DISTRICT_NAME)
    }))
  } catch (error) {
    console.error('Error fetching districts:', error)
    showError('Không thể tải danh sách quận/huyện.')
  }
}

const fetchWards = async (districtId) => {
  if (!districtId) {
    wards.value = []
    return
  }
  try {
    const response = await axios.get(`api/viettel-post/wards/${districtId}`)
    wards.value = response.data.map((item) => ({
      WARDS_ID: item.WARDS_ID,
      WARDS_NAME: capitalizeWords(item.WARDS_NAME)
    }))
  } catch (error) {
    console.error('Error fetching wards:', error)
    showError('Không thể tải danh sách phường/xã.')
  }
}

// Check if the cart is empty and fetch locations on component mount
onMounted(() => {
  if (cart.value.length === 0) {
    console.log('Cart is empty. User will see the empty cart message.')
  }
  fetchProvinces()
})

// Watch for changes in selected locations
watch(
  () => customerInfo.value.province,
  (newValue) => {
    customerInfo.value.district = null
    customerInfo.value.ward = null
    districts.value = []
    wards.value = []
    if (newValue) {
      fetchDistricts(newValue)
    }
  }
)

watch(
  () => customerInfo.value.district,
  (newValue) => {
    customerInfo.value.ward = null
    wards.value = []
    if (newValue) {
      fetchWards(newValue)
    }
  }
)

// Clear interval when the component is unmounted
onBeforeUnmount(() => {
  clearInterval(countdownInterval)
})

// Helper function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => {
      if (!word) return ''
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
// Helper function to validate customer information
const validateCustomerInfo = () => {
  errors.value = {} // Clear previous errors
  const info = customerInfo.value
  let isValid = true

  if (!info.fullName) {
    errors.value.fullName = 'Họ và tên không được để trống.'
    isValid = false
  }
  if (!info.phoneNumber) {
    errors.value.phoneNumber = 'Số điện thoại không được để trống.'
    isValid = false
  } else if (!/^\d{10,11}$/.test(info.phoneNumber)) {
    errors.value.phoneNumber = 'Số điện thoại không hợp lệ.'
    isValid = false
  }
  if (!info.address) {
    errors.value.address = 'Địa chỉ không được để trống.'
    isValid = false
  }
  if (!info.province) {
    errors.value.province = 'Tỉnh/Thành phố không được để trống.'
    isValid = false
  }
  if (!info.district) {
    errors.value.district = 'Quận/Huyện không được để trống.'
    isValid = false
  }
  if (!info.ward) {
    errors.value.ward = 'Phường/Xã không được để trống.'
    isValid = false
  }

  if (!isValid) {
    showError('Vui lòng điền đầy đủ và chính xác thông tin giao hàng bắt buộc.')
  }
  return isValid
}

// Function to generate a VNPAY QR Code (simulated with improved loading state)
const generateVnpayQr = async () => {
  if (!validateCustomerInfo()) {
    return
  }

  isVnpayPaymentProcessing.value = true
  clearInterval(countdownInterval)
  vnpayQrCodeUrl.value = ''
  countdownTime.value = 600

  try {
    // Simulate API call to backend to generate QR Code
    // This is where you would replace with a real fetch or axios call to your backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Assign a static QR code URL (for demonstration)
    vnpayQrCodeUrl.value = '/TPB-07229343901-compact.png'

    showVnpayQr.value = true
    startCountdown()
  } catch (error) {
    console.error('Error generating VNPAY QR:', error)
    showError('Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại.')
  } finally {
    isVnpayPaymentProcessing.value = false
  }
}

// Start countdown function
const startCountdown = () => {
  clearInterval(countdownInterval) // Ensure no duplicate intervals
  countdownInterval = setInterval(() => {
    if (countdownTime.value > 0) {
      countdownTime.value--
    } else {
      clearInterval(countdownInterval)
      vnpayQrCodeUrl.value = ''
      showVnpayQr.value = false
      showError('Mã QR đã hết hạn. Vui lòng tạo lại.')
    }
  }, 1000)
}

// Format countdown time
const formatCountdown = computed(() => {
  const minutes = Math.floor(countdownTime.value / 60)
  const seconds = countdownTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Helper function to show error modal
const showError = (message) => {
  errorMessage.value = message
  isShowErrorModal.value = true
}

// Main function to place the order
const placeOrder = async () => {
  if (!validateCustomerInfo()) {
    return
  }

  // Set the creating order state to true
  isCreatingOrder.value = true

  // Find the selected location names based on IDs
  const provinceName =
    provinces.value.find((p) => p.PROVINCE_ID === customerInfo.value.province)?.PROVINCE_NAME || ''
  const districtName =
    districts.value.find((d) => d.DISTRICT_ID === customerInfo.value.district)?.DISTRICT_NAME || ''
  const wardName = wards.value.find((w) => w.WARDS_ID === customerInfo.value.ward)?.WARDS_NAME || ''

  // Create the order object
  const orderData = {
    customerInfo: {
      ...customerInfo.value,
      provinceName,
      districtName,
      wardName
    },
    items: cart.value.map((item) => ({
      productId: item.id,
      title: item.tenSanPham,
      imageUrl: item.urlAnhDaiDien,
      price: item.giaBanHienTai,
      quantity: item.soLuong || 1,
      selectedSize: item.tenKichCo,
      selectedColor: item.tenMauSac
    })),
    totalPrice: totalPrice.value,
    shippingFee: shippingFee.value,
    finalTotalPrice: finalTotalPrice.value,
    paymentMethod: paymentMethod.value,
    orderDate: new Date().toISOString(),
    status: 'pending' // Initial status
  }

  let navigatePaymentStatus = ''

  if (paymentMethod.value === 'vnpayQr') {
    if (!vnpayQrCodeUrl.value || countdownTime.value === 0) {
      showError(
        'Mã QR VNPAY không hợp lệ hoặc đã hết hạn. Vui lòng tạo lại hoặc chọn phương thức khác.'
      )
      isCreatingOrder.value = false
      return
    }
    orderData.status = 'payment_pending_verification'
    navigatePaymentStatus = 'payment_pending_verification'
  } else if (paymentMethod.value === 'cod') {
    orderData.status = 'cod_success'
    navigatePaymentStatus = 'cod_success'
  } else if (paymentMethod.value === 'bankTransfer') {
    orderData.status = 'bank_transfer_success'
    navigatePaymentStatus = 'bank_transfer_success'
  }

  try {
    const createdOrder = await createOrder(orderData) // Call createOrder function from App.vue

    // Save orderData to sessionStorage for OrderSuccessPage
    sessionStorage.setItem('currentOrderDetails', JSON.stringify(orderData))

    // CLEAR THE CART AFTER SUCCESSFUL ORDER
    clearCart()

    // Navigate to the success page
    router.push({
      name: 'order-success',
      params: {
        orderId: createdOrder.id,
        paymentStatus: navigatePaymentStatus
      }
    })
  } catch (error) {
    console.error('Error placing order:', error)
    showError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.')
  } finally {
    isCreatingOrder.value = false
  }
}

// Watch for payment method changes to hide/show QR and stop countdown
watch(paymentMethod, (newValue) => {
  if (newValue !== 'vnpayQr') {
    showVnpayQr.value = false
    clearInterval(countdownInterval)
    vnpayQrCodeUrl.value = ''
    countdownTime.value = 600
  } else {
    if (!vnpayQrCodeUrl.value && !isVnpayPaymentProcessing.value) {
      generateVnpayQr()
    }
  }
})

// A new function to handle modal closing
const closeModal = () => {
  isShowErrorModal.value = false
}

// GSAP animations for the modal
const beforeEnter = (el) => {
  gsap.set(el, { scale: 0.8, opacity: 0 })
}

const enter = (el, done) => {
  gsap.to(el, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    onComplete: done
  })
}

const beforeLeave = (el) => {
  gsap.set(el, { scale: 1, opacity: 1 })
}

const leave = (el, done) => {
  gsap.to(el, {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    onComplete: done
  })
}
</script>

<template>
  <div
    class="checkout-page p-4 sm:p-8 bg-gray-100 min-h-screen font-sans antialiased text-gray-800"
  >
    <div
      class="max-w-7xl lg:max-w-screen-xl mx-auto rounded-xl overflow-hidden shadow-2xl checkout-container bg-white"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <!-- Cột 1: Thông tin giao hàng & Phương thức thanh toán -->
        <div class="p-6 sm:p-8 lg:p-12">
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 lg:mb-12 text-center font-josefin-sans tracking-tight"
          >
            Thanh Toán & Giao Hàng
          </h1>

          <!-- Empty cart UI -->
          <div v-if="cart.length === 0" class="text-center py-10">
            <InfoBlock
              title="Giỏ hàng trống"
              description="Bạn chưa có sản phẩm nào trong giỏ hàng. Vui lòng quay lại trang chủ để mua sắm nhé!"
              image-url="/empty-box.png"
            />
            <button
              @click="router.push('/')"
              class="mt-6 bg-accent-dark text-secondary py-3 px-6 rounded-full text-lg font-semibold hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Quay lại mua sắm
            </button>
          </div>

          <div v-else class="space-y-10">
            <!-- Form Thông tin giao hàng -->
            <div class="bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-2 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Thông tin giao hàng
              </h2>
              <!-- Cập nhật hiệu ứng hover với viền hình chữ nhật -->
              <div class="flex items-center justify-end">
                <router-link
                  to="/auth"
                  class="flex items-center text-gray-700 hover:text-primary transition-colors border border-transparent hover:border-primary rounded-lg p-2 -m-2"
                >
                  <!-- Icon người dùng -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span class="text-sm font-semibold">Bạn đã có tài khoản?</span>
                </router-link>
              </div>
              <form class="space-y-4">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-600"
                    >Họ và tên <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    id="fullName"
                    v-model="customerInfo.fullName"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-accent focus:border-accent transition"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                  <p v-if="errors.fullName" class="mt-1 text-xs text-danger font-medium">
                    {{ errors.fullName }}
                  </p>
                </div>
                <div>
                  <label for="phoneNumber" class="block text-sm font-medium text-gray-600"
                    >Số điện thoại <span class="text-danger">*</span></label
                  >
                  <input
                    type="tel"
                    id="phoneNumber"
                    v-model="customerInfo.phoneNumber"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-accent focus:border-accent transition"
                    placeholder="09xxxxxxxx"
                    required
                  />
                  <p v-if="errors.phoneNumber" class="mt-1 text-xs text-danger font-medium">
                    {{ errors.phoneNumber }}
                  </p>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-600"
                    >Email (Tùy chọn)</label
                  >
                  <input
                    type="email"
                    id="email"
                    v-model="customerInfo.email"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-accent focus:border-accent transition"
                    placeholder="nguyenvana@example.com"
                  />
                </div>
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-600"
                    >Địa chỉ cụ thể <span class="text-danger">*</span></label
                  >
                  <input
                    type="text"
                    id="address"
                    v-model="customerInfo.address"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-accent focus:border-accent transition"
                    placeholder="Số nhà, tên đường, thôn, xóm..."
                    required
                  />
                  <p v-if="errors.address" class="mt-1 text-xs text-danger font-medium">
                    {{ errors.address }}
                  </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label for="province" class="block text-sm font-medium text-gray-600"
                      >Tỉnh/Thành <span class="text-danger">*</span></label
                    >
                    <select
                      id="province"
                      v-model="customerInfo.province"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :class="{ 'border-red-500': errors.province }"
                    >
                      <option :value="null" disabled>Chọn tỉnh/thành phố</option>
                      <option
                        v-for="province in provinces"
                        :key="province.PROVINCE_ID"
                        :value="province.PROVINCE_ID"
                      >
                        {{ province.PROVINCE_NAME }}
                      </option>
                    </select>
                    <p v-if="errors.province" class="mt-1 text-xs text-danger font-medium">
                      {{ errors.province }}
                    </p>
                  </div>
                  <div>
                    <label for="district" class="block text-sm font-medium text-gray-600"
                      >Quận/Huyện <span class="text-danger">*</span></label
                    >
                    <select
                      id="district"
                      v-model="customerInfo.district"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :disabled="!customerInfo.province"
                      :class="{ 'border-red-500': errors.district }"
                    >
                      <option :value="null" disabled>Chọn quận/huyện</option>
                      <option
                        v-for="district in districts"
                        :key="district.DISTRICT_ID"
                        :value="district.DISTRICT_ID"
                      >
                        {{ district.DISTRICT_NAME }}
                      </option>
                    </select>
                    <p v-if="errors.district" class="text-red-500 text-sm mt-1">
                      {{ errors.district }}
                    </p>
                  </div>
                  <div>
                    <label for="ward" class="block text-sm font-medium text-gray-600"
                      >Phường/Xã <span class="text-danger">*</span></label
                    >
                    <select
                      id="ward"
                      v-model="customerInfo.ward"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :disabled="!customerInfo.district"
                      :class="{ 'border-red-500': errors.ward }"
                    >
                      <option :value="null" disabled>Chọn phường/xã</option>
                      <option v-for="ward in wards" :key="ward.WARDS_ID" :value="ward.WARDS_ID">
                        {{ ward.WARDS_NAME }}
                      </option>
                    </select>
                    <p v-if="errors.ward" class="mt-1 text-xs text-danger font-medium">
                      {{ errors.ward }}
                    </p>
                  </div>
                </div>
                <div>
                  <label for="note" class="block text-sm font-medium text-gray-600"
                    >Ghi chú (Tùy chọn)</label
                  >
                  <textarea
                    id="note"
                    v-model="customerInfo.note"
                    rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-accent focus:border-accent transition"
                    placeholder="Ví dụ: Giao hàng giờ hành chính, gọi điện trước khi giao..."
                  ></textarea>
                </div>
              </form>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="bg-gray-50 p-6 rounded-xl shadow-inner">
              <h2 class="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 mr-2 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Phương thức thanh toán
              </h2>
              <div class="space-y-4">
                <label
                  class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="
                    paymentMethod === 'bankTransfer'
                      ? 'border-accent-dark shadow-md bg-accent bg-opacity-5'
                      : 'border-gray-300 hover:bg-gray-50'
                  "
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    v-model="paymentMethod"
                    class="form-radio h-5 w-5 text-accent-dark border-accent-dark focus:ring-accent-dark"
                  />
                  <span class="ml-4 flex-1 text-gray-800 font-semibold"
                    >Chuyển khoản ngân hàng</span
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </label>
                <div
                  v-if="paymentMethod === 'bankTransfer'"
                  class="mt-3 p-4 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 transition-all duration-300"
                >
                  <p class="font-bold mb-2">Thông tin chuyển khoản:</p>
                  <p><strong>Chủ tài khoản:</strong> Hoàng Văn Kiệt</p>
                  <p><strong>Số tài khoản:</strong> 07228343901</p>
                  <p><strong>Ngân hàng:</strong> Tiên Phong Bank (TP Bank)</p>
                  <p class="mt-3">
                    Vui lòng chuyển khoản tổng cộng **{{ formatCurrency(finalTotalPrice) }}** vào
                    tài khoản trên. Nội dung chuyển khoản là mã đơn hàng của bạn sau khi đặt hàng
                    thành công.
                  </p>
                </div>

                <label
                  class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="
                    paymentMethod === 'vnpayQr'
                      ? 'border-accent-dark shadow-md bg-accent bg-opacity-5'
                      : 'border-gray-300 hover:bg-gray-50'
                  "
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpayQr"
                    v-model="paymentMethod"
                    class="form-radio h-5 w-5 text-accent-dark border-accent-dark focus:ring-accent-dark"
                  />
                  <span class="ml-4 flex-1 text-gray-800 font-semibold"
                    >Thanh toán VNPAY QR Code</span
                  >
                  <img src="/vnpay-icon.svg" alt="VNPAY QR" class="h-7 w-7" />
                </label>
                <div
                  v-if="paymentMethod === 'vnpayQr'"
                  class="mt-3 p-4 bg-gray-100 border border-gray-300 rounded-md text-center transition-all duration-300"
                >
                  <p
                    v-if="isVnpayPaymentProcessing"
                    class="text-lg text-accent font-semibold flex items-center justify-center"
                  >
                    <svg
                      class="animate-spin -ml-1 mr-3 h-6 w-6 text-accent"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tạo mã QR...
                  </p>
                  <div v-else-if="vnpayQrCodeUrl" class="animate-fade-in">
                    <p class="text-lg text-primary font-bold mb-2">Quét mã QR để thanh toán:</p>
                    <img
                      :src="vnpayQrCodeUrl"
                      alt="VNPAY QR Code"
                      class="mx-auto w-48 h-48 border-4 border-accent-dark rounded-xl p-2 shadow-lg"
                    />
                    <p class="mt-4 text-danger text-xl font-bold tracking-wide">
                      Thời gian còn lại: {{ formatCountdown }}
                    </p>
                    <p class="mt-2 text-sm text-gray-700">
                      Tổng tiền cần thanh toán:
                      <span class="font-bold text-accent">{{
                        formatCurrency(finalTotalPrice)
                      }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      Vui lòng hoàn tất thanh toán trong thời gian quy định.
                    </p>
                  </div>
                  <div v-else>
                    <p class="text-lg text-danger">Không thể tạo mã QR. Vui lòng thử lại.</p>
                    <button
                      @click="generateVnpayQr"
                      class="mt-3 bg-accent-dark text-secondary py-2 px-4 rounded-full text-sm hover:bg-accent transition"
                      :disabled="isVnpayPaymentProcessing"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>

                <label
                  class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300"
                  :class="
                    paymentMethod === 'cod'
                      ? 'border-accent-dark shadow-md bg-accent bg-opacity-5'
                      : 'border-gray-300 hover:bg-gray-50'
                  "
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    v-model="paymentMethod"
                    class="form-radio h-5 w-5 text-accent-dark border-accent-dark focus:ring-accent-dark"
                  />
                  <span class="ml-4 flex-1 text-gray-800 font-semibold"
                    >Thanh toán khi nhận hàng (COD)</span
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 8h6m-5 0h-1m1 4h3m-3 0h-1m1 4h6m-5 0h-1m1 4h6a2 2 0 002-2v-4a2 2 0 00-2-2h-6a2 2 0 00-2 2v4a2 2 0 002 2zM3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </label>
                <div
                  v-if="paymentMethod === 'cod'"
                  class="mt-3 p-4 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 transition-all duration-300"
                >
                  <p>
                    Bạn sẽ thanh toán tổng cộng **{{ formatCurrency(finalTotalPrice) }}** trực tiếp
                    cho nhân viên giao hàng khi nhận được sản phẩm.
                  </p>
                </div>
              </div>
            </div>

            <button
              @click="placeOrder"
              :disabled="cart.length === 0 || isCreatingOrder"
              class="w-full py-4 rounded-full text-xl font-bold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 bg-accent-dark text-secondary shadow-lg hover:shadow-xl hover:bg-accent-dark focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50 transform hover:scale-105"
            >
              <span v-if="isCreatingOrder" class="flex items-center space-x-2">
                <svg
                  class="animate-spin h-6 w-6 text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Đang đặt hàng...</span>
              </span>
              <span v-else>Hoàn tất đặt hàng</span>
            </button>
          </div>
        </div>

        <!-- Cột 2: Tóm tắt đơn hàng -->
        <div class="bg-gray-50 p-6 sm:p-8 lg:block relative">
          <div class="sticky top-8">
            <h2 class="text-xl font-semibold mb-6 text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 12h.01M7 12h.01"
                />
              </svg>
              Tóm tắt đơn hàng
            </h2>
            <div
              class="border border-slate-200 rounded-xl p-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-white"
              v-auto-animate
            >
              <!-- FIX: Sử dụng lại logic xử lý sự kiện như CartItemList.vue -->
              <CartItem
                v-for="item in cart"
                :key="
                  item.id +
                  (item.tenKichCo ? '-' + item.tenKichCo : '') +
                  (item.tenMauSac ? '-' + item.tenMauSac : '')
                "
                :cart-item-id="item.id"
                :title="item.tenSanPham"
                :price="item.giaBanHienTai"
                :image-url="item.urlAnhDaiDien"
                :selected-size="item.tenKichCo"
                :selected-color="item.tenMauSac"
                :quantity="item.soLuong"
                :so-luong-ton-kho="item.soLuongTonKho"
                @on-click-remove="() => removeFromCart(item)"
                @on-increase-quantity="() => updateQuantity(item.id, 1)"
                @on-decrease-quantity="() => updateQuantity(item.id, -1)"
                class="mb-4"
              />
            </div>

            <div class="mt-6 space-y-3 p-4 bg-white rounded-xl shadow-md">
              <div class="flex justify-between items-center text-lg">
                <span class="text-gray-600">Tổng phụ:</span>
                <b class="font-semibold">{{ formatCurrency(totalPrice) }}</b>
              </div>
              <div class="flex justify-between items-center text-lg">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <b class="font-semibold">{{ formatCurrency(shippingFee) }}</b>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between items-center text-lg">
                <span class="text-gray-600">Giảm giá</span>
                <span class="font-semibold">-{{ formatCurrency(discountAmount) }}</span>
              </div>
              <div
                class="flex justify-between items-center font-bold text-xl pt-4 border-t-2 border-dashed"
              >
                <span>Tổng cộng:</span>
                <b class="text-accent-dark">{{ formatCurrency(finalTotalPrice) }}</b>
              </div>
            </div>
            <div class="mt-6 p-4 bg-white rounded-xl shadow-md">
              <h3 class="text-md font-semibold mb-2 text-gray-700">Mã giảm giá</h3>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="voucherCode"
                  placeholder="Nhập mã giảm giá..."
                  class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent transition-colors"
                  :class="{
                    'border-danger': voucherError,
                    'border-success': appliedVoucher
                  }"
                  :disabled="appliedVoucher"
                />

                <button
                  v-if="!appliedVoucher"
                  @click="applyVoucher"
                  :disabled="isApplyingVoucher || !voucherCode"
                  class="bg-accent-dark text-secondary font-semibold py-3 px-6 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <span v-if="isApplyingVoucher">Đang áp dụng...</span>
                  <span v-else>Áp dụng</span>
                </button>
                <button
                  v-else
                  @click="removeVoucher"
                  class="bg-gray-500 text-secondary font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Xoá
                </button>
              </div>

              <div class="mt-2 text-sm h-6">
                <div v-if="voucherError" class="text-danger font-medium">
                  {{ voucherError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal (Improved with GSAP) -->
    <div
      v-if="isShowErrorModal"
      @click.self="closeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
        <div class="flex justify-center mb-4">
          <svg
            class="h-16 w-16 text-danger animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-danger mb-4">Có lỗi xảy ra!</h3>
        <p class="text-gray-700 mb-6">{{ errorMessage }}</p>
        <button
          @click="closeModal"
          class="bg-danger text-secondary py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  Cập nhật font để nhất quán với file index.html
  Sử dụng 'Be Vietnam Pro' và 'Josefin Sans'
*/
.font-sans {
  font-family: 'Be Vietnam Pro', sans-serif;
}
.font-josefin-sans {
  font-family: 'Josefin Sans', sans-serif;
}

.custom-scrollbar {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* Improved Custom scrollbar for better UX */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  display: none; /* Chrome, Safari, Opera */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e5e7eb; /* gray-200 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #9ca3af; /* gray-400 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* gray-500 */
}

/* Modal transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Keyframes for fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
