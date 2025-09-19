<template>
  <div>
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">2</span>
      </div>
      <div>
        <h2 class="text-xl font-bold text-gray-900">Mã giảm giá</h2>
        <p class="text-sm text-gray-600">Áp dụng voucher ưu đãi</p>
      </div>
    </div>

    <!-- Voucher Input Section -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        <i class="fas fa-keyboard mr-2 text-green-600"></i>Nhập mã giảm giá
      </h3>
      
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="localVoucherCode"
            type="text"
            placeholder="Nhập mã giảm giá"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors uppercase"
            :class="{ 
              'border-red-300 focus:ring-red-500 focus:border-red-500': voucherError,
              'border-green-300 focus:ring-green-500 focus:border-green-500': appliedVoucher
            }"
            @input="clearVoucherStatus"
            @keyup.enter="applyVoucher"
          />
          <p v-if="voucherError" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>{{ voucherError }}
          </p>
          <p v-if="appliedVoucher" class="mt-2 text-sm text-green-600">
            <i class="fas fa-check-circle mr-1"></i>Mã giảm giá đã được áp dụng
          </p>
        </div>
        <button
          @click="applyVoucher"
          :disabled="!localVoucherCode.trim() || applyingVoucher"
          class="px-6 py-3 bg-accent hover:bg-accent-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors min-w-[120px]"
        >
          <span v-if="applyingVoucher">
            <i class="fas fa-spinner fa-spin mr-2"></i>Đang áp dụng
          </span>
          <span v-else>
            <i class="fas fa-tag mr-2"></i>Áp dụng
          </span>
        </button>
      </div>
    </div>

    <!-- Applied Voucher Display -->
    <div v-if="appliedVoucher" class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <i class="fas fa-tag text-green-600 text-xl"></i>
          </div>
          <div>
            <h4 class="font-semibold text-green-800">{{ appliedVoucher.tenVoucher }}</h4>
            <p class="text-sm text-green-600 mt-1">Mã: {{ appliedVoucher.ma }}</p>
            <p class="text-sm text-green-600">
              Giảm {{ appliedVoucher.loaiGiamGia === 'PERCENT' ? appliedVoucher.giaTriGiam + '%' : formatCurrency(appliedVoucher.giaTriGiam) }}
              <span v-if="appliedVoucher.giaTriGiamToiDa && appliedVoucher.loaiGiamGia === 'PERCENT'">
                (tối đa {{ formatCurrency(appliedVoucher.giaTriGiamToiDa) }})
              </span>
            </p>
          </div>
        </div>
        <button
          @click="removeVoucher"
          class="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="mt-4 p-4 bg-white rounded-lg">
        <div class="flex justify-between items-center text-lg">
          <span class="text-gray-700">Số tiền được giảm:</span>
          <span class="font-bold text-green-600">-{{ formatCurrency(localDiscountAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- Available Vouchers -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        <i class="fas fa-gift mr-2 text-green-600"></i>Voucher có sẵn
      </h3>
      
      <!-- Loading State -->
      <div v-if="loadingVouchers" class="text-center py-8">
        <div class="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải danh sách voucher...</p>
      </div>

      <!-- Voucher List -->
      <div v-else-if="availableVouchers.length > 0" class="space-y-4 max-h-80 overflow-y-auto">
        <div
          v-for="voucher in availableVouchers"
          :key="voucher.id"
          class="p-4 border border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all cursor-pointer"
          :class="{ 'border-accent bg-accent/10': appliedVoucher?.id === voucher.id }"
          @click="selectVoucher(voucher)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center">
                <i class="fas fa-tag text-white"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ voucher.tenVoucher }}</h4>
                <p class="text-sm text-gray-600">Mã: {{ voucher.ma }}</p>
                <div class="flex items-center gap-4 mt-1">
                  <span class="text-sm text-accent font-medium">
                    Giảm {{ voucher.loaiGiamGia === 'PERCENT' ? voucher.giaTriGiam + '%' : formatCurrency(voucher.giaTriGiam) }}
                  </span>
                  <span v-if="voucher.donHangToiThieu" class="text-xs text-gray-500">
                    Đơn tối thiểu: {{ formatCurrency(voucher.donHangToiThieu) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500 mb-1">HSD: {{ formatDate(voucher.ngayKetThuc) }}</div>
              <button
                v-if="appliedVoucher?.id !== voucher.id"
                class="px-3 py-1 bg-accent hover:bg-accent-dark text-white text-sm rounded-md transition-colors"
                @click.stop="selectVoucher(voucher)"
              >
                Chọn
              </button>
              <span v-else class="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-md">
                Đã chọn
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Vouchers -->
      <div v-else class="text-center py-8">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-tag text-2xl text-gray-400"></i>
        </div>
        <h4 class="text-lg font-semibold text-gray-700 mb-2">Không có voucher khả dụng</h4>
        <p class="text-gray-500">Hiện tại không có mã giảm giá nào phù hợp với đơn hàng của bạn.</p>
      </div>
    </div>

    <!-- Order Summary with Discount -->
    <div class="bg-gray-50 rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Tóm tắt giá trị đơn hàng</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Tạm tính:</span>
          <span class="font-semibold">{{ formatCurrency(totalPrice) }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Phí vận chuyển:</span>
          <span class="font-semibold">{{ formatCurrency(shippingFee) }}</span>
        </div>
        <div v-if="localDiscountAmount > 0" class="flex justify-between items-center text-green-600">
          <span>Giảm giá:</span>
          <span class="font-semibold">-{{ formatCurrency(localDiscountAmount) }}</span>
        </div>
        <div class="border-t pt-3 flex justify-between items-center">
          <span class="text-lg font-bold text-gray-900">Tổng cộng:</span>
          <span class="text-xl font-bold text-accent">{{ formatCurrency(finalTotal) }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <button
          @click="$emit('prev-step')"
          class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <i class="fas fa-arrow-left mr-2"></i>Quay lại
        </button>
        
        <div class="flex items-center gap-3">
          <!-- Continue without voucher -->
          <button
            @click="$emit('next-step')"
            class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <i class="fas fa-skip-forward mr-2"></i>Bỏ qua
          </button>
          
          <!-- Continue with voucher -->
          <button
            @click="proceedToNext"
            class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            <i class="fas fa-arrow-right mr-2"></i>Tiếp tục
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { voucherAPI } from '../../api/voucherAPI.js'

const props = defineProps({
  voucherCode: {
    type: String,
    default: ''
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  fakeVouchers: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['update:voucherCode', 'update:discountAmount', 'next-step', 'prev-step'])

const toast = useToast()

// Local reactive data
const localVoucherCode = ref(props.voucherCode)
const localDiscountAmount = ref(props.discountAmount)
const availableVouchers = ref([])
const appliedVoucher = ref(null)
const loadingVouchers = ref(false)
const applyingVoucher = ref(false)
const voucherError = ref('')

// Mock shipping fee calculation
const shippingFee = computed(() => {
  return props.totalPrice >= 1000000 ? 0 : 50000
})

const finalTotal = computed(() => {
  return Math.max(0, props.totalPrice + shippingFee.value - localDiscountAmount.value)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const loadAvailableVouchers = async () => {
  loadingVouchers.value = true
  try {
    // Use fake vouchers if provided
    if (props.fakeVouchers) {
      availableVouchers.value = props.fakeVouchers.filter(voucher => {
        return voucher.isActive && 
               !voucher.isExpired && 
               !voucher.isUsedUp &&
               props.totalPrice >= (voucher.donHangToiThieu || 0)
      })
    } else {
      // Try to load from API first
      try {
        const response = await voucherAPI.getAvailableVouchers(null, props.totalPrice)
        availableVouchers.value = response.data.map(voucher => voucherAPI.formatVoucherData(voucher))
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError)
        // Fallback to mock data if API is not available
        availableVouchers.value = voucherAPI.getMockVouchers(props.totalPrice)
      }
    }
    
  } catch (error) {
    console.error('Error loading vouchers:', error)
    toast.error('Không thể tải danh sách voucher')
  } finally {
    loadingVouchers.value = false
  }
}

const applyVoucher = async () => {
  if (!localVoucherCode.value.trim()) {
    toast.warning('Vui lòng nhập mã giảm giá')
    return
  }

  applyingVoucher.value = true
  voucherError.value = ''

  try {
    // Try API validation first
    try {
      const response = await voucherAPI.validateVoucher(localVoucherCode.value, props.totalPrice)
      if (response.success) {
        const voucher = voucherAPI.formatVoucherData(response.data)
        selectVoucher(voucher)
        toast.success('Áp dụng mã giảm giá thành công!')
        return
      } else {
        voucherError.value = response.message || 'Mã giảm giá không hợp lệ'
        return
      }
    } catch (apiError) {
      console.warn('API validation failed, using local validation:', apiError)
      
      // Fallback to local validation
      const voucher = availableVouchers.value.find(v => 
        v.ma.toLowerCase() === localVoucherCode.value.toLowerCase()
      )

      if (!voucher) {
        voucherError.value = 'Mã giảm giá không tồn tại hoặc đã hết hạn'
        return
      }

      // Validate voucher conditions
      const validation = voucherAPI.validateVoucherConditions(voucher, props.totalPrice)
      if (!validation.isValid) {
        voucherError.value = validation.errors[0]
        return
      }

      selectVoucher(voucher)
      toast.success('Áp dụng mã giảm giá thành công!')
    }

  } catch (error) {
    console.error('Error applying voucher:', error)
    voucherError.value = 'Có lỗi xảy ra khi áp dụng mã giảm giá'
  } finally {
    applyingVoucher.value = false
  }
}

const selectVoucher = (voucher) => {
  appliedVoucher.value = voucher
  localVoucherCode.value = voucher.ma
  
  // Calculate discount amount using API helper
  const discount = voucherAPI.calculateDiscount(voucher, props.totalPrice)
  
  localDiscountAmount.value = discount
  voucherError.value = ''
  
  // Emit updates
  emit('update:voucherCode', voucher.ma)
  emit('update:discountAmount', discount)
}

const removeVoucher = () => {
  appliedVoucher.value = null
  localVoucherCode.value = ''
  localDiscountAmount.value = 0
  voucherError.value = ''
  
  emit('update:voucherCode', '')
  emit('update:discountAmount', 0)
  
  toast.success('Đã hủy mã giảm giá')
}

const clearVoucherStatus = () => {
  voucherError.value = ''
}

const proceedToNext = () => {
  emit('next-step')
}

// Watch for prop changes
watch(() => props.voucherCode, (newValue) => {
  localVoucherCode.value = newValue
})

watch(() => props.discountAmount, (newValue) => {
  localDiscountAmount.value = newValue
})

// Load vouchers on mount
onMounted(() => {
  loadAvailableVouchers()
})
</script>
