<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-primary-700 mb-4 font-josefin-sans">Tra cứu đơn hàng</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Nhập mã đơn hàng để kiểm tra tình trạng và thông tin chi tiết đơn hàng của bạn
        </p>
      </div>

      <!-- Logged-in Customer: Order History -->
      <div v-if="isLoggedIn" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Lịch sử đơn hàng của bạn</h2>
          <p class="text-gray-600">Tất cả đơn hàng bạn đã đặt</p>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Đang tải đơn hàng...</p>
        </div>
        
        <div v-else-if="customerOrders.length > 0" class="space-y-6">
          <div 
            v-for="(order, index) in customerOrders" 
            :key="order.id"
            :id="`order-${order.id}`"
            :class="[
              'bg-white border rounded-xl overflow-hidden transition-all duration-200 relative',
              {
                // Newest order styling
                'border-green-300 shadow-lg ring-2 ring-green-100': index === 0 && customerOrders.length > 1,
                'border-gray-200': !(index === 0 && customerOrders.length > 1),
                // Expanded order styling
                'shadow-lg bg-gray-50': expandedOrder === order.id,
                'hover:shadow-lg': expandedOrder !== order.id
              }
            ]"
          >
            <!-- "Mới nhất" badge for first order -->
            <div v-if="index === 0 && customerOrders.length > 1" 
                 class="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Mới nhất
            </div>
            <!-- Order Header -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div class="mb-4 sm:mb-0">
                  <h3 class="text-xl font-bold text-gray-900 mb-1">{{ order.orderNumber || order.ma }}</h3>
                  <div class="flex items-center text-sm text-gray-600 space-x-4">
                    <span>{{ order.orderDate }}</span>
                    <span>•</span>
                    <span>{{ order.customerName || order.tenKhachHang }}</span>
                  </div>
                </div>
                <div class="flex flex-col sm:items-end">
                  <span 
                    :class="getStatusClass(order.status)"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                  <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(order.total || order.tongTienSauGiam) }}</p>
                </div>
              </div>
            </div>

            <!-- Order Items Preview -->
            <div v-if="order.items && order.items.length > 0" class="p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Sản phẩm ({{ order.items.length }})</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="item in order.items.slice(0, 2)" 
                  :key="item.id"
                  class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img 
                    :src="item.anhSanPham || '/images/default-product.jpg'" 
                    :alt="item.tenSanPham"
                    class="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    @error="$event.target.src='/images/default-product.jpg'"
                  >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.tenSanPham }}</p>
                    <div class="flex items-center space-x-2 text-xs text-gray-500">
                      <span v-if="item.mauSac">{{ item.mauSac }}</span>
                      <span v-if="item.mauSac && item.kichCo">•</span>
                      <span v-if="item.kichCo">Size {{ item.kichCo }}</span>
                    </div>
                    <p class="text-xs text-gray-600">SL: {{ item.soLuong }} - {{ formatCurrency(item.giaBan) }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Show more items indicator -->
              <div v-if="order.items.length > 2" class="mt-3 text-center">
                <span class="text-sm text-gray-500">và {{ order.items.length - 2 }} sản phẩm khác</span>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  <span>Địa chỉ: {{ order.shippingAddress || order.diaChiKhachHang }}</span>
                </div>
                <button 
                  @click="toggleOrderDetails(order.id)"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <svg 
                    class="w-4 h-4 mr-2 transition-transform duration-200" 
                    :class="{ 'rotate-180': expandedOrder === order.id }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  {{ expandedOrder === order.id ? 'Thu gọn' : 'Xem chi tiết' }}
                </button>
              </div>
            </div>
            
            <!-- Expanded Order Details -->
            <div 
              v-if="expandedOrder === order.id" 
              class="border-t border-gray-200 bg-white animate-fadeIn"
            >
              <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <!-- Customer Info -->
                  <div class="space-y-4">
                    <h4 class="font-semibold text-gray-900 text-lg">Thông tin khách hàng</h4>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Tên khách hàng:</span>
                        <span class="font-medium">{{ order.tenKhachHang || order.customerName }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Số điện thoại:</span>
                        <span class="font-medium">{{ order.soDienThoaiKhachHang || order.phoneNumber }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Địa chỉ:</span>
                        <span class="font-medium text-right">{{ order.diaChiKhachHang || order.shippingAddress }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Order Summary -->
                  <div class="space-y-4">
                    <h4 class="font-semibold text-gray-900 text-lg">Tóm tắt đơn hàng</h4>
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Mã đơn hàng:</span>
                        <span class="font-medium">{{ order.ma || order.orderNumber }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Ngày đặt:</span>
                        <span class="font-medium">{{ order.orderDate }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Trạng thái:</span>
                        <span 
                          :class="getStatusClass(order.status || order.trangThai)"
                          class="px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {{ getStatusText(order.status || order.trangThai) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Order Items -->
                <div v-if="order.items && order.items.length > 0" class="mb-6">
                  <h4 class="font-semibold text-gray-900 text-lg mb-4">Sản phẩm đã đặt</h4>
                  <div class="space-y-4">
                    <div 
                      v-for="item in order.items" 
                      :key="item.id"
                      class="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <img 
                        :src="item.anhSanPham || '/images/default-product.jpg'" 
                        :alt="item.tenSanPham"
                        class="w-16 h-16 object-cover rounded-lg"
                        @error="$event.target.src='/images/default-product.jpg'"
                      >
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-900">{{ item.tenSanPham }}</h5>
                        <p class="text-sm text-gray-600">Mã: {{ item.maSanPham }}</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                          <span v-if="item.mauSac" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {{ item.mauSac }}
                          </span>
                          <span v-if="item.kichCo" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Size {{ item.kichCo }}
                          </span>
                          <span v-if="item.thuongHieu" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            {{ item.thuongHieu }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-gray-600">SL: {{ item.soLuong }}</p>
                        <p class="font-medium">{{ formatCurrency(item.giaBan) }}</p>
                        <p class="text-lg font-bold text-primary-600">{{ formatCurrency(item.thanhTien) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Total -->
                <div class="pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                    <span class="text-2xl font-bold text-primary-600">{{ formatCurrency(order.total || order.tongTienSauGiam) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
          <p class="text-gray-600 mb-6">Bạn chưa có đơn hàng nào.</p>
          <router-link 
            to="/products"
            class="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Mua sắm ngay
          </router-link>
        </div>
      </div>

      <!-- Guest User: Search Section -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <form @submit.prevent="searchOrder" class="space-y-6">
          <div>
            <label class="block text-lg font-semibold text-gray-900 mb-4">Mã đơn hàng *</label>
            <div class="relative">
              <input 
                v-model="orderCode"
                type="text" 
                required
                class="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white pl-14"
                placeholder="Nhập mã đơn hàng (VD: #DH001234)"
              >
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              Mã đơn hàng được gửi qua email sau khi đặt hàng thành công
            </p>
          </div>

          <div class="flex justify-center">
            <button 
              type="submit"
              :disabled="isSearching || !orderCode.trim()"
              class="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div class="flex items-center">
                <svg v-if="isSearching" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {{ isSearching ? 'Đang tìm kiếm...' : 'Tra cứu đơn hàng' }}
              </div>
            </button>
          </div>
        </form>
      </div>

      <!-- Search Results -->
      <div v-if="searchResult" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div v-if="searchResult.found" class="space-y-8">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ searchResult.order.orderNumber }}</h2>
              <p class="text-gray-600">Đặt hàng ngày {{ searchResult.order.orderDate }}</p>
            </div>
            <div class="mt-4 sm:mt-0">
              <span 
                :class="getStatusClass(searchResult.order.status)"
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
              >
                <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(searchResult.order.status)"></div>
                {{ getStatusText(searchResult.order.status) }}
              </span>
            </div>
          </div>

          <!-- Order Progress -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Tiến trình đơn hàng</h3>
            <div class="space-y-4">
              <div 
                v-for="(step, index) in searchResult.order.timeline" 
                :key="index"
                class="flex items-start"
              >
                <div class="flex-shrink-0 mr-4">
                  <div 
                    :class="step.completed ? 'bg-green-500' : 'bg-gray-300'"
                    class="w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    <svg v-if="step.completed" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 :class="step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'" class="text-sm">
                      {{ step.title }}
                    </h4>
                    <span v-if="step.date" class="text-xs text-gray-500">{{ step.date }}</span>
                  </div>
                  <p :class="step.completed ? 'text-gray-600' : 'text-gray-400'" class="text-xs mt-1">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Sản phẩm đã đặt</h3>
            <div class="space-y-4">
              <div 
                v-for="item in searchResult.order.items" 
                :key="item.id"
                class="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div class="flex-shrink-0">
                  <img 
                    :src="item.image || '/sneakers/sneakers-1-alt1.jpg'" 
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    @error="handleImageError"
                    @load="handleImageLoad"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ item.name }}</h4>
                      <p v-if="item.productCode" class="text-sm text-gray-600 mb-2">Mã: {{ item.productCode }}</p>
                      
                      <!-- Product Details -->
                      <div class="flex flex-wrap gap-2 mb-3">
                        <span v-if="item.details" class="text-sm text-gray-600">{{ item.details }}</span>
                      </div>
                      
                      <!-- Description -->
                      <p v-if="item.description" class="text-sm text-gray-500 mb-3 line-clamp-2">{{ item.description }}</p>
                      
                      <!-- Note -->
                      <p v-if="item.note" class="text-sm text-orange-600 mb-3">
                        <span class="font-medium">Ghi chú:</span> {{ item.note }}
                      </p>
                      
                      <!-- Quantity and Price -->
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-600">
                          <span class="font-medium">Số lượng:</span> {{ item.quantity }}
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-500">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
                          <p class="text-lg font-bold text-primary-600">{{ formatCurrency(item.price * item.quantity) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-6">
            <h3 class="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h3>
            
            <!-- Customer Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                <div class="space-y-2">
                  <p class="text-gray-600 text-sm"><span class="font-medium">Tên:</span> {{ searchResult.order.customerName }}</p>
                  <p class="text-gray-600 text-sm"><span class="font-medium">SĐT:</span> {{ searchResult.order.phoneNumber }}</p>
                  <p v-if="searchResult.order.email" class="text-gray-600 text-sm"><span class="font-medium">Email:</span> {{ searchResult.order.email }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Địa chỉ giao hàng</h4>
                <p class="text-gray-600 text-sm">{{ searchResult.order.shippingAddress }}</p>
              </div>
            </div>

            <!-- Order Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Chi tiết đơn hàng</h4>
                <div class="space-y-2">
                  <p class="text-gray-600 text-sm"><span class="font-medium">Loại đơn:</span> {{ searchResult.order.orderType }}</p>
                  <p v-if="searchResult.order.paymentDate" class="text-gray-600 text-sm"><span class="font-medium">Ngày thanh toán:</span> {{ searchResult.order.paymentDate }}</p>
                  <p v-if="searchResult.order.trackingNumber" class="text-gray-600 text-sm"><span class="font-medium">Mã vận đơn:</span> {{ searchResult.order.trackingNumber }}</p>
                  <p v-if="searchResult.order.note" class="text-gray-600 text-sm"><span class="font-medium">Ghi chú:</span> {{ searchResult.order.note }}</p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                <div class="space-y-2">
                  <p class="text-gray-600 text-sm"><span class="font-medium">Tiền sản phẩm:</span> {{ formatCurrency(searchResult.order.productAmount) }}</p>
                  <p class="text-gray-600 text-sm"><span class="font-medium">Phí vận chuyển:</span> {{ formatCurrency(searchResult.order.shippingFee) }}</p>
                  <p v-if="searchResult.order.discountCode" class="text-gray-600 text-sm"><span class="font-medium">Mã giảm giá:</span> {{ searchResult.order.discountCode }}</p>
                  <p class="text-gray-900 text-sm font-semibold"><span class="font-medium">Tổng tiền:</span> {{ formatCurrency(searchResult.order.totalAfterDiscount) }}</p>
                </div>
              </div>
            </div>

            <!-- Staff Info (if available) -->
            <div v-if="searchResult.order.staffName" class="border-t pt-4">
              <h4 class="font-medium text-gray-900 mb-2">Thông tin nhân viên xử lý</h4>
              <p class="text-gray-600 text-sm">{{ searchResult.order.staffName }} ({{ searchResult.order.staffCode }})</p>
            </div>
          </div>
        </div>

        <!-- Not Found State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
          <p class="text-gray-600 mb-6">Mã đơn hàng "{{ orderCode }}" không tồn tại hoặc đã bị xóa</p>
          <button 
            @click="resetSearch"
            class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-12 bg-blue-50 rounded-2xl p-8">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Cần hỗ trợ?</h3>
          <p class="text-gray-600 mb-6">
            Nếu bạn không tìm thấy mã đơn hàng hoặc cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:1900123456"
              class="flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              Hotline: 1900 123 456
            </a>
            <a 
              href="mailto:support@phostep.com"
              class="flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Email hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { customerAPI } from '@/api/customerAPI'
import authService from '@/services/authService.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const orderCode = ref('')
const isSearching = ref(false)
const searchResult = ref(null)
const customerOrders = ref([])
const loading = ref(false)
const expandedOrder = ref(null)
const toast = useToast()

// Check if user is logged in
const isLoggedIn = computed(() => authService.isAuthenticated())

// Sample order data for demonstration
const sampleOrders = [
  {
    orderNumber: '#DH001234',
    orderDate: '12/09/2024',
    status: 'delivered',
    total: 2500000,
    shippingAddress: '123 Nguyễn Văn Linh, Phường Tân Thuận Đông, Quận 7, TP.HCM',
    phoneNumber: '0901234567',
    trackingNumber: 'VN123456789',
    items: [
      {
        id: 1,
        name: 'Nike Air Max 270',
        details: 'Size: 42 | Màu: Đen',
        quantity: 1,
        price: 2500000,
        image: '/sneakers/sneakers-1-alt1.jpg'
      }
    ],
    timeline: [
      { title: 'Đặt hàng thành công', description: 'Đơn hàng đã được tạo', date: '12/09/2024 10:30', completed: true },
      { title: 'Xác nhận đơn hàng', description: 'Đơn hàng đã được xác nhận', date: '12/09/2024 14:20', completed: true },
      { title: 'Đang chuẩn bị hàng', description: 'Sản phẩm đang được đóng gói', date: '13/09/2024 09:15', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao', date: '14/09/2024 08:00', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng đã được giao thành công', date: '15/09/2024 16:45', completed: true }
    ]
  },
  {
    orderNumber: '#DH001235',
    orderDate: '10/09/2024',
    status: 'shipping',
    total: 3200000,
    shippingAddress: '456 Lê Văn Việt, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM',
    phoneNumber: '0907654321',
    trackingNumber: 'VN987654321',
    items: [
      {
        id: 2,
        name: 'Adidas Ultraboost 22',
        details: 'Size: 41 | Màu: Trắng',
        quantity: 1,
        price: 3200000,
        image: '/sneakers/sneakers-2-alt1.jpg'
      }
    ],
    timeline: [
      { title: 'Đặt hàng thành công', description: 'Đơn hàng đã được tạo', date: '10/09/2024 15:20', completed: true },
      { title: 'Xác nhận đơn hàng', description: 'Đơn hàng đã được xác nhận', date: '10/09/2024 18:30', completed: true },
      { title: 'Đang chuẩn bị hàng', description: 'Sản phẩm đang được đóng gói', date: '11/09/2024 10:00', completed: true },
      { title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao', date: '12/09/2024 07:30', completed: true },
      { title: 'Giao hàng thành công', description: 'Đơn hàng sẽ được giao trong hôm nay', date: '', completed: false }
    ]
  }
]

// Load customer orders for logged-in users (same logic as LichSuMuaHang)
const loadCustomerOrders = async () => {
  try {
    loading.value = true
    
    // Check authentication
    if (!authService.isAuthenticated()) {
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
        // Process orders with same logic as LichSuMuaHang
        customerOrders.value = orderData.map(order => {
          
          return {
            id: order.id,
            ma: order.ma,
            orderNumber: order.ma,
            orderDate: order.ngayTao ? new Date(order.ngayTao).toLocaleDateString('vi-VN') : 'N/A',
            status: order.trangThai,
            total: order.tongTienSauGiam || order.tongTien || 0,
            customerName: order.tenKhachHang || 'N/A',
            tenKhachHang: order.tenKhachHang,
            shippingAddress: order.diaChiKhachHang || 'N/A',
            diaChiKhachHang: order.diaChiKhachHang,
            phoneNumber: order.soDienThoaiKhachHang || 'N/A',
            soDienThoaiKhachHang: order.soDienThoaiKhachHang,
            tongTienSauGiam: order.tongTienSauGiam,
            tongTien: order.tongTien,
            ngayTao: order.ngayTao,
            trangThai: order.trangThai,
            items: order.items || []
          }
        })
        
        // Sort orders by creation date (newest first) - multiple fallbacks for date comparison
        customerOrders.value.sort((a, b) => {
          // Try multiple date fields for robust sorting
          const getOrderDate = (order) => {
            // Priority: ngayTao > ngayThanhToan > orderDate > id (as fallback)
            if (order.ngayTao) return new Date(order.ngayTao)
            if (order.ngayThanhToan) return new Date(order.ngayThanhToan)
            if (order.orderDate) return new Date(order.orderDate)
            return new Date(0) // Fallback to epoch if no date found
          }
          
          const dateA = getOrderDate(a)
          const dateB = getOrderDate(b)
          
          // If dates are equal, sort by ID (higher ID = newer)
          if (dateA.getTime() === dateB.getTime()) {
            return (b.id || 0) - (a.id || 0)
          }
          
          return dateB - dateA // Descending order (newest first)
        })
        
        console.log('Orders sorted by date (newest first):', customerOrders.value.map(o => ({
          id: o.id,
          ma: o.ma,
          ngayTao: o.ngayTao,
          orderDate: o.orderDate
        })))
        
        console.log('Processed customer orders:', customerOrders.value)
        toast.success(`Đã tải ${customerOrders.value.length} đơn hàng`)
      } else {
        customerOrders.value = []
        console.log('No orders found for customer')
        toast.info('Bạn chưa có đơn hàng nào')
      }
    } else {
      console.error('Invalid API response structure:', response)
      customerOrders.value = []
      toast.error('Không thể tải dữ liệu đơn hàng')
    }
  } catch (err) {
    console.error('Error loading customer orders:', err)
    toast.error('Không thể tải lịch sử đơn hàng: ' + (err.response?.data?.message || err.message))
    
    // Use fallback data if API fails
    customerOrders.value = sampleOrders
  } finally {
    loading.value = false
  }
}

// Map backend status to frontend status (keep numeric for consistency)
const mapBackendStatus = (backendStatus) => {
  return backendStatus
}

// Generate timeline based on status
const generateOrderTimeline = (status) => {
  const timeline = [
    { title: 'Đặt hàng thành công', description: 'Đơn hàng đã được tạo', date: new Date().toLocaleDateString('vi-VN'), completed: true }
  ]
  
  if (status >= 2) {
    timeline.push({ title: 'Xác nhận đơn hàng', description: 'Đơn hàng đã được xác nhận', date: new Date().toLocaleDateString('vi-VN'), completed: true })
  }
  
  if (status >= 3) {
    timeline.push({ title: 'Đang chuẩn bị hàng', description: 'Sản phẩm đang được đóng gói', date: new Date().toLocaleDateString('vi-VN'), completed: true })
  }
  
  if (status >= 4) {
    timeline.push({ title: 'Đang vận chuyển', description: 'Đơn hàng đang được giao', date: new Date().toLocaleDateString('vi-VN'), completed: true })
  }
  
  if (status === 5) {
    timeline.push({ title: 'Giao hàng thành công', description: 'Đơn hàng đã được giao thành công', date: new Date().toLocaleDateString('vi-VN'), completed: true })
  }
  
  return timeline
}

// Toggle order details expansion with smooth scroll
const toggleOrderDetails = (orderId) => {
  if (expandedOrder.value === orderId) {
    expandedOrder.value = null
  } else {
    expandedOrder.value = orderId
    
    // Scroll to the order after a short delay to allow DOM update
    setTimeout(() => {
      const orderElement = document.getElementById(`order-${orderId}`)
      if (orderElement) {
        orderElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }
    }, 100)
  }
}

// Search order by code (for guest users)
const searchOrder = async () => {
  isSearching.value = true
  
  try {
    // For guest users, search by order code
    const response = await customerAPI.searchOrderByCode(orderCode.value.trim())
    
    if (response && response.success && response.data) {
      const order = response.data
      console.log('Order data received:', order)
      console.log('Product details:', order.sanPhamChiTietInfos)
      searchResult.value = {
        found: true,
        order: {
          id: order.id,
          orderNumber: order.maHoaDon,
          orderDate: new Date(order.ngayTao).toLocaleDateString('vi-VN'),
          paymentDate: order.ngayThanhToan ? new Date(order.ngayThanhToan).toLocaleDateString('vi-VN') : null,
          status: mapBackendStatus(order.trangThai),
          orderType: order.loaiDon || 'Online',
          customerName: order.tenKhachHang,
          phoneNumber: order.soDienThoaiKhachHang || '',
          email: order.email || '',
          shippingAddress: order.diaChiKhachHang || 'Chưa có thông tin',
          note: order.ghiChu || '',
          productAmount: order.tienSanPham || 0,
          shippingFee: order.phiVanChuyen || 0,
          total: order.tongTien || 0,
          totalAfterDiscount: order.tongTienSauGiam || 0,
          discountCode: order.maGiamGia || null,
          staffCode: order.maNhanVien || null,
          staffName: order.tenNhanVien || null,
          trackingNumber: order.maVanDon || null,
          items: order.sanPhamChiTietInfos ? order.sanPhamChiTietInfos.map(item => {
            const imageUrl = getImageUrl(item.duongDan)
            console.log('Item duongDan:', item.duongDan, 'Final imageUrl:', imageUrl)
            return {
              id: item.hoaDonChiTietId,
              name: item.tenSanPham || 'Sản phẩm',
              details: `${item.mauSac ? 'Màu: ' + item.mauSac : ''} ${item.kichCo ? '| Size: ' + item.kichCo : ''} ${item.chatLieu ? '| Chất liệu: ' + item.chatLieu : ''}`.trim(),
              quantity: item.soLuong,
              price: item.giaBan,
              image: imageUrl,
              productCode: item.maSanPham,
              note: item.ghiChu,
              description: item.moTaChiTiet
            }
          }) : [{
            id: 1,
            name: 'Thông tin sản phẩm đang được cập nhật',
            details: 'Loại đơn: ' + (order.loaiDon || 'Online'),
            quantity: 1,
            price: order.tongTienSauGiam || 0,
            image: '/sneakers/sneakers-1-alt1.jpg'
          }],
          timeline: generateOrderTimeline(order.trangThai)
        }
      }
      toast.success('Tìm thấy đơn hàng thành công!')
    } else {
      // Fallback to sample data search
      const normalizedCode = orderCode.value.trim().toUpperCase()
      const foundOrder = sampleOrders.find(order => 
        order.orderNumber.toUpperCase() === normalizedCode
      )
      
      searchResult.value = {
        found: !!foundOrder,
        order: foundOrder
      }
      
      if (!foundOrder) {
        toast.error('Không tìm thấy đơn hàng với mã: ' + orderCode.value.trim())
      }
    }
  } catch (err) {
    console.error('Error searching order:', err)
    toast.error('Không tìm thấy đơn hàng với mã: ' + orderCode.value.trim())
    
    // Fallback to sample data search
    const normalizedCode = orderCode.value.trim().toUpperCase()
    const foundOrder = sampleOrders.find(order => 
      order.orderNumber.toUpperCase() === normalizedCode
    )
    
    searchResult.value = {
      found: !!foundOrder,
      order: foundOrder
    }
  } finally {
    isSearching.value = false
  }
}

const resetSearch = () => {
  orderCode.value = ''
  searchResult.value = null
}

// Check authentication status and load data
const checkAuthAndLoadData = () => {
  // Check if user is logged in using authService
  if (isLoggedIn.value) {
    console.log('User is logged in, loading customer orders...')
    loadCustomerOrders()
  } else {
    console.log('User not logged in, showing search form...')
  }
}

// Initialize
onMounted(() => {
  // Check for query params from checkout redirect
  const queryOrderCode = route.query.orderCode
  const autoSearch = route.query.autoSearch === 'true'
  const paymentMethod = route.query.payment
  const paymentStatus = route.query.status
  
  if (queryOrderCode) {
    orderCode.value = queryOrderCode
    console.log('Auto-filled order code from query:', queryOrderCode)
    
    // Show payment success message for VNPay
    if (paymentMethod === 'vnpay' && paymentStatus === 'success') {
      setTimeout(() => {
        toast.success('Thanh toán VNPay thành công!')
      }, 100)
    }
    
    // Auto search if requested
    if (autoSearch && !isLoggedIn.value) {
      setTimeout(() => {
        searchOrder()
      }, 500) // Small delay to let UI settle
    }
    
    // If user is logged in and has new order from payment, refresh order list
    if (isLoggedIn.value && (paymentMethod === 'vnpay' || paymentMethod === 'cod')) {
      setTimeout(() => {
        console.log('Refreshing customer orders after payment...')
        loadCustomerOrders()
      }, 1000) // Delay to ensure order is processed
    }
  }
  
  checkAuthAndLoadData()
})

const getStatusClass = (status) => {
  // Handle both numeric and string status
  const numericStatus = typeof status === 'number' ? status : parseInt(status)
  
  switch (numericStatus) {
    case 0: return 'bg-gray-100 text-gray-800' // Hóa đơn chờ
    case 1: return 'bg-yellow-100 text-yellow-800' // Chờ xác nhận
    case 2: return 'bg-blue-100 text-blue-800' // Chờ xử lý
    case 3: return 'bg-purple-100 text-purple-800' // Chờ vận chuyển
    case 4: return 'bg-indigo-100 text-indigo-800' // Đang vận chuyển
    case 5: return 'bg-green-100 text-green-800' // Đã hoàn thành
    case 6: return 'bg-red-100 text-red-800' // Đã hủy
    default:
      // Fallback for string status
      const classes = {
        'pending': 'bg-warning-100 text-warning-800',
        'processing': 'bg-primary-100 text-primary-800',
        'shipping': 'bg-primary-100 text-primary-800',
        'delivered': 'bg-success-100 text-success-800',
        'cancelled': 'bg-accent-100 text-accent-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
  }
}

const getStatusDotClass = (status) => {
  // Handle both numeric and string status
  const numericStatus = typeof status === 'number' ? status : parseInt(status)
  
  switch (numericStatus) {
    case 0: return 'bg-gray-500' // Hóa đơn chờ
    case 1: return 'bg-yellow-500' // Chờ xác nhận
    case 2: return 'bg-blue-500' // Chờ xử lý
    case 3: return 'bg-purple-500' // Chờ vận chuyển
    case 4: return 'bg-indigo-500' // Đang vận chuyển
    case 5: return 'bg-green-500' // Đã hoàn thành
    case 6: return 'bg-red-500' // Đã hủy
    default:
      // Fallback for string status
      const classes = {
        'pending': 'bg-warning-500',
        'processing': 'bg-primary-500',
        'shipping': 'bg-primary-500',
        'delivered': 'bg-success-500',
        'cancelled': 'bg-accent-500'
      }
      return classes[status] || 'bg-gray-500'
  }
}

const getStatusText = (status) => {
  // Handle both numeric and string status
  const numericStatus = typeof status === 'number' ? status : parseInt(status)
  
  switch (numericStatus) {
    case 0: return 'Hóa đơn chờ'
    case 1: return 'Chờ xác nhận'
    case 2: return 'Chờ xử lý'
    case 3: return 'Chờ vận chuyển'
    case 4: return 'Đang vận chuyển'
    case 5: return 'Đã hoàn thành'
    case 6: return 'Đã hủy'
    default:
      // Fallback for string status
      const texts = {
        'pending': 'Chờ xác nhận',
        'processing': 'Chờ xử lý', 
        'shipping': 'Đang vận chuyển',
        'delivered': 'Đã hoàn thành',
        'cancelled': 'Đã hủy'
      }
      return texts[status] || 'Không xác định'
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/sneakers/sneakers-1-alt1.jpg'
  }
  
  // If it's already a complete URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // If it starts with /, it's relative to domain
  if (imagePath.startsWith('/')) {
    return `http://localhost:8080${imagePath}`
  }
  
  // Otherwise, assume it's a filename and prepend the uploads path
  return `http://localhost:8080/uploads/${imagePath}`
}

// Handle image loading events
const handleImageError = (event) => {
  console.log('Image failed to load:', event.target.src)
  event.target.src = '/sneakers/sneakers-1-alt1.jpg'
}

const handleImageLoad = (event) => {
  console.log('Image loaded successfully:', event.target.src)
}

</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
