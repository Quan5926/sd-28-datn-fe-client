<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Lịch sử mua hàng</h1>
            <p class="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-4">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {{ filteredOrders.length }} đơn hàng
            </div>
            <button
              @click="refreshOrders"
              :disabled="isRefreshing"
              class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg 
                :class="isRefreshing ? 'animate-spin' : ''"
                class="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ isRefreshing ? 'Đang tải...' : 'Làm mới' }}
            </button>
            <div v-if="lastRefreshTime" class="text-xs text-gray-400">
              Cập nhật: {{ lastRefreshTime }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Tổng đơn</p>
              <p class="text-lg font-semibold text-gray-900">{{ quickStats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Hoàn thành</p>
              <p class="text-lg font-semibold text-green-600">{{ quickStats.completed }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Đang xử lý</p>
              <p class="text-lg font-semibold text-yellow-600">{{ quickStats.processing }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-500">Đã hủy</p>
              <p class="text-lg font-semibold text-red-600">{{ quickStats.cancelled }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Filter & Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <!-- Filter Tabs -->
            <div class="flex flex-wrap gap-1">
              <button v-for="status in filterOptions.slice(0, 5)" :key="status.value" @click="activeFilter = status.value"
                :class="activeFilter === status.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center">
                {{ status.label }}
                <span v-if="getOrderCountByStatus(status.value) > 0"
                  :class="activeFilter === status.value ? 'bg-primary-400' : 'bg-gray-300'"
                  class="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white">
                  {{ getOrderCountByStatus(status.value) }}
                </span>
              </button>
            </div>

            <!-- Search & Sort -->
            <div class="flex items-center space-x-3">
              <!-- Compact Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm kiếm..."
                  class="w-40 pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                >
                <svg class="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              
              <!-- Compact Sort -->
              <div class="relative">
                <select 
                  v-model="sortBy"
                  class="appearance-none bg-gray-50 px-3 py-1.5 pr-7 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent min-w-[100px]"
                >
                  <option value="date-desc">Mới nhất</option>
                  <option value="date-asc">Cũ nhất</option>
                  <option value="amount-desc">Giá cao</option>
                  <option value="amount-asc">Giá thấp</option>
                </select>
                <svg class="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center space-x-4">
              <div class="bg-gray-200 rounded-lg w-12 h-12"></div>
              <div>
                <div class="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div class="text-right">
              <div class="h-6 bg-gray-200 rounded w-20 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div class="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div v-for="order in paginatedOrders" :key="order.id"
          class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 mb-6">
              <div class="flex items-start space-x-4">
                <div
                  class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 group-hover:from-primary-100 group-hover:to-primary-200 transition-colors">
                  <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <h3 class="text-lg font-bold text-gray-900">Đơn hàng #{{ order.ma || order.id }}</h3>
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {{ order.orderType || 'Online' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Compact Order Info -->
                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 0v4m-4 4h8m-4-8h4m-4 4h4"></path>
                      </svg>
                      <span>{{ order.date }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>{{ order.customerName }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <span>{{ order.items.length }} sản phẩm</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-left lg:text-right">
                <span :class="getStatusClass(order.status)"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mb-3">
                  <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(order.status)"></span>
                  {{ getStatusText(order.status) }}
                </span>
                
                <!-- Compact Total -->
                <div class="text-center">
                  <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(order.total) }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    <span v-if="order.discount > 0" class="line-through mr-2">{{ formatCurrency(order.subtotal + (order.shippingFee || 0)) }}</span>
                    {{ order.items.length }} sản phẩm
                  </p>
                </div>
              </div>
            </div>

            <!-- Compact Items Preview -->
            <div class="bg-gray-50 rounded-lg p-3 mb-4">
              <div class="flex items-center justify-between mb-2">
                <h6 class="text-sm font-medium text-gray-700">Sản phẩm ({{ order.items.length }})</h6>
                <button 
                  v-if="order.items.length > 3"
                  @click="toggleOrderDetails(order.id)"
                  class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Xem tất cả
                </button>
              </div>
              
              <!-- Items Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div v-for="item in order.items.slice(0, 3)" :key="item.id"
                  class="flex items-center space-x-2 p-2 bg-white rounded border border-gray-100">
                  <div class="relative flex-shrink-0">
                    <img 
                      :src="item.anhSanPham || item.image || '/images/default-product.jpg'" 
                      :alt="item.tenSanPham || item.name" 
                      class="w-10 h-10 object-cover rounded"
                      @error="$event.target.src='/images/default-product.jpg'"
                    >
                    <span class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs px-1 rounded-full text-[10px] font-medium min-w-[16px] h-4 flex items-center justify-center">
                      {{ item.soLuong || item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-900 truncate">{{ item.tenSanPham || item.name }}</p>
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      <span v-if="item.mauSac" class="inline-block w-3 h-3 rounded-full border border-gray-200" 
                            :style="{ backgroundColor: getColorCode(item.mauSac) }" 
                            :title="item.mauSac">
                      </span>
                      <span v-if="item.kichCo" class="text-[10px] text-gray-500 bg-gray-100 px-1 rounded">
                        {{ item.kichCo }}
                      </span>
                    </div>
                    <p class="text-xs font-semibold text-primary-600 mt-0.5">{{ formatCurrency(item.thanhTien || item.price) }}</p>
                  </div>
                </div>
                
                <!-- More Items Indicator -->
                <div v-if="order.items.length > 3"
                  class="flex items-center justify-center p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded border-2 border-dashed border-gray-300 cursor-pointer hover:from-primary-50 hover:to-primary-100 hover:border-primary-300 transition-all"
                  @click="toggleOrderDetails(order.id)">
                  <div class="text-center">
                    <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-1">
                      <svg class="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <p class="text-[10px] text-gray-600 font-medium">+{{ order.items.length - 3 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Compact Progress -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Tiến độ</span>
                <span class="text-primary-600 font-medium">{{ getProgressText(order.status) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div :class="getProgressBarClass(order.status)" :style="{ width: getProgressWidth(order.status) }"
                  class="h-2 rounded-full transition-all duration-500 ease-out">
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <button @click="toggleOrderDetails(order.id)"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center transition-all hover:bg-primary-50 px-3 py-2 rounded-lg">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                  </path>
                </svg>
                {{ expandedOrders.includes(order.id) ? 'Thu gọn chi tiết' : 'Xem chi tiết' }}
              </button>
              <div class="flex flex-wrap gap-2">
                <button v-if="order.status === 'delivered' || order.status === 5"
                  class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2.5 rounded-lg transition-all text-sm font-medium flex items-center shadow-sm hover:shadow-md"
                  @click="reorderItems(order)">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                  Mua lại
                </button>
                <button v-else-if="order.status === 'shipped' || order.status === 4"
                  class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg transition-all text-sm font-medium flex items-center shadow-sm hover:shadow-md"
                  @click="trackOrder(order)">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Theo dõi
                </button>
                <button v-else-if="order.status === 6"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium cursor-not-allowed"
                  disabled>
                  Đã hủy
                </button>
                <button v-else
                  class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium">
                  Chờ xử lý
                </button>
                <button
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center"
                  @click="contactSupport(order)">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                  </svg>
                  Hỗ trợ
                </button>
              </div>
            </div>
          </div>

          <!-- Expanded Order Details -->
          <div v-if="expandedOrders.includes(order.id)" class="border-t border-gray-200 bg-gray-50">
            <div class="p-6">
              <!-- All Items -->
              <div class="mb-6">
                <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Tất cả sản phẩm ({{ order.items.length }})
                </h5>
                <div class="space-y-4">
                  <div 
                    v-for="item in order.items" 
                    :key="item.id"
                    class="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div class="flex-shrink-0">
                      <img 
                        :src="item.anhSanPham || item.image || '/images/default-product.jpg'" 
                        :alt="item.tenSanPham || item.name"
                        class="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        @error="$event.target.src='/images/default-product.jpg'"
                      >
                    </div>
                    <div class="flex-1">
                      <h6 class="text-lg font-semibold text-gray-900 mb-1">{{ item.tenSanPham || item.name }}</h6>
                      <p class="text-sm text-gray-600 mb-2">Mã: {{ item.maSanPham || item.code || 'N/A' }}</p>
                      
                      <!-- Product Details -->
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span v-if="item.mauSac" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ item.mauSac }}
                        </span>
                        <span v-if="item.kichCo" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Size {{ item.kichCo }}
                        </span>
                        <span v-if="item.thuongHieu" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {{ item.thuongHieu }}
                        </span>
                        <span v-if="item.chatLieu" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {{ item.chatLieu }}
                        </span>
                      </div>
                      
                      <!-- Quantity and Price -->
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-600">
                          <span class="font-medium">Số lượng:</span> {{ item.soLuong || item.quantity }}
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-500">{{ formatCurrency(item.giaBan || item.price) }} x {{ item.soLuong || item.quantity }}</p>
                          <p class="text-lg font-bold text-primary-600">{{ formatCurrency(item.thanhTien || (item.price * item.quantity)) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Shipping & Contact Info -->
                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <h6 class="font-medium text-gray-900 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Thông tin giao hàng
                    </h6>
                    <div class="space-y-2 text-sm">
                      <div>
                        <p class="text-gray-600 mb-1">Khách hàng:</p>
                        <p class="font-medium">{{ order.customerName }}</p>
                        <p class="text-gray-500">{{ order.customerPhone }}</p>
                      </div>
                      <div v-if="order.shipping">
                        <p class="text-gray-600 mb-1">Địa chỉ:</p>
                        <p class="font-medium">{{ order.shipping.address }}</p>
                      </div>
                      <div v-if="order.shipping?.trackingCode">
                        <p class="text-gray-600 mb-1">Mã vận đơn:</p>
                        <p class="font-medium text-primary-600">{{ order.shipping.trackingCode }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Summary -->
                  <div class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                    <h6 class="font-medium text-gray-900 mb-3">Chi tiết thanh toán</h6>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Tạm tính:</span>
                        <span class="font-medium">{{ formatCurrency(order.subtotal) }}</span>
                      </div>
                      <div v-if="order.shippingFee > 0" class="flex justify-between text-sm">
                        <span class="text-gray-600">Phí vận chuyển:</span>
                        <span class="font-medium">{{ formatCurrency(order.shippingFee) }}</span>
                      </div>
                      <div v-if="order.discount > 0" class="flex justify-between text-sm">
                        <span class="text-gray-600">Giảm giá:</span>
                        <span class="font-medium text-green-600">-{{ formatCurrency(order.discount) }}</span>
                      </div>
                      <div class="border-t border-primary-200 pt-2 flex justify-between">
                        <span class="font-bold text-gray-900">Tổng thanh toán:</span>
                        <span class="text-xl font-bold text-primary-600">{{ formatCurrency(order.total) }}</span>
                      </div>
                      <div v-if="order.note" class="pt-2 border-t border-primary-200">
                        <p class="text-gray-600 text-xs mb-1">Ghi chú:</p>
                        <p class="text-sm font-medium">{{ order.note }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Timeline -->
              <div class="mb-6">
                <h5 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Lịch sử đơn hàng
                </h5>
                <div class="space-y-4">
                  <div v-for="(timeline, index) in order.timeline" :key="index" class="flex items-start space-x-4">
                    <div class="flex flex-col items-center">
                      <div :class="timeline.completed ? 'bg-green-500' : 'bg-gray-300'" class="w-3 h-3 rounded-full">
                      </div>
                      <div v-if="index !== order.timeline.length - 1"
                        :class="timeline.completed ? 'bg-green-500' : 'bg-gray-300'" class="w-0.5 h-8 mt-2"></div>
                    </div>
                    <div class="flex-1 pb-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <h6 :class="timeline.completed ? 'text-green-700' : 'text-gray-600'" class="font-medium">
                            {{ timeline.title }}
                          </h6>
                          <p class="text-sm text-gray-500">{{ timeline.description }}</p>
                        </div>
                        <span class="text-sm text-gray-500">{{ timeline.time }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Shipping Info -->
              <div v-if="order.shipping" class="bg-white rounded-lg p-4 border border-gray-200">
                <h5 class="font-semibold text-gray-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Thông tin giao hàng
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Địa chỉ giao hàng:</p>
                    <p class="font-medium text-gray-900">{{ order.shipping.address }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Phương thức vận chuyển:</p>
                    <p class="font-medium text-gray-900">{{ order.shipping.method }}</p>
                  </div>
                  <div v-if="order.shipping.trackingCode">
                    <p class="text-gray-600">Mã vận đơn:</p>
                    <p class="font-medium text-primary-600">{{ order.shipping.trackingCode }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Phí vận chuyển:</p>
                    <p class="font-medium text-gray-900">{{ formatCurrency(order.shipping.fee) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <div class="flex space-x-1">
            <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
              :class="page === currentPage ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg transition-colors">
              {{ page }}
            </button>
          </div>

          <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <!-- Enhanced Empty State -->
    <div v-if="!loading && filteredOrders.length === 0" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <div class="text-gray-300 mb-6">
          <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          {{ activeFilter === 'all' ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng' }}
        </h3>
        <p class="text-gray-600 mb-8 leading-relaxed">
          {{activeFilter === 'all'
            ? 'Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!'
            : `Không có đơn hàng nào với trạng thái "${filterOptions.find(f => f.value === activeFilter)?.label}".`
          }}
        </p>
        <div class="space-y-3">
          <router-link 
            to="/products"
            class="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
          >  
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Mua sắm ngay
          </router-link>
          <div v-if="activeFilter !== 'all'">
            <button @click="activeFilter = 'all'" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Xem tất cả đơn hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { customerAPI } from '@/api/customerAPI'
import authService from '@/services/authService.js'
import { vnpayService } from '@/services/vnpayAPI.js'

// Filter and sort options
const activeFilter = ref('all')
const sortBy = ref('date-desc')
const expandedOrders = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Advanced features
const isRefreshing = ref(false)
const lastRefreshTime = ref(null)

// Route and toast for success messages
const route = useRoute()
const toast = useToast()

// Updated filter options to match admin status mapping (0-6)
const filterOptions = ref([
  { value: 'all', label: 'Tất cả' },
  { value: 0, label: 'Hóa đơn chờ' },
  { value: 1, label: 'Chờ xác nhận' },
  { value: 2, label: 'Chờ xử lý' },
  { value: 3, label: 'Chờ vận chuyển' },
  { value: 4, label: 'Đang vận chuyển' },
  { value: 5, label: 'Đã hoàn thành' },
  { value: 6, label: 'Đã hủy' }
])

// Orders data from API
const orders = ref([])

// Load customer order history
const loadOrderHistory = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Check authentication
    if (!authService.isAuthenticated()) {
      error.value = 'Vui lòng đăng nhập để xem lịch sử đơn hàng'
      loading.value = false
      return
    }
    
    const response = await customerAPI.getOrderHistory(0, 50) // Load all orders
    
    if (response && response.success && response.data) {
      // Handle paginated response
      let orderData = response.data.data?.content || response.data.content || []
      
      // Filter out "Hóa đơn chờ" (status 0)
      orderData = orderData.filter(order => order.trangThai !== 0)
      
      if (Array.isArray(orderData) && orderData.length > 0) {
        // Process orders with real items from backend
        orders.value = orderData.map(order => {
          
          return {
            id: order.id,
            ma: order.ma,
            date: order.ngayTao ? new Date(order.ngayTao).toLocaleDateString('vi-VN') : 'N/A',
            rawDate: order.ngayTao ? new Date(order.ngayTao) : new Date(0), // Raw date for sorting
            status: mapBackendStatus(order.trangThai),
            total: order.tongTienSauGiam || order.tongTien || 0,
            subtotal: order.tongTien || 0,
            shippingFee: order.phiVanChuyen || 0,
            discount: (order.tongTien || 0) - (order.tongTienSauGiam || 0),
            customerName: order.tenKhachHang || 'N/A',
            customerPhone: order.soDienThoaiKhachHang || 'N/A',
            customerEmail: order.email || 'N/A',
            note: order.ghiChu || '',
            orderType: order.loaiDon || 'Online',
            // Use real items from backend or fallback
            items: order.items && order.items.length > 0 ? order.items : [
              {
                id: 1,
                name: `Sản phẩm trong đơn hàng ${order.ma}`,
                tenSanPham: `Sản phẩm trong đơn hàng ${order.ma}`,
                details: `Tổng tiền: ${formatCurrency(order.tongTienSauGiam || order.tongTien || 0)}`,
                image: '/sneakers/sneakers-1-alt1.jpg',
                anhSanPham: '/sneakers/sneakers-1-alt1.jpg',
                quantity: 1,
                soLuong: 1,
                price: order.tongTienSauGiam || order.tongTien || 0,
                giaBan: order.tongTienSauGiam || order.tongTien || 0,
                thanhTien: order.tongTienSauGiam || order.tongTien || 0
              }
            ],
            timeline: generateTimeline(order.trangThai),
            shipping: {
              address: order.diaChiKhachHang || 'Chưa có thông tin',
              method: 'Giao hàng tiêu chuẩn',
              trackingCode: order.maVanDon || null,
              fee: order.phiVanChuyen || 0
            }
          }
        })
        
        console.log('Processed orders:', orders.value)
        toast.success(`Đã tải ${orders.value.length} đơn hàng`)
      } else {
        orders.value = []
        console.log('No orders found in response')
        toast.info('Bạn chưa có đơn hàng nào')
      }
    } else {
      console.error('Unexpected API response format:', response)
      error.value = 'Không thể tải dữ liệu đơn hàng'
      orders.value = []
    }  
  } catch (err) {
    console.error('Error loading order history:', err)
    error.value = 'Không thể tải lịch sử đơn hàng: ' + (err.response?.data?.message || err.message)
    
    // Show fallback data for testing
    orders.value = [
      {
        id: 'DH001234',
        date: '15/09/2024',
        status: 'delivered',
        total: 2500000,
        customerName: 'Khách hàng mẫu',
        customerPhone: '0123456789',
        items: [
          {
            id: 1,
            name: 'Nike Air Max 270',
            details: 'Size: 42, Màu: Đen',
            image: '/sneakers/sneakers-1-alt1.jpg',
            quantity: 1,
            price: 2500000
          }
        ],
        timeline: [
          {
            title: 'Đơn hàng đã được tạo',
            description: 'Đơn hàng của bạn đã được xác nhận',
            time: '15/09/2024 09:00',
            completed: true
          }
        ],
        shipping: {
          address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
          method: 'Giao hàng nhanh',
          trackingCode: 'VN123456789',
          fee: 30000
        }
      }
    ]
    
    toast.warning('Đang hiển thị dữ liệu mẫu do lỗi kết nối API')
  } finally {
    loading.value = false
  }
}

// Load order items details
const loadOrderItems = async (orderId) => {
  try {
    console.log('Loading detailed items for order:', orderId)
    const response = await customerAPI.getOrderDetails(orderId)
    console.log('Order details response:', response)
    
    if (response.success && response.data) {
      // Check if items exist in response
      if (response.data.items && Array.isArray(response.data.items) && response.data.items.length > 0) {
        return response.data.items.map(item => ({
          id: item.id,
          name: item.tenSanPham || item.name || 'Sản phẩm',
          details: `${item.tenMauSac || 'N/A'} - ${item.tenKichCo || 'N/A'}`,
          image: item.urlAnh || '/sneakers/sneakers-1-alt1.jpg',
          quantity: item.soLuong || 1,
          price: item.donGia || item.giaBan || 0
        }))
      } else {
        // If no items in response, return enhanced default item
        const order = response.data.order
        return [
          {
            id: 1,
            name: `Đơn hàng ${orderId}`,
            details: order ? `Trạng thái: ${getStatusText(order.trangThai)}` : 'Chi tiết sản phẩm',
            image: '/sneakers/sneakers-1-alt1.jpg',
            quantity: 1,
            price: order ? (order.tongTienSauGiam || order.tongTien || 0) : 0
          }
        ]
      }
    }
  } catch (err) {
    console.error('Error loading order items:', err)
    toast.warning('Không thể tải chi tiết sản phẩm từ server')
  }
  
  // Fallback item
  return [
    {
      id: 1,
      name: `Đơn hàng ${orderId}`,
      details: 'Chi tiết sản phẩm tạm thời không khả dụng',
      image: '/sneakers/sneakers-1-alt1.jpg',
      quantity: 1,
      price: 0
    }
  ]
}

// Map backend status to frontend status
const mapBackendStatus = (backendStatus) => {
  // Keep numeric status for proper filtering
  return backendStatus
}

// Generate timeline based on status
const generateTimeline = (status) => {
  const baseTimeline = [
    {
      title: 'Đơn hàng đã được tạo',
      description: 'Đơn hàng của bạn đã được xác nhận',
      time: new Date().toLocaleDateString('vi-VN'),
      completed: true
    }
  ]

  if (status >= 2) {
    baseTimeline.push({
      title: 'Đang chuẩn bị hàng',
      description: 'Sản phẩm đang được đóng gói',
      time: new Date().toLocaleDateString('vi-VN'),
      completed: true
    })
  }

  if (status >= 4) {
    baseTimeline.push({
      title: 'Đang vận chuyển',
      description: 'Đơn hàng đang được giao',
      time: new Date().toLocaleDateString('vi-VN'),
      completed: true
    })
  }

  if (status === 5) {
    baseTimeline.push({
      title: 'Đã giao thành công',
      description: 'Đơn hàng đã được giao đến địa chỉ',
      time: new Date().toLocaleDateString('vi-VN'),
      completed: true
    })
  }
  
  return baseTimeline
}

// Test API connection
const testAPI = async () => {
  try {
    console.log('Testing API connection...')
    console.log('User authenticated:', authService.isAuthenticated())
    console.log('User info:', customerAPI.getCurrentUser())
    console.log('TaiKhoan ID:', customerAPI.getTaiKhoanId())
    
    // Test debug endpoint
    const debugResponse = await customerAPI.getOverview()
    console.log('Debug API response:', debugResponse)
    
  } catch (err) {
    console.error('API test failed:', err)
  }
}

// Handle VNPay return from URL parameters
const handleVNPayReturn = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const vnpayResult = vnpayService.handleVNPayReturn(urlParams)
  
  if (vnpayResult) {
    if (vnpayResult.success) {
      toast.success(vnpayResult.message, {
        timeout: 5000,
        position: 'top-center'
      })
      
      // Reload order history to show the new order
      setTimeout(() => {
        loadOrderHistory()
      }, 1000)
    } else {
      toast.error(vnpayResult.message, {
        timeout: 5000,
        position: 'top-center'
      })
    }
    
    // Clean up URL parameters
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, document.title, cleanUrl)
  }
}

// Initialize data
onMounted(() => {
  // Handle VNPay return callback
  handleVNPayReturn()
  
  // Test API first
  testAPI()
  
  // Load order history
  loadOrderHistory()
  
  // Check for success message from checkout redirect
  if (route.query.status === 'success') {
    const paymentMethod = route.query.paymentMethod
    const orderId = route.query.orderId
    
    if (paymentMethod === 'VNPAY') {
      toast.success('Thanh toán VNPay thành công! Đơn hàng đã được xác nhận.')
    } else if (paymentMethod === 'COD') {
      toast.success('Đặt hàng thành công! Đơn hàng sẽ được giao trong thời gian sớm nhất.')
    } else {
      toast.success('Đặt hàng thành công!')
    }
    
    if (orderId) {
      console.log('New order created:', orderId)
      // Optionally highlight the new order
    }
  }
})

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(order =>
      order.id.toString().toLowerCase().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.customerPhone?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeFilter.value)
  }

  // Sort orders using rawDate for accurate sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return b.rawDate - a.rawDate // Newest first
      case 'date-asc':
        return a.rawDate - b.rawDate // Oldest first
      case 'amount-desc':
        return b.total - a.total
      case 'amount-asc':
        return a.total - b.total
      default:
        return b.rawDate - a.rawDate // Default to newest first
    }
  })

  return filtered
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const range = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (total > 1) {
    range.push(total)
  }

  return range.filter((item, index, arr) => arr.indexOf(item) === index)
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Get color code for color display
const getColorCode = (colorName) => {
  const colorMap = {
    'Đỏ': '#ef4444',
    'Xanh': '#3b82f6', 
    'Vàng': '#eab308',
    'Đen': '#1f2937',
    'Trắng': '#f9fafb',
    'Xám': '#6b7280',
    'Hồng': '#ec4899',
    'Tím': '#8b5cf6',
    'Cam': '#f97316',
    'Nâu': '#a3a3a3',
    'Xanh lá': '#22c55e',
    'Xanh dương': '#3b82f6'
  }
  return colorMap[colorName] || '#9ca3af'
}

const getStatusClass = (status) => {
  const classes = {
    0: 'bg-gray-100 text-gray-800',        // Hóa đơn chờ
    1: 'bg-warning-100 text-warning-800',  // Chờ xác nhận
    2: 'bg-primary-100 text-primary-800',  // Chờ xử lý
    3: 'bg-secondary-100 text-secondary-800', // Chờ vận chuyển
    4: 'bg-primary-100 text-primary-800',  // Đang vận chuyển
    5: 'bg-success-100 text-success-800',  // Đã hoàn thành
    6: 'bg-accent-100 text-accent-800',    // Đã hủy
    // Legacy support for old string-based statuses
    'delivered': 'bg-success-100 text-success-800',
    'shipped': 'bg-primary-100 text-primary-800',
    'processing': 'bg-warning-100 text-warning-800',
    'cancelled': 'bg-accent-100 text-accent-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusDotClass = (status) => {
  const classes = {
    0: 'bg-gray-500',        // Hóa đơn chờ
    1: 'bg-warning-500',     // Chờ xác nhận
    2: 'bg-primary-500',     // Chờ xử lý
    3: 'bg-secondary-500',   // Chờ vận chuyển
    4: 'bg-primary-500',     // Đang vận chuyển
    5: 'bg-success-500',     // Đã hoàn thành
    6: 'bg-accent-500',      // Đã hủy
    // Legacy support
    'delivered': 'bg-success-500',
    'shipped': 'bg-primary-500',
    'processing': 'bg-warning-500',
    'cancelled': 'bg-accent-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    0: 'Hóa đơn chờ',
    1: 'Chờ xác nhận',
    2: 'Chờ xử lý',
    3: 'Chờ vận chuyển',
    4: 'Đang vận chuyển',
    5: 'Đã hoàn thành',
    6: 'Đã hủy',
    // Legacy support
    'delivered': 'Đã hoàn thành',
    'shipped': 'Đang vận chuyển',
    'processing': 'Chờ xử lý',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const getProgressText = (status) => {
  const texts = {
    // Numeric status (0-6) from backend
    0: 'Chờ xử lý',
    1: 'Chờ xác nhận', 
    2: 'Đang chuẩn bị',
    3: 'Chờ vận chuyển',
    4: 'Đang vận chuyển',
    5: 'Hoàn thành',
    6: 'Đã hủy',
    // Legacy string support
    'delivered': 'Hoàn thành',
    'shipped': 'Đang vận chuyển',
    'processing': 'Đang chuẩn bị',
    'cancelled': 'Đã hủy'
  }
  return texts[status] || 'Không xác định'
}

const getProgressBarClass = (status) => {
  const classes = {
    // Numeric status (0-6) from backend
    0: 'bg-gray-400',      // Hóa đơn chờ
    1: 'bg-yellow-400',    // Chờ xác nhận
    2: 'bg-yellow-500',    // Chờ xử lý
    3: 'bg-blue-400',      // Chờ vận chuyển
    4: 'bg-blue-500',      // Đang vận chuyển
    5: 'bg-green-500',     // Đã hoàn thành
    6: 'bg-red-500',       // Đã hủy
    // Legacy string support
    'delivered': 'bg-green-500',
    'shipped': 'bg-blue-500',
    'processing': 'bg-yellow-500',
    'cancelled': 'bg-red-500'
  }
  return classes[status] || 'bg-gray-500'
}

const getProgressWidth = (status) => {
  const widths = {
    // Numeric status (0-6) from backend with logical progression
    0: '10%',     // Hóa đơn chờ - 10%
    1: '20%',     // Chờ xác nhận - 20%
    2: '40%',     // Chờ xử lý - 40%
    3: '60%',     // Chờ vận chuyển - 60%
    4: '80%',     // Đang vận chuyển - 80%
    5: '100%',    // Đã hoàn thành - 100%
    6: '0%',      // Đã hủy - 0%
    // Legacy string support
    'delivered': '100%',
    'shipped': '75%',
    'processing': '25%',
    'cancelled': '0%'
  }
  return widths[status] || '0%'
}

const getOrderCountByStatus = (status) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

const toggleOrderDetails = async (orderId) => {
  const index = expandedOrders.value.indexOf(orderId)
  if (index > -1) {
    expandedOrders.value.splice(index, 1)
  } else {
    expandedOrders.value.push(orderId)
    
    // Load detailed items when expanding for the first time
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.items.length === 1 && order.items[0].name.includes('Sản phẩm trong đơn hàng')) {
      try {
        console.log('Loading detailed items for order:', orderId)
        const detailedItems = await loadOrderItems(orderId)
        order.items = detailedItems
      } catch (err) {
        console.error('Error loading detailed items:', err)
        toast.error('Không thể tải chi tiết sản phẩm')
      }
    }
  }
}

// New action methods
const handleImageError = (event) => {
  event.target.src = '/sneakers/sneakers-1-alt1.jpg' // Fallback image
}

const reorderItems = (order) => {
  toast.info('Chức năng mua lại đang được phát triển')
  // TODO: Implement reorder functionality
  console.log('Reordering items for order:', order.id)
}

const trackOrder = (order) => {
  if (order.shipping?.trackingCode) {
    toast.info(`Mã vận đơn: ${order.shipping.trackingCode}`)
  } else {
    toast.info('Chưa có thông tin vận chuyển')
  }
  // TODO: Implement order tracking
  console.log('Tracking order:', order.id)
}

const contactSupport = (order) => {
  toast.info('Đang chuyển hướng đến trang hỗ trợ...')
  // TODO: Implement support contact
  console.log('Contacting support for order:', order.id)
}

// Refresh orders
const refreshOrders = async () => {
  isRefreshing.value = true
  try {
    await loadOrderHistory()
    lastRefreshTime.value = new Date().toLocaleTimeString('vi-VN')
    toast.success('Đã cập nhật danh sách đơn hàng')
  } catch (err) {
    toast.error('Không thể làm mới danh sách đơn hàng')
  } finally {
    isRefreshing.value = false
  }
}

// Export orders to CSV
const exportToCSV = () => {
  if (filteredOrders.value.length === 0) {
    toast.warning('Không có dữ liệu để xuất')
    return
  }
  
  const headers = ['Mã đơn hàng', 'Ngày tạo', 'Trạng thái', 'Tổng tiền', 'Khách hàng', 'SĐT']
  const csvContent = [
    headers.join(','),
    ...filteredOrders.value.map(order => [
      order.id,
      order.date,
      getStatusText(order.status),
      order.total,
      order.customerName,
      order.customerPhone
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `don-hang-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.success('Đã xuất file CSV thành công')
}

// Quick stats
const quickStats = computed(() => {
  const total = orders.value.length
  const completed = orders.value.filter(o => o.status === 'delivered' || o.status === 5).length
  const processing = orders.value.filter(o => ['processing', 1, 2, 3, 4].includes(o.status)).length
  const cancelled = orders.value.filter(o => o.status === 'cancelled' || o.status === 6).length
  
  return { total, completed, processing, cancelled }
})

// Watch for filter changes to reset pagination
watch([activeFilter, searchQuery], () => {
  currentPage.value = 1
})

// Auto refresh every 5 minutes
let refreshInterval = null
onMounted(() => {
  refreshInterval = setInterval(() => {
    if (!loading.value && !isRefreshing.value) {
      refreshOrders()
    }
  }, 5 * 60 * 1000) // 5 minutes
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
