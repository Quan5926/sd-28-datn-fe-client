<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 font-josefin-sans border-b-4 border-accent pb-2">Sản phẩm</h1>
      <p class="text-gray-600 text-lg">Khám phá bộ sưu tập giày thể thao chất lượng cao của chúng tôi</p>
    </div>

    <div class="flex gap-8">
      <!-- Left Sidebar Filter -->
      <div class="w-80 flex-shrink-0 hidden lg:block">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <!-- Search -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="filterProducts"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Categories -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Danh mục</h3>
            <div class="space-y-2">
              <label v-for="category in categories" :key="category.value" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  :value="category.value"
                  v-model="selectedCategory"
                  @change="filterProducts"
                  class="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-gray-700">{{ category.label }}</span>
              </label>
            </div>
          </div>

          <!-- Brands -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Thương hiệu</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <label v-for="brand in brands" :key="brand" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  :value="brand"
                  v-model="selectedBrands"
                  @change="filterProducts"
                  class="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-gray-700">{{ brand }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Khoảng giá</h3>
            <div class="space-y-2">
              <label v-for="range in priceRanges" :key="range.value" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  :value="range.value"
                  v-model="priceRange"
                  @change="filterProducts"
                  class="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-gray-700">{{ range.label }}</span>
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Màu sắc</h3>
            <div class="grid grid-cols-6 gap-2">
              <div
                v-for="color in availableColors"
                :key="color.value"
                @click="toggleColor(color.value)"
                :class="[
                  'w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110',
                  selectedColors.includes(color.value) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              >
                <div v-if="color.value === '#FFFFFF'" class="w-full h-full rounded-full border border-gray-300"></div>
              </div>
            </div>
          </div>

          <!-- Sort -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Sắp xếp</h3>
            <select v-model="sortBy" @change="filterProducts" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name">Sắp xếp theo tên</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <button
            @click="clearAllFilters"
            class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      </div>

      <!-- Mobile Filter Toggle -->
      <div class="lg:hidden mb-4">
        <button
          @click="showMobileFilters = !showMobileFilters"
          class="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Bộ lọc
        </button>
      </div>

      <!-- Mobile Filter Modal -->
      <div v-if="showMobileFilters" class="lg:hidden fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showMobileFilters = false"></div>
          
          <!-- Modal Content -->
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Bộ lọc sản phẩm</h3>
                <button @click="showMobileFilters = false" class="text-gray-400 hover:text-gray-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Mobile Filter Content (same as sidebar) -->
              <div class="space-y-6 max-h-96 overflow-y-auto">
                <!-- Search -->
                <div>
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      @input="filterProducts"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                    />
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>

                <!-- Categories -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Danh mục</h4>
                  <div class="space-y-2">
                    <label v-for="category in categories" :key="category.value" class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        :value="category.value"
                        v-model="selectedCategory"
                        @change="filterProducts"
                        class="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-gray-700">{{ category.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Brands -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Thương hiệu</h4>
                  <div class="space-y-2 max-h-32 overflow-y-auto">
                    <label v-for="brand in brands" :key="brand" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :value="brand"
                        v-model="selectedBrands"
                        @change="filterProducts"
                        class="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-gray-700">{{ brand }}</span>
                    </label>
                  </div>
                </div>

                <!-- Price Range -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Khoảng giá</h4>
                  <div class="space-y-2">
                    <label v-for="range in priceRanges" :key="range.value" class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        :value="range.value"
                        v-model="priceRange"
                        @change="filterProducts"
                        class="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-gray-700">{{ range.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Colors -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-3">Màu sắc</h4>
                  <div class="grid grid-cols-6 gap-2">
                    <div
                      v-for="color in availableColors"
                      :key="color.value"
                      @click="toggleColor(color.value)"
                      :class="[
                        'w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200',
                        selectedColors.includes(color.value) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                      ]"
                      :style="{ backgroundColor: color.value }"
                      :title="color.name"
                    >
                      <div v-if="color.value === '#FFFFFF'" class="w-full h-full rounded-full border border-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="clearAllFilters(); showMobileFilters = false"
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Xóa bộ lọc
              </button>
              <button
                @click="showMobileFilters = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Results Header -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-gray-600">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
            trong tổng số {{ filteredProducts.length }} sản phẩm
          </div>
          
          <!-- Mobile Sort -->
          <div class="lg:hidden">
            <select v-model="sortBy" @change="filterProducts" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="name">Tên</option>
              <option value="price-asc">Giá ↑</option>
              <option value="price-desc">Giá ↓</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        @click="goToProductDetail(product.id)"
      >
        <!-- Product Image -->
        <div class="relative h-48 overflow-hidden">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            @error="handleImageError"
          />
          <!-- Status Badge -->
          <div class="absolute top-2 right-2">
            <span
              :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                product.status === 'Đang kinh doanh' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ product.status }}
            </span>
          </div>
          <!-- Discount Badge -->
          <div v-if="product.discount" class="absolute top-2 left-2">
            <span class="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
              -{{ product.discount }}%
            </span>
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ product.name }}</h3>
          <p class="text-gray-600 text-sm mb-2">{{ product.brand }}</p>
          
          <!-- Price -->
          <div class="mb-3">
            <div v-if="product.originalPrice && product.originalPrice !== product.price" class="flex items-center gap-2">
              <span class="text-lg font-bold text-blue-600">{{ formatPrice(product.price) }}</span>
              <span class="text-sm text-gray-500 line-through">{{ formatPrice(product.originalPrice) }}</span>
            </div>
            <div v-else>
              <span class="text-lg font-bold text-blue-600">{{ formatPrice(product.price) }}</span>
            </div>
          </div>

          <!-- Colors -->
          <div v-if="product.colors && product.colors.length > 0" class="mb-3 flex justify-center">
            <div class="flex gap-1">
              <div
                v-for="(color, index) in product.colors.slice(0, 4)"
                :key="index"
                :style="{ backgroundColor: color }"
                class="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                :title="getColorName(color)"
              ></div>
              <span v-if="product.colors.length > 4" class="text-xs text-gray-500 ml-1 self-center">
                +{{ product.colors.length - 4 }}
              </span>
            </div>
          </div>

          <!-- Stock Info -->
          <div class="mb-3">
            <span :class="[
              'text-sm',
              product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
            ]">
              {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}
            </span>
          </div>

          <!-- Actions -->
          <div v-if="product.stock === 0" class="flex gap-2">
            <button
              disabled
              class="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed transition-colors"
            >
              Hết hàng
            </button>
            <button
              @click.stop="toggleFavorite(product)"
              class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                :class="[
                  'h-5 w-5',
                  product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          <div v-else class="flex gap-2">
            <!-- Add to Cart Button with Icon -->
            <button
              @click.stop="addToCart(product)"
              class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="Thêm vào giỏ hàng"
            >
              <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"></path>
              </svg>
            </button>
            
            <!-- Buy Now Button -->
            <button
              @click.stop="buyNow(product)"
              class="flex-1 py-2 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Mua ngay
            </button>
            
            <!-- Favorite Button -->
            <button
              @click.stop="toggleFavorite(product)"
              class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                :class="[
                  'h-5 w-5',
                  product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>


        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <div class="flex gap-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg font-semibold',
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Inject cart actions
const { addToCart: addToCartAction } = inject('cartActions', {})
const router = useRouter()

// Reactive data
const products = ref([])
const filteredProducts = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrands = ref([])
const selectedColors = ref([])
const priceRange = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12
const brands = ref([])
const showMobileFilters = ref(false)

// Filter options
const categories = ref([
  { value: '', label: 'Tất cả danh mục' },
  { value: 'lifestyle', label: 'Giày thời trang' },
  { value: 'running', label: 'Giày chạy bộ' },
  { value: 'basketball', label: 'Giày bóng rổ' },
  { value: 'football', label: 'Giày bóng đá' },
  { value: 'training', label: 'Giày tập luyện' },
  { value: 'canvas', label: 'Giày canvas' }
])

const priceRanges = ref([
  { value: '', label: 'Tất cả giá' },
  { value: '0-1000000', label: 'Dưới 1 triệu' },
  { value: '1000000-2000000', label: '1 - 2 triệu' },
  { value: '2000000-3000000', label: '2 - 3 triệu' },
  { value: '3000000-999999999', label: 'Trên 3 triệu' }
])

const availableColors = ref([
  { value: '#000000', name: 'Đen' },
  { value: '#FFFFFF', name: 'Trắng' },
  { value: '#FF0000', name: 'Đỏ' },
  { value: '#0066CC', name: 'Xanh dương' },
  { value: '#FFD700', name: 'Vàng' },
  { value: '#32CD32', name: 'Xanh lá' },
  { value: '#FF69B4', name: 'Hồng' },
  { value: '#800080', name: 'Tím' },
  { value: '#FFA500', name: 'Cam' },
  { value: '#8B4513', name: 'Nâu' },
  { value: '#708090', name: 'Xám' },
  { value: '#DC143C', name: 'Đỏ đậm' }
])

// Generate fake products data
const generateFakeProducts = () => {
  const fakeProducts = []
  const brandsList = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Reebok', 'Jordan', 'Fila', 'Asics']
  const categories = ['Air Max', 'Stan Smith', 'Chuck Taylor', 'Old Skool', 'Ultraboost', 'Classic', 'Running', 'Basketball', 'Lifestyle', 'Training']
  const statuses = ['Đang kinh doanh', 'Hết hàng']

  for (let i = 1; i <= 80; i++) {
    const brand = brandsList[Math.floor(Math.random() * brandsList.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const hasDiscount = Math.random() > 0.7
    const originalPrice = Math.floor(Math.random() * 3000000) + 500000
    const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0
    const finalPrice = hasDiscount ? Math.floor(originalPrice * (1 - discountPercent / 100)) : originalPrice
    
    const colors = [
      ['#000000', '#FFFFFF', '#FF0000'], // Đen, Trắng, Đỏ
      ['#0066CC', '#FFD700', '#32CD32'], // Xanh dương, Vàng, Xanh lá
      ['#FF69B4', '#800080', '#FFA500'], // Hồng, Tím, Cam
      ['#8B4513', '#708090', '#DC143C'], // Nâu, Xám, Đỏ đậm
      ['#000080', '#FF1493', '#00CED1'], // Xanh navy, Hồng đậm, Xanh ngọc
      ['#228B22', '#FF4500', '#4B0082'], // Xanh lá đậm, Đỏ cam, Tím đậm
      ['#CD853F', '#20B2AA', '#B22222']  // Nâu cát, Xanh lam, Đỏ gạch
    ]
    
    fakeProducts.push({
      id: i,
      name: `${brand} ${category} ${i.toString().padStart(3, '0')}`,
      brand: brand,
      imageUrl: `/public/sneakers/sneakers-${((i - 1) % 48) + 1}-alt1.jpg`,
      price: finalPrice,
      originalPrice: hasDiscount ? originalPrice : null,
      discount: hasDiscount ? discountPercent : null,
      stock: status === 'Hết hàng' ? 0 : Math.floor(Math.random() * 50) + 1,
      status: status,
      isFavorite: false,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
      colors: colors[Math.floor(Math.random() * colors.length)]
    })
  }
  return fakeProducts
}

// Computed properties
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const fetchProducts = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/san-phams', {
      params: {
        page: 0,
        size: 9999
      }
    })

    products.value = data.content.map((obj) => ({
      id: obj.id,
      name: obj.tenSanPham,
      brand: obj.thuongHieu?.ten || 'Unknown',
      imageUrl: obj.urlAnhDaiDien || '/public/sneakers/sneakers-1-alt1.jpg',
      price: obj.giaBanThapNhat,
      originalPrice: null,
      discount: null,
      stock: obj.soLuongTonKho,
      status: obj.tenTrangThai,
      isFavorite: false,
      createdAt: new Date(obj.ngayTao || Date.now())
    }))

    // Extract unique brands
    brands.value = [...new Set(products.value.map(p => p.brand))].sort()
    
    filterProducts()
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm từ API, sử dụng fake data:', err)
    
    // Fallback to fake data
    const fakeData = generateFakeProducts()
    products.value = fakeData
    brands.value = [...new Set(fakeData.map(p => p.brand))].sort()
    filterProducts()
  }
}

const filterProducts = () => {
  let filtered = [...products.value]

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => {
      const productName = product.name.toLowerCase()
      switch (selectedCategory.value) {
        case 'lifestyle':
          return productName.includes('stan smith') || productName.includes('classic') || productName.includes('lifestyle')
        case 'running':
          return productName.includes('air max') || productName.includes('running') || productName.includes('ultraboost')
        case 'basketball':
          return productName.includes('basketball') || productName.includes('jordan')
        case 'football':
          return productName.includes('football') || productName.includes('soccer')
        case 'training':
          return productName.includes('training') || productName.includes('gym')
        case 'canvas':
          return productName.includes('chuck taylor') || productName.includes('converse') || productName.includes('canvas')
        default:
          return true
      }
    })
  }

  // Filter by brands (multiple selection)
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(product => selectedBrands.value.includes(product.brand))
  }

  // Filter by colors (multiple selection)
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter(product => {
      if (!product.colors || product.colors.length === 0) return false
      return selectedColors.value.some(selectedColor => 
        product.colors.includes(selectedColor)
      )
    })
  }

  // Filter by price range
  if (priceRange.value) {
    const [min, max] = priceRange.value.split('-').map(Number)
    filtered = filtered.filter(product => product.price >= min && product.price <= max)
  }

  // Sort products
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  filteredProducts.value = filtered
  currentPage.value = 1 // Reset to first page when filtering
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = (product) => {
  if (product.stock > 0 && addToCartAction) {
    addToCartAction(product)
    // Show success message or update UI
    console.log(`Đã thêm ${product.name} vào giỏ hàng`)
  }
}

const buyNow = (product) => {
  if (product.stock > 0) {
    // Add to cart first if needed
    if (addToCartAction) {
      addToCartAction(product)
    }
    // Navigate to checkout or cart page
    router.push('/cart')
    console.log(`Mua ngay ${product.name}`)
  }
}

const toggleColor = (colorValue) => {
  const index = selectedColors.value.indexOf(colorValue)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(colorValue)
  }
  filterProducts()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedBrands.value = []
  selectedColors.value = []
  priceRange.value = ''
  sortBy.value = 'name'
  filterProducts()
}

const toggleFavorite = (product) => {
  product.isFavorite = !product.isFavorite
  // Here you would typically save to localStorage or send to API
  console.log(`${product.isFavorite ? 'Đã thêm' : 'Đã xóa'} ${product.name} ${product.isFavorite ? 'vào' : 'khỏi'} danh sách yêu thích`)
}

const handleImageError = (event) => {
  // Use stable sneaker images from public folder as fallbacks
  const fallbackImages = [
    '/public/sneakers/sneakers-1-alt1.jpg',
    '/public/sneakers/sneakers-2-alt1.jpg',
    '/public/sneakers/sneakers-3-alt1.jpg',
    '/public/sneakers/sneakers-4-alt1.jpg',
    '/public/sneakers/sneakers-5-alt1.jpg',
    '/public/sneakers/sneakers-6-alt1.jpg',
    '/public/sneakers/sneakers-7-alt1.jpg',
    '/public/sneakers/sneakers-8-alt1.jpg',
    '/public/sneakers/sneakers-9-alt1.jpg',
    '/public/sneakers/sneakers-10-alt1.jpg'
  ]
  
  // Use a hash of the current src to consistently pick the same fallback
  const srcHash = event.target.src.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const fallbackIndex = Math.abs(srcHash) % fallbackImages.length
  event.target.src = fallbackImages[fallbackIndex]
}

const goToProductDetail = (productId) => {
  router.push(`/product/${productId}`)
}

const getColorName = (color) => {
  const colorNames = {
    '#000000': 'Đen',
    '#FFFFFF': 'Trắng', 
    '#FF0000': 'Đỏ',
    '#0066CC': 'Xanh dương',
    '#FFD700': 'Vàng',
    '#32CD32': 'Xanh lá',
    '#FF69B4': 'Hồng',
    '#800080': 'Tím',
    '#FFA500': 'Cam',
    '#8B4513': 'Nâu',
    '#708090': 'Xám',
    '#DC143C': 'Đỏ đậm',
    '#000080': 'Xanh navy',
    '#FF1493': 'Hồng đậm',
    '#00CED1': 'Xanh ngọc',
    '#228B22': 'Xanh lá đậm',
    '#FF4500': 'Đỏ cam',
    '#4B0082': 'Tím đậm',
    '#CD853F': 'Nâu cát',
    '#20B2AA': 'Xanh lam',
    '#B22222': 'Đỏ gạch'
  }
  return colorNames[color] || 'Màu khác'
}

// Lifecycle
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
