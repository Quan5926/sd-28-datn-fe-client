<script setup>
import { useMainStore } from '../stores/MainStore.ts'
import { useCartStore } from '../stores/cartStore.js'
import { inject, ref, computed, onMounted, onUnmounted } from 'vue'
import authService from '../services/authService.js'
import { useRouter } from 'vue-router'
import { useAvatar } from '@/composables/useAvatar.js'

const mainStore = useMainStore()
const { isDeviceMobile } = mainStore
const cartStore = useCartStore()
const { itemCount } = cartStore
const router = useRouter()

// Avatar composable
const { avatarUrl, initializeAvatar } = useAvatar()

// Real user data from auth service
const currentUser = ref({
  isLoggedIn: false,
  username: '',
  email: '',
  fullName: '',
  role: ''
})

// Update user data from auth service
const updateUserData = () => {
  const user = authService.getUser()
  const isAuthenticated = authService.isAuthenticated()

  currentUser.value = {
    isLoggedIn: isAuthenticated,
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.username || user?.email || '',
    role: authService.getUserRole()
  }
}

// Avatar update handler
const handleAvatarUpdate = (event) => {
  // Avatar will be updated automatically through the composable
}

// Initialize user data on mount
onMounted(() => {
  updateUserData()
  initializeAvatar()
  
  // Listen for avatar updates
  window.addEventListener('avatarUpdated', handleAvatarUpdate)
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('avatarUpdated', handleAvatarUpdate)
})

// Computed property for display name
const displayName = computed(() => {
  if (!currentUser.value.isLoggedIn) {
    return 'Tài khoản'
  }
  return currentUser.value.username || currentUser.value.fullName || 'Tài khoản'
})
const emit = defineEmits(['openDrawer'])
defineProps({
  totalPrice: Number
})

// Remove the inject since we're using cart store now
// const { formatCurrency } = inject('cartActions'); // Inject hàm định dạng tiền tệ

// Mobile menu state
const isMobileMenuOpen = ref(false)
// Account dropdown state
const isAccountDropdownOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleAccountDropdown = () => {
  isAccountDropdownOpen.value = !isAccountDropdownOpen.value
}

// Close dropdown when clicking outside
const closeAccountDropdown = () => {
  isAccountDropdownOpen.value = false
}

// Handle logout
const handleLogout = async () => {
  try {
    await authService.logout()
    updateUserData()
    closeAccountDropdown()
    router.push('/auth')
  } catch (error) {
    console.error('Logout error:', error)
    // Still update UI even if logout API fails
    updateUserData()
    closeAccountDropdown()
    router.push('/auth')
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/98 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex-shrink-0">
          <router-link to="/home" class="flex items-center gap-2.5 group">
            <div class="relative">
              <img src="/Pho-Step_logo.png" alt="PhoStep Logo"
                class="w-20 h-220 transition-all duration-300 group-hover:scale-110" />
            </div>
            <div class="hidden sm:block">
              <h2 class="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
                PHOSTEP</h2>
              <p class="text-xs text-slate-500 font-medium -mt-0.5">Nơi những bước chân bắt đầu</p>
            </div>
          </router-link>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden lg:flex items-center">
          <div class="flex items-center space-x-1">
            <router-link to="/home"
              class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group" :class="$route.name === 'home'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'">
              <span class="relative z-10">Trang chủ</span>
              <div v-if="$route.name === 'home'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full">
              </div>
            </router-link>
            <router-link to="/products"
              class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group" :class="$route.name === 'products'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'">
              <span class="relative z-10">Sản phẩm</span>
              <div v-if="$route.name === 'products'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full">
              </div>
            </router-link>
            <router-link to="/discounts"
              class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group" :class="$route.name === 'discounts'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'">
              <span class="relative z-10">Giảm giá</span>
              <div v-if="$route.name === 'discounts'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full">
              </div>
            </router-link>
            <router-link to="/orders"
              class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group" :class="$route.name === 'orders'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'">
              <span class="relative z-10">Đơn hàng</span>
              <div v-if="$route.name === 'orders'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full">
              </div>
            </router-link>
            <router-link to="/support"
              class="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group" :class="$route.name === 'support'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'">
              <span class="relative z-10">Hỗ trợ</span>
              <div v-if="$route.name === 'support'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full">
              </div>
            </router-link>
          </div>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-2">
          <!-- Mobile menu button -->
          <button @click="toggleMobileMenu"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200">
            <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-90': isMobileMenuOpen }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>

          <!-- Action Buttons -->
          <div class="flex items-center gap-1" v-auto-animate>
            <!-- <router-link
          to="/favorites"
          class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <img src="/heart.svg" alt="Yêu thích" />
          <span v-if="!isDeviceMobile">Yêu thích</span>
        </router-link> -->

            <!-- Account Dropdown -->
            <div class="relative">
              <button @click="toggleAccountDropdown"
                class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 group">
                <div class="relative">
                  <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-200">
                    <img 
                      v-if="currentUser.isLoggedIn && avatarUrl"
                      :src="avatarUrl" 
                      :alt="displayName"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div v-if="currentUser.isLoggedIn"
                    class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span v-if="!isDeviceMobile" class="text-sm font-medium max-w-20 truncate">{{ displayName }}</span>
                <svg v-if="!isDeviceMobile" class="w-3 h-3 transition-transform duration-200"
                  :class="{ 'rotate-180': isAccountDropdownOpen }" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="isAccountDropdownOpen"
                class="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden backdrop-blur-sm"
                @click.stop>
                <div class="bg-gradient-to-r from-primary-50 to-blue-50 px-3 py-2.5 border-b border-gray-100">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-300 flex-shrink-0">
                      <img 
                        v-if="currentUser.isLoggedIn && avatarUrl"
                        :src="avatarUrl" 
                        :alt="displayName"
                        class="w-full h-full object-cover"
                      >
                      <div v-else class="w-full h-full bg-primary-500 flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    <div v-if="currentUser.isLoggedIn" class="min-w-0 flex-1">
                      <p class="font-medium text-gray-800 text-sm truncate">{{ currentUser.fullName }}</p>
                      <p class="text-xs text-gray-600 truncate">{{ currentUser.email }}</p>
                      <span class="inline-block px-1.5 py-0.5 text-xs bg-primary-500 text-white rounded-md mt-0.5">{{ currentUser.role }}</span>
                    </div>
                    <div v-else class="min-w-0 flex-1">
                      <p class="font-medium text-gray-700 text-sm">Chưa đăng nhập</p>
                      <p class="text-xs text-gray-500">Đăng nhập để trải nghiệm</p>
                    </div>
                  </div>
                </div>
                <div class="py-1">
                  <!-- Guest User Options -->
                  <router-link v-if="!currentUser.isLoggedIn" to="/auth" @click="closeAccountDropdown"
                    class="flex items-center px-3 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group">
                    <div
                      class="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-primary-200 transition-colors">
                      <svg class="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                        </path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-sm">Đăng nhập / Đăng ký</p>
                      <p class="text-xs text-gray-500">Truy cập tài khoản</p>
                    </div>
                  </router-link>

                  <!-- Logged In User Options -->
                  <div v-if="currentUser.isLoggedIn">

                    <!-- Admin Panel Access -->
                    <a v-if="authService.canAccessAdmin()" href="http://localhost:5173" target="_blank"
                      @click="closeAccountDropdown"
                      class="flex items-center px-3 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 group border-b border-gray-100">
                      <div
                        class="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-orange-200 transition-colors">
                        <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                          </path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-sm">Quản trị hệ thống</p>
                        <p class="text-xs text-gray-500">Bảng điều khiển admin</p>
                      </div>
                      <svg class="w-3 h-3 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>

                    <router-link to="/account/overview" @click="closeAccountDropdown"
                      class="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group">
                      <div
                        class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-blue-200 transition-colors">
                        <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4">
                          </path>
                        </svg>
                      </div>
                      <p class="font-medium text-sm">Tổng quan</p>
                    </router-link>

                    <router-link to="/account/purchase-history" @click="closeAccountDropdown"
                      class="flex items-center px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group">
                      <div
                        class="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-green-200 transition-colors">
                        <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                      </div>
                      <p class="font-medium text-sm">Lịch sử mua hàng</p>
                    </router-link>

                    <router-link to="/account/profile" @click="closeAccountDropdown"
                      class="flex items-center px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group">
                      <div
                        class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-purple-200 transition-colors">
                        <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <p class="font-medium text-sm">Thông tin tài khoản</p>
                    </router-link>

                    <router-link to="/account/feedback" @click="closeAccountDropdown"
                      class="flex items-center px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 group">
                      <div
                        class="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-indigo-200 transition-colors">
                        <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                          </path>
                        </svg>
                      </div>
                      <p class="font-medium text-sm">Góp ý - Phản hồi</p>
                    </router-link>

                    <div class="border-t border-gray-100 mt-1">
                      <button @click="handleLogout"
                        class="flex items-center w-full px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group">
                        <div
                          class="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-red-200 transition-colors">
                          <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                            </path>
                          </svg>
                        </div>
                        <p class="font-medium text-sm">Đăng xuất</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart Button -->
            <router-link to="/cart" v-auto-animate
              class="flex items-center gap-2 px-2.5 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 group relative">
              <div class="relative">
                <div
                  class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                  <svg class="w-4 h-4 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z">
                    </path>
                  </svg>
                </div>
                <!-- Cart item count badge -->
                <span v-if="itemCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                  {{ itemCount > 9 ? '9+' : itemCount }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation Menu -->
  <div v-if="isMobileMenuOpen" class="lg:hidden bg-white border-b border-slate-200 shadow-sm" v-auto-animate>
    <div class="max-w-6xl mx-auto px-4">
      <nav class="py-3">
        <div class="grid grid-cols-2 gap-2">
          <router-link to="/home" @click="isMobileMenuOpen = false"
            class="flex items-center px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200 text-sm"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === 'home' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            Trang chủ
          </router-link>
          <router-link to="/products" @click="isMobileMenuOpen = false"
            class="flex items-center px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200 text-sm"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === 'products' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Sản phẩm
          </router-link>
          <router-link to="/discounts" @click="isMobileMenuOpen = false"
            class="flex items-center px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200 text-sm"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === 'discounts' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
              </path>
            </svg>
            Giảm giá
          </router-link>
          <router-link to="/orders" @click="isMobileMenuOpen = false"
            class="flex items-center px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200 text-sm"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === 'orders' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            Đơn hàng
          </router-link>
          <router-link to="/support" @click="isMobileMenuOpen = false"
            class="flex items-center px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200 text-sm col-span-2 justify-center"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === 'support' }">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
            </svg>
            Hỗ trợ
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<style lang="scss">
// Header optimizations
.header-optimized {
  // Smooth backdrop blur
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  // Enhanced shadow
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

// Navigation underline animation
.nav-underline {
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 1px;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 80%;
  }
}

// Account avatar glow effect
.account-avatar {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 0.3;
  }
}

// Cart button hover effect
.cart-hover {
  &:hover {
    .cart-icon {
      transform: scale(1.1);
    }
  }
}

// Mobile menu grid animation
.mobile-grid-item {
  opacity: 0;
  transform: translateY(10px);
  animation: slideInUp 0.3s ease forwards;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.15s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }

  &:nth-child(4) {
    animation-delay: 0.25s;
  }

  &:nth-child(5) {
    animation-delay: 0.3s;
  }
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Dropdown menu enhancements
.dropdown-enhanced {
  transform: translateY(-10px);
  opacity: 0;
  animation: dropdownSlide 0.2s ease forwards;
}

@keyframes dropdownSlide {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Logo hover effect
.logo-hover {
  &:hover {
    .logo-bg {
      opacity: 1;
      transform: scale(1.1);
    }
  }
}

// Compact design adjustments
@media screen and (max-width: 1024px) {
  .nav-compact {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}

@media screen and (max-width: 768px) {
  .header-mobile {
    padding: 0.75rem 1rem;
  }

  .mobile-menu-compact {
    padding: 0.75rem 1rem;
  }
}

@media screen and (max-width: 640px) {
  .logo-mobile {
    h2 {
      font-size: 1.25rem;
    }

    p {
      font-size: 0.7rem;
    }
  }
}

// Accessibility improvements
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-contrast: high) {
  .nav-item {
    border: 1px solid currentColor;
  }
}

// Focus states
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

// Smooth transitions
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

// Backdrop blur fallback
@supports not (backdrop-filter: blur(16px)) {
  .backdrop-blur-lg {
    background-color: rgba(255, 255, 255, 0.98);
  }
}
</style>