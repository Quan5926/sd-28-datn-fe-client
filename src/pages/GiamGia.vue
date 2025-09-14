<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Giảm giá</h1>
      <p class="text-gray-600">Khám phá các ưu đãi và chương trình giảm giá hấp dẫn</p>
    </div>
    
    <!-- Featured Discount Banner -->
    <div class="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-8 mb-8">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">Giảm giá lớn cuối năm!</h2>
          <p class="text-lg">Giảm đến 50% cho tất cả sản phẩm</p>
        </div>
        <div class="mt-4 md:mt-0">
          <span class="text-4xl font-bold">50%</span>
          <span class="text-lg ml-2">OFF</span>
        </div>
      </div>
    </div>
    
    <!-- Discount Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="text-center">
          <div class="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🏃</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Giày chạy bộ</h3>
          <p class="text-gray-600 mb-4">Giảm 30% cho tất cả giày chạy bộ</p>
          <button class="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition-colors">
            Xem ngay
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="text-center">
          <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">⚽</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Giày thể thao</h3>
          <p class="text-gray-600 mb-4">Giảm 25% cho giày thể thao</p>
          <button class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
            Xem ngay
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="text-center">
          <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👟</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Giày casual</h3>
          <p class="text-gray-600 mb-4">Giảm 20% cho giày thường ngày</p>
          <button class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors">
            Xem ngay
          </button>
        </div>
      </div>
    </div>
    
    <!-- Promo Codes -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Mã giảm giá</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold">WELCOME20</h3>
              <p class="text-sm text-gray-600">Giảm 20% cho đơn hàng đầu tiên</p>
            </div>
            <button class="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Sao chép
            </button>
          </div>
        </div>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold">FREESHIP</h3>
              <p class="text-sm text-gray-600">Miễn phí vận chuyển đơn từ 500k</p>
            </div>
            <button class="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
              Sao chép
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic for discounts page
</script>

<style scoped>
/* Additional styles if needed */
</style>
