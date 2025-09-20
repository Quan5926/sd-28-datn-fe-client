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
                  :src="item.urlAnhSanPham"
                  :alt="item.tenSanPham"
                  class="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm text-blue-600 font-medium">{{ item.tenThuongHieu }}</p>
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ item.tenSanPham }}</h3>
                    <p class="text-sm text-gray-600">{{ item.tenMauSac }} - {{ item.tenKichCo }}</p>
                  </div>
                  <button
                    @click="removeItem(item.id)"
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
                      @click="updateQuantity(item.id, item.soLuong - 1)"
                      :disabled="item.soLuong <= 1"
                      class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span class="px-3 py-1 bg-gray-100 rounded">{{ item.soLuong }}</span>
                    <button
                      @click="updateQuantity(item.id, item.soLuong + 1)"
                      class="p-2 hover:bg-gray-100"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-gray-900">{{ formatCurrency(item.gia * item.soLuong) }}</p>
                    <p class="text-sm text-gray-600">{{ formatCurrency(item.gia) }} / sản phẩm</p>
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
                <span class="font-medium">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between">
                <span class="text-gray-600">Giảm giá</span>
                <span class="font-medium text-green-600">-{{ formatCurrency(discount) }}</span>
              </div>
              <hr>
              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{{ formatCurrency(total) }}</span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                * Phí vận chuyển sẽ được thu bởi đơn vị vận chuyển
              </p>
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
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const { cart, itemCount, totalAmount, loading, loadCart, updateQuantity, removeItem, formatCurrency } = useCart()
const { getCurrentInvoiceId } = useCheckout()
const { success, error } = useNotification()

// Use cart data
const cartItems = computed(() => cart.value?.items || [])
const subtotal = computed(() => totalAmount.value || 0)

// Computed properties for discount and total
const discount = computed(() => {
  // No discount applied
  return 0
})

const total = computed(() => {
  return subtotal.value - discount.value
})

// Methods

const proceedToCheckout = () => {
  // Check if cart has items
  if (!cart.value || !cart.value.items || cart.value.items.length === 0) {
    error('Giỏ hàng trống, không thể thanh toán!')
    return
  }

  // Check if we have a valid invoice ID
  const invoiceId = getCurrentInvoiceId()
  if (!invoiceId) {
    // This is normal when cart is empty, don't show error
    console.log('No invoice ID found - cart is empty')
    return
  }

  console.log('Proceeding to checkout with invoice ID:', invoiceId)
  console.log('Cart items:', cart.value.items)
  
  // Navigate to checkout page
  router.push('/checkout')
}

onMounted(async () => {
  await loadCart()
  console.log('GioHang.vue - Cart loaded with', cartItems.value.length, 'items')
  console.log('GioHang.vue - Cart data:', cart.value)
})
</script>
