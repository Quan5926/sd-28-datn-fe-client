<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
        <p class="text-gray-600 mt-1">{{ cartItems.length }} sản phẩm</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="mb-6">
          <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p class="text-gray-600 mb-6">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
        <router-link
          to="/products"
          class="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex gap-4">
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm text-blue-600 font-medium">{{ item.brand }}</p>
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                    <p class="text-sm text-gray-600">Kích cỡ: {{ item.size }}</p>
                  </div>
                  <button
                    @click="removeFromCart(item.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <!-- Quantity and Price -->
                <div class="flex justify-between items-center mt-4">
                  <div class="flex items-center border rounded-lg">
                    <button
                      @click="updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span class="px-4 py-2 font-medium">{{ item.quantity }}</span>
                    <button
                      @click="updateQuantity(item.id, item.quantity + 1)"
                      class="p-2 hover:bg-gray-100"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
                    <p class="text-sm text-gray-600">{{ formatPrice(item.price) }} / sản phẩm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 class="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính</span>
                <span class="font-medium">{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển</span>
                <span class="font-medium">{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Giảm giá</span>
                <span class="font-medium text-green-600">-{{ formatPrice(discount) }}</span>
              </div>
              <hr>
              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>

            <!-- Promo Code -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
              <div class="flex gap-2">
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="applyPromoCode"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="proceedToCheckout"
              class="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors mb-4"
            >
              Thanh toán
            </button>

            <router-link
              to="/products"
              class="block text-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Tiếp tục mua sắm
            </router-link>

            <!-- Security Info -->
            <div class="mt-6 pt-6 border-t">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const promoCode = ref('')

// Fake cart data
const cartItems = ref([
  {
    id: '1-42',
    productId: 1,
    name: 'Nike Air Max 270 React',
    brand: 'Nike',
    size: '42',
    price: 2890000,
    quantity: 1,
    image: '/sneakers/sneakers-1-alt1.jpg'
  },
  {
    id: '2-41',
    productId: 2,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    size: '41',
    price: 3200000,
    quantity: 2,
    image: '/sneakers/sneakers-2-alt1.jpg'
  },
  {
    id: '3-43',
    productId: 3,
    name: 'Puma RS-X Reinvention',
    brand: 'Puma',
    size: '43',
    price: 2100000,
    quantity: 1,
    image: '/sneakers/sneakers-3-alt1.jpg'
  }
])

// Computed properties
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingFee = computed(() => {
  return subtotal.value >= 1000000 ? 0 : 50000
})

const discount = computed(() => {
  // Apply 10% discount if promo code is applied
  return promoCode.value === 'PHOSTEP10' ? subtotal.value * 0.1 : 0
})

const total = computed(() => {
  return subtotal.value + shippingFee.value - discount.value
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return
  
  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity = newQuantity
  }
}

const removeFromCart = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const applyPromoCode = () => {
  if (promoCode.value === 'PHOSTEP10') {
    alert('Mã giảm giá đã được áp dụng! Giảm 10%')
  } else if (promoCode.value) {
    alert('Mã giảm giá không hợp lệ')
    promoCode.value = ''
  }
}

const proceedToCheckout = () => {
  // Navigate to checkout page
  router.push('/checkout')
}

onMounted(() => {
  console.log('Cart loaded with', cartItems.value.length, 'items')
})
</script>
