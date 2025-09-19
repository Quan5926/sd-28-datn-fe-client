<template>
  <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <i class="fas fa-database text-orange-600"></i>
        <h3 class="font-bold text-orange-800">🧪 Fake Data Mode</h3>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-orange-700">Auth Mode:</label>
        <button
          @click="toggleAuthMode"
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="fakeAuthMode ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
        >
          {{ fakeAuthMode ? 'Đã đăng nhập' : 'Khách' }}
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div class="bg-white p-3 rounded border">
        <div class="font-medium text-orange-800">Giỏ hàng</div>
        <div class="text-orange-600">{{ fakeCart.length }} sản phẩm</div>
        <div class="text-orange-600">{{ formatCurrency(cartTotal) }}</div>
      </div>
      
      <div class="bg-white p-3 rounded border">
        <div class="font-medium text-orange-800">Khách hàng</div>
        <div class="text-orange-600">
          {{ fakeAuthMode ? fakeCustomer.authenticated.profile.ten : 'Khách vãng lai' }}
        </div>
        <div class="text-orange-600">
          {{ fakeAuthMode ? fakeCustomer.authenticated.addresses.length + ' địa chỉ' : 'Chưa có địa chỉ' }}
        </div>
      </div>
      
      <div class="bg-white p-3 rounded border">
        <div class="font-medium text-orange-800">Voucher</div>
        <div class="text-orange-600">{{ availableVouchers.length }} khả dụng</div>
        <div class="text-orange-600">Tối đa {{ formatCurrency(maxDiscount) }}</div>
      </div>
      
      <div class="bg-white p-3 rounded border">
        <div class="font-medium text-orange-800">Thanh toán</div>
        <div class="text-orange-600">COD / VNPay</div>
        <div class="text-orange-600">Phí ship: {{ formatCurrency(shippingFee) }}</div>
      </div>
    </div>
    
    <div class="mt-3 flex items-center gap-4">
      <button
        @click="refreshFakeData"
        class="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-sm transition-colors"
      >
        <i class="fas fa-refresh mr-1"></i>Làm mới data
      </button>
      
      <button
        @click="addRandomItem"
        class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-sm transition-colors"
      >
        <i class="fas fa-plus mr-1"></i>Thêm sản phẩm
      </button>
      
      <button
        @click="clearCart"
        class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm transition-colors"
      >
        <i class="fas fa-trash mr-1"></i>Xóa giỏ hàng
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFakeCheckoutData } from '../../data/fakeCheckoutData.js'

const emit = defineEmits(['update-fake-data'])

const {
  fakeCartData,
  fakeCustomerData,
  fakeVoucherData,
  formatCurrency,
  getCartTotal,
  getShippingFee,
  getAvailableVouchers
} = useFakeCheckoutData()

// Reactive fake data
const fakeCart = ref([...fakeCartData])
const fakeCustomer = ref(fakeCustomerData)
const fakeAuthMode = ref(true) // true = authenticated, false = guest

// Computed properties
const cartTotal = computed(() => {
  return fakeCart.value.reduce((sum, item) => sum + (item.giaBanHienTai * item.soLuong), 0)
})

const shippingFee = computed(() => {
  return getShippingFee(cartTotal.value)
})

const availableVouchers = computed(() => {
  return getAvailableVouchers(cartTotal.value)
})

const maxDiscount = computed(() => {
  return Math.max(...availableVouchers.value.map(v => {
    if (v.loaiGiamGia === 'PERCENT') {
      const discount = (cartTotal.value * v.giaTriGiam) / 100
      return v.giaTriGiamToiDa ? Math.min(discount, v.giaTriGiamToiDa) : discount
    }
    return v.giaTriGiam
  }), 0)
})

// Methods
const toggleAuthMode = () => {
  fakeAuthMode.value = !fakeAuthMode.value
  emitFakeData()
}

const refreshFakeData = () => {
  fakeCart.value = [...fakeCartData]
  emitFakeData()
}

const addRandomItem = () => {
  const randomItems = [
    {
      id: Date.now(),
      tenSanPham: "Puma RS-X",
      urlAnhDaiDien: "/sneakers/sneakers-5-alt1.jpg",
      tenKichCo: "41",
      tenMauSac: "Xám",
      soLuong: 1,
      giaBanHienTai: 2800000,
      soLuongTonKho: 10
    },
    {
      id: Date.now() + 1,
      tenSanPham: "New Balance 574",
      urlAnhDaiDien: "/sneakers/sneakers-6-alt1.jpg",
      tenKichCo: "42",
      tenMauSac: "Xanh",
      soLuong: 1,
      giaBanHienTai: 2200000,
      soLuongTonKho: 15
    }
  ]
  
  const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)]
  fakeCart.value.push(randomItem)
  emitFakeData()
}

const clearCart = () => {
  fakeCart.value = []
  emitFakeData()
}

const emitFakeData = () => {
  emit('update-fake-data', {
    cart: fakeCart.value,
    customer: fakeCustomer.value,
    isAuthenticated: fakeAuthMode.value,
    vouchers: fakeVoucherData,
    formatCurrency
  })
}

// Watch for changes and emit
watch([fakeCart, fakeAuthMode], () => {
  emitFakeData()
}, { deep: true, immediate: true })
</script>
