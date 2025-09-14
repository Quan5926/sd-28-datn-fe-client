<script setup>
import { useMainStore } from '../stores/MainStore.ts'
import { inject, ref, computed } from 'vue' // Import inject and ref

const mainStore = useMainStore()
const { isDeviceMobile } = mainStore

// Mock user data - replace with actual auth store/service
const currentUser = ref({
  isLoggedIn: true, // Change this based on actual auth state
  username: 'nguyenvana', // Replace with actual username
  email: 'nguyenvana@example.com', // Replace with actual email
  fullName: 'Nguyễn Văn A' // Replace with actual full name
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

const { formatCurrency } = inject('cartActions'); // Inject hàm định dạng tiền tệ

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
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-3 header">
    <div class="header__text">
      <router-link to="/" class="flex items-center gap-4">
        <img src="/Pho-Step_logo.png" alt="PhoStep Logo" class="w-24 h-auto" />
        <div class="header__text">
          <h2 class="text-xl font-bold uppercase">PHOSTEP</h2>
          <p class="text-slate-400">Nơi những bước chân bắt đầu</p>
        </div>
      </router-link>
    </div>

    <!-- Navigation Menu -->
    <nav class="hidden lg:flex items-center space-x-8">
      <router-link 
        to="/" 
        class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
        :class="{ 'text-primary-600 font-semibold': $route.name === 'home' }"
      >
        Trang chủ
      </router-link>
      <router-link 
        to="/products" 
        class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
        :class="{ 'text-primary-600 font-semibold': $route.name === 'products' }"
      >
        Sản phẩm
      </router-link>
      <router-link 
        to="/discounts" 
        class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
        :class="{ 'text-primary-600 font-semibold': $route.name === 'discounts' }"
      >
        Giảm giá
      </router-link>
      <router-link 
        to="/orders" 
        class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
        :class="{ 'text-primary-600 font-semibold': $route.name === 'orders' }"
      >
        Đơn hàng
      </router-link>
      <router-link 
        to="/support" 
        class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
        :class="{ 'text-primary-600 font-semibold': $route.name === 'support' }"
      >
        Hỗ trợ
      </router-link>
    </nav>

    <div class="flex items-center gap-4">
      <!-- Mobile menu button -->
      <button 
        @click="toggleMobileMenu"
        class="lg:hidden p-2 text-gray-600 hover:text-gray-800"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <ul class="flex items-center gap-10 header__list" v-auto-animate>
        <!-- <router-link
          to="/favorites"
          class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <img src="/heart.svg" alt="Yêu thích" />
          <span v-if="!isDeviceMobile">Yêu thích</span>
        </router-link> -->

        <!-- Account Dropdown -->
        <div class="relative">
          <button
            @click="toggleAccountDropdown"
            class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer"
          >
            <img src="/profile.svg" alt="Tài khoản" />
            <span v-if="!isDeviceMobile">{{ displayName }}</span>
            <svg v-if="!isDeviceMobile" class="w-4 h-4 ml-1 transition-transform" :class="{ 'rotate-180': isAccountDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="isAccountDropdownOpen" 
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            @click.stop
          >
            <div class="py-2">
              <!-- Guest User Options -->
              <div v-if="!currentUser.isLoggedIn" class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm text-gray-600">Chưa đăng nhập</p>
              </div>
              
              <router-link 
                v-if="!currentUser.isLoggedIn"
                to="/auth" 
                @click="closeAccountDropdown"
                class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Đăng nhập / Đăng ký
              </router-link>
              
              <!-- Logged In User Options -->
              <div v-if="currentUser.isLoggedIn">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-800">Xin chào, {{ currentUser.fullName }}!</p>
                  <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                </div>
                
                <router-link 
                  to="/account/overview" 
                  @click="closeAccountDropdown"
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                  </svg>
                  Tổng quan
                </router-link>
                
                <router-link 
                  to="/account/purchase-history" 
                  @click="closeAccountDropdown"
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  Lịch sử mua hàng
                </router-link>
                
                <router-link 
                  to="/account/profile" 
                  @click="closeAccountDropdown"
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Thông tin tài khoản
                </router-link>
                
                <router-link 
                  to="/account/feedback" 
                  @click="closeAccountDropdown"
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Góp ý - Phản hồi
                </router-link>
                
                <div class="border-t border-gray-100 mt-2">
                  <button 
                    @click="closeAccountDropdown"
                    class="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <li
          v-auto-animate
          @click="() => emit('openDrawer')"
          class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <img src="/cart.svg" alt="Giỏ hàng" />
          <b v-if="!isDeviceMobile">{{ formatCurrency(totalPrice) }}</b>
        </li>
      </ul>
    </div>
  </header>

  <!-- Mobile Navigation Menu -->
  <div 
    v-if="isMobileMenuOpen" 
    class="lg:hidden bg-white border-b border-slate-200 shadow-md"
    v-auto-animate
  >
    <nav class="px-4 py-4 space-y-2">
      <router-link 
        to="/" 
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md font-medium transition-colors"
        :class="{ 'text-primary-600 bg-primary-50': $route.name === 'home' }"
      >
        Trang chủ
      </router-link>
      <router-link 
        to="/products" 
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md font-medium transition-colors"
        :class="{ 'text-primary-600 bg-primary-50': $route.name === 'products' }"
      >
        Sản phẩm
      </router-link>
      <router-link 
        to="/discounts" 
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md font-medium transition-colors"
        :class="{ 'text-primary-600 bg-primary-50': $route.name === 'discounts' }"
      >
        Giảm giá
      </router-link>
      <router-link 
        to="/orders" 
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md font-medium transition-colors"
        :class="{ 'text-primary-600 bg-primary-50': $route.name === 'orders' }"
      >
        Đơn hàng
      </router-link>
      <router-link 
        to="/support" 
        @click="isMobileMenuOpen = false"
        class="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md font-medium transition-colors"
        :class="{ 'text-primary-600 bg-primary-50': $route.name === 'support' }"
      >
        Hỗ trợ
      </router-link>
    </nav>
  </div>
</template>

<style lang="scss">
.header {
  position: sticky;
  background: #fff; /* Có thể đổi thành bg-secondary hoặc màu phostep-bg-light */
  top: 0;
  z-index: 2;
}

@media screen and (max-width: 1200px) {
  .header {
    a {
      margin-bottom: 10px;
      text-align: left;
    }

    .header__list {
      justify-content: flex-end;

      align-items: center;
      a {
        margin-bottom: 0px;
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .header__text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>