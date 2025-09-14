<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:w-80 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-8">
            <!-- User Profile Section -->
            <div class="text-center mb-8 pb-8 border-b border-gray-200">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-1">Nguyễn Văn A</h3>
              <p class="text-gray-600 text-sm">user@example.com</p>
              <div class="flex items-center justify-center mt-3">
                <div class="flex items-center justify-center w-3 h-3 bg-green-500 rounded-full mr-2">
                  <div class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                </div>
                <span class="text-green-700 text-sm font-medium">Tài khoản đã xác thực</span>
              </div>
            </div>
            
            <!-- Navigation Menu -->
            <nav class="space-y-3">
              <router-link 
                to="/account/overview" 
                class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold border border-blue-200': $route.name === 'account-overview' }"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Tổng quan</div>
                  <div class="text-xs text-gray-500">Thống kê tài khoản</div>
                </div>
              </router-link>
              
              <router-link 
                to="/account/purchase-history" 
                class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold border border-blue-200': $route.name === 'account-purchase-history' }"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Lịch sử mua hàng</div>
                  <div class="text-xs text-gray-500">Đơn hàng đã đặt</div>
                </div>
              </router-link>
              
              <router-link 
                to="/account/profile" 
                class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold border border-blue-200': $route.name === 'account-profile' }"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Thông tin tài khoản</div>
                  <div class="text-xs text-gray-500">Hồ sơ & địa chỉ</div>
                </div>
              </router-link>
              
              <router-link 
                to="/account/feedback" 
                class="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold border border-blue-200': $route.name === 'account-feedback' }"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-blue-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Góp ý - Phản hồi</div>
                  <div class="text-xs text-gray-500">Hỗ trợ khách hàng</div>
                </div>
              </router-link>
            </nav>
            
            <!-- Logout Button -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <button 
                class="flex items-center w-full px-4 py-3 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">Đăng xuất</div>
                  <div class="text-xs text-gray-500">Thoát tài khoản</div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="flex-1 min-w-0">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Account dashboard component logic
</script>

<style scoped>
/* Additional styles if needed */
</style>
