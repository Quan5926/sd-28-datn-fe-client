<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Hỗ trợ</h1>
      <p class="text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
    </div>
    
    <!-- Quick Help Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">FAQ</h3>
        <p class="text-sm text-gray-600">Câu hỏi thường gặp</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">Live Chat</h3>
        <p class="text-sm text-gray-600">Trò chuyện trực tiếp</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div class="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">Email</h3>
        <p class="text-sm text-gray-600">Gửi email hỗ trợ</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
        <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">Hotline</h3>
        <p class="text-sm text-gray-600">1900 1234</p>
      </div>
    </div>
    
    <!-- Contact Form -->
    <div class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Gửi yêu cầu hỗ trợ</h2>
      
      <form class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập họ và tên">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập email">
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <input type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập số điện thoại">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại yêu cầu *</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Chọn loại yêu cầu</option>
              <option value="order">Vấn đề về đơn hàng</option>
              <option value="product">Thông tin sản phẩm</option>
              <option value="payment">Vấn đề thanh toán</option>
              <option value="shipping">Vận chuyển</option>
              <option value="return">Đổi trả</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nhập tiêu đề yêu cầu">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
          <textarea rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Mô tả chi tiết vấn đề của bạn..."></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Đính kèm file</label>
          <input type="file" multiple class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <p class="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, PDF (tối đa 5MB mỗi file)</p>
        </div>
        
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
    
    <!-- FAQ Section -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>
      
      <div class="space-y-4">
        <div class="bg-white rounded-lg shadow-md">
          <button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
            <span class="font-medium text-gray-800">Làm thế nào để theo dõi đơn hàng?</span>
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div class="px-6 pb-4 text-gray-600">
            Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và truy cập mục "Đơn hàng" hoặc sử dụng mã đơn hàng được gửi qua email.
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md">
          <button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
            <span class="font-medium text-gray-800">Chính sách đổi trả như thế nào?</span>
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        <div class="bg-white rounded-lg shadow-md">
          <button class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50">
            <span class="font-medium text-gray-800">Thời gian giao hàng là bao lâu?</span>
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic for support page
</script>

<style scoped>
/* Additional styles if needed */
</style>
