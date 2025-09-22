<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 font-josefin-sans border-b-4 border-accent pb-2">Sản phẩm</h1>
      <p class="text-gray-600 text-lg">Khám phá bộ sưu tập giày thể thao chất lượng cao của chúng tôi</p>
    </div>

    <!-- Main Content with Sidebar Layout -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Vertical Filter Sidebar -->
      <div class="lg:w-1/4">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <!-- Filter Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Bộ lọc</h2>
            <button @click="clearAllFilters" class="text-sm text-blue-600 hover:text-blue-800 underline">
              Xóa tất cả
            </button>
          </div>

          <!-- Search Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div class="relative">
              <input v-model="searchQuery" @input="filterProducts"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                type="text" placeholder="Tìm kiếm sản phẩm..." />
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Thương hiệu</label>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <label class="flex items-center">
                <input type="checkbox" v-model="selectedBrands" value="" @change="filterProducts"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-700">Tất cả thương hiệu</span>
              </label>
              <label v-for="brand in brands" :key="brand" class="flex items-center">
                <input type="checkbox" :value="brand" v-model="selectedBrands" @change="filterProducts"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-700">{{ brand }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Khoảng giá</label>
            <div class="space-y-2">
              <label v-for="range in priceRanges" :key="range.value" class="flex items-center">
                <input type="radio" :value="range.value" v-model="priceRange" @change="filterProducts"
                  class="text-blue-600 focus:ring-blue-500">
                <span class="ml-2 text-sm text-gray-700">{{ range.label }}</span>
              </label>
            </div>
          </div>

          <!-- Color Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Màu sắc</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="color in availableColors" :key="color.code"
                @click="toggleColorFilter(color.code)"
                :class="[
                  'w-8 h-8 rounded-full border-2 transition-all duration-200 relative',
                  selectedColors.includes(color.code) 
                    ? 'border-gray-800 ring-2 ring-blue-500' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: color.code }"
                :title="color.name">
                <!-- White border for light colors -->
                <div 
                  v-if="color.code === '#FFFFFF' || color.code === '#FFD700'"
                  class="absolute inset-0 rounded-full border border-gray-300"
                ></div>
              </button>
            </div>
            <div class="mt-2 flex flex-wrap gap-1">
              <span v-for="colorCode in selectedColors" :key="colorCode"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {{ getColorName(colorCode) }}
                <button @click="toggleColorFilter(colorCode)" class="ml-1 text-blue-600 hover:text-blue-800">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Size Filter -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Kích cỡ</label>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="size in availableSizes" :key="size"
                @click="toggleSizeFilter(size)"
                :class="[
                  'px-3 py-2 text-sm border rounded-lg transition-all duration-200',
                  selectedSizes.includes(size)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                ]">
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Sort Options -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Sắp xếp theo</label>
            <select v-model="sortBy" @change="filterProducts"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name">Tên sản phẩm</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="lg:w-3/4">

        <!-- Results Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="text-gray-600">
            Hiển thị {{ Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length) }}-{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
            trong tổng số {{ filteredProducts.length }} sản phẩm
          </div>
          <button @click="toggleSidebar" class="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-2a2 2 0 011-1.732l4 2.732a1 1 0 010 1.732l-4 2.732A2 2 0 016 16.732V14"></path>
            </svg>
            Bộ lọc
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div v-for="product in paginatedProducts" :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            @click="goToProductDetail(product.id)">
            <!-- Product Image -->
            <div class="relative h-48 overflow-hidden">
              <img :src="product.imageUrl" :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                @error="handleImageError" />
              <!-- Status Badge -->
              <div class="absolute top-2 right-2">
                <span :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  product.status === 'Đang kinh doanh' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ product.status }}
                </span>
              </div>
              <!-- Discount Badge -->
              <div v-if="product.hasDiscount && product.campaignName" class="absolute top-2 left-2">
                <span class="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 max-w-32">
                  <i class="fas fa-tag text-xs"></i>
                  <span class="truncate">{{ product.campaignName }}</span>
                </span>
              </div>
              <div v-else-if="product.discount" class="absolute top-2 left-2">
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
                <div v-if="product.originalPrice && product.originalPrice !== product.price"
                  class="flex items-center gap-2">
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
                  <div v-for="(color, index) in product.colors.slice(0, 4)" :key="index" :style="{ backgroundColor: color }"
                    class="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    :title="getColorName(color)"></div>
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
                <button disabled
                  class="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed transition-colors">
                  Hết hàng
                </button>
                <button @click.stop="toggleFavorite(product)"
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg :class="[
                    'h-5 w-5',
                    product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                    </path>
                  </svg>
                </button>
              </div>
              <div v-else class="flex gap-2">
                <!-- Add to Cart Button with Icon -->
                <button @click.stop="addToCart(product)"
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Thêm vào giỏ hàng">
                  <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                  </svg>
                </button>

                <!-- Buy Now Button -->
                <button @click.stop="buyNow(product)"
                  class="flex-1 py-2 px-4 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Mua ngay
                </button>

                <!-- Favorite Button -->
                <button @click.stop="toggleFavorite(product)"
                  class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg :class="[
                    'h-5 w-5',
                    product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                    </path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
              class="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
              class="px-4 py-2 border border-gray-300 rounded-lg">
              {{ page }}
            </button>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
              class="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI, mapBackendToFrontend } from '../services/productAPI.js'

// Inject cart actions
const { addToCart: addToCartAction } = inject('cartActions', {})
const router = useRouter()

// Reactive data
const products = ref([])
const filteredProducts = ref([])
const searchQuery = ref('')
const selectedBrands = ref([])
const priceRange = ref('')
const selectedColors = ref([])
const selectedSizes = ref([])
const sidebarOpen = ref(false)
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12
const brands = ref([])
const availableColors = ref([])
const availableSizes = ref([])
const priceRanges = ref([
  { value: '', label: 'Tất cả giá' },
  { value: '0-1000000', label: 'Dưới 1 triệu' },
  { value: '1000000-2000000', label: '1 - 2 triệu' },
  { value: '2000000-3000000', label: '2 - 3 triệu' },
  { value: '3000000-5000000', label: '3 - 5 triệu' },
  { value: '5000000-999999999', label: 'Trên 5 triệu' }
])

// Computed properties
const allProducts = computed(() => products.value)
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
    const response = await productAPI.getProducts({ page: 0, size: 9999 })
    
    // Try to enrich with discount information
    try {
      const allProductDetails = await productAPI.getAllProductDetailsWithDiscount()
      
      // Create a map of discount information by product ID
      const discountMap = new Map()
      allProductDetails.forEach(detail => {
        const productId = detail.idSanPham
        console.log('Processing discount detail for SanPham:', {
          detailId: detail.id,
          productId: productId,
          hasDiscount: detail.hasDiscount,
          giaGiamGia: detail.giaGiamGia,
          tenDotGiamGia: detail.tenDotGiamGia
        })
        
        if (productId && detail.hasDiscount && detail.giaGiamGia) {
          if (!discountMap.has(productId)) {
            discountMap.set(productId, [])
          }
          discountMap.get(productId).push({
            giaGiamGia: detail.giaGiamGia,
            tenDotGiamGia: detail.tenDotGiamGia,
            hasDiscount: detail.hasDiscount
          })
        }
      })
      
      // Enrich existing products with discount information
      response.content.forEach(product => {
        const discountInfo = discountMap.get(product.id)
        if (discountInfo && discountInfo.length > 0) {
          // Find variants with discount
          const variantsWithDiscount = discountInfo.filter(info => info.hasDiscount && info.giaGiamGia)
          if (variantsWithDiscount.length > 0) {
            // Add discount info to product's chiTietSanPhams
            if (!product.chiTietSanPhams) product.chiTietSanPhams = []
            variantsWithDiscount.forEach(discount => {
              product.chiTietSanPhams.push({
                giaGiamGia: discount.giaGiamGia,
                tenDotGiamGia: discount.tenDotGiamGia,
                hasDiscount: discount.hasDiscount
              })
            })
          }
        }
      })
      
      console.log('Products enriched with discount info')
      console.log('All products:', products.value.slice(0, 3).map(p => ({
        id: p.id,
        name: p.tenSanPham,
        hasDiscount: p.hasDiscount,
        campaignName: p.campaignName,
        discountPrice: p.discountPrice
      })))
      console.log('Sample product with discount:', products.value.find(p => p.hasDiscount))
    } catch (discountError) {
      console.warn('Failed to enrich products with discount, using regular products:', discountError)
    }
    
    products.value = response.content
      .filter(item => item.idTrangThai !== 4) // Filter out discontinued products
      .map((obj) => {
        const mappedProduct = mapBackendToFrontend.product(obj)
        return {
          ...mappedProduct,
          originalPrice: null,
          discount: null,
          isFavorite: false
        }
      })

    // Extract unique brands, colors, and sizes
    brands.value = [...new Set(products.value.map(product => product.brand))].sort()
    const colorSet = new Set()
    products.value.forEach(product => {
      product.colors.forEach(color => colorSet.add(color))
    })
    availableColors.value = Array.from(colorSet).map(colorCode => ({
      name: getColorName(colorCode),
      code: colorCode
    })).sort((a, b) => a.name.localeCompare(b.name))
    const sizeSet = new Set()
    products.value.forEach(product => {
      product.sizes.forEach(size => sizeSet.add(size))
    })
    availableSizes.value = Array.from(sizeSet).sort((a, b) => {
      const aNum = parseFloat(a)
      const bNum = parseFloat(b)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }
      return a.localeCompare(b)
    })

    filterProducts()
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm từ API:', err)
    // Set empty array if API fails
    products.value = []
    brands.value = []
    filterProducts()
  }
}

const filterProducts = () => {
  let filtered = [...products.value]

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.tenSanPham.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.ma.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by brands (multiple selection)
  if (selectedBrands.value.length > 0 && !selectedBrands.value.includes('')) {
    filtered = filtered.filter(product => selectedBrands.value.includes(product.brand))
  }

  // Filter by colors
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter(product => 
      product.colors.some(color => selectedColors.value.includes(color))
    )
  }

  // Filter by sizes
  if (selectedSizes.value.length > 0) {
    filtered = filtered.filter(product => 
      product.sizes.some(size => selectedSizes.value.includes(size))
    )
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
  if (product.stock > 0) {
    // Chuyển hướng đến trang chi tiết sản phẩm để chọn màu sắc và kích cỡ
    router.push(`/product/${product.id}?action=add-to-cart`)
    console.log(`Chuyển đến chi tiết sản phẩm để thêm ${product.name} vào giỏ hàng`)
  }
}

const buyNow = (product) => {
  if (product.stock > 0) {
    // Chuyển hướng đến trang chi tiết sản phẩm để chọn màu sắc và kích cỡ
    router.push(`/product/${product.id}?action=buy-now`)
    console.log(`Chuyển đến chi tiết sản phẩm để mua ngay ${product.name}`)
  }
}

const toggleFavorite = (product) => {
  product.isFavorite = !product.isFavorite
  // Here you would typically save to localStorage or send to API
  console.log(`${product.isFavorite ? 'Đã thêm' : 'Đã xóa'} ${product.name} ${product.isFavorite ? 'vào' : 'khỏi'} danh sách yêu thích`)
}

const handleImageError = (event) => {
  // Use stable sneaker images from public folder as fallbacks
  const fallbackImages = [
    '/sneakers/sneakers-1-alt1.jpg',
    '/sneakers/sneakers-2-alt1.jpg',
    '/sneakers/sneakers-3-alt1.jpg',
    '/sneakers/sneakers-4-alt1.jpg',
    '/sneakers/sneakers-5-alt1.jpg',
    '/sneakers/sneakers-6-alt1.jpg',
    '/sneakers/sneakers-7-alt1.jpg',
    '/sneakers/sneakers-8-alt1.jpg',
    '/sneakers/sneakers-9-alt1.jpg',
    '/sneakers/sneakers-10-alt1.jpg'
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
// Helper function to get color codes
const getColorCode = (colorName) => {
  const colorMap = {
    'Đen': '#000000',
    'Trắng': '#FFFFFF',
    'Xám': '#808080',
    'Đỏ': '#FF0000',
    'Xanh dương': '#0000FF',
    'Xanh lá': '#008000',
    'Vàng': '#FFFF00',
    'Cam': '#FFA500',
    'Tím': '#800080',
    'Hồng': '#FFC0CB',
    'Nâu': '#A52A2A',
    'Be': '#F5F5DC'
  }
  return colorMap[colorName] || '#CCCCCC'
}

// Toggle functions for filters
const toggleColorFilter = (colorCode) => {
  const index = selectedColors.value.indexOf(colorCode)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(colorCode)
  }
  filterProducts()
}

const toggleSizeFilter = (size) => {
  const index = selectedSizes.value.indexOf(size)
  if (index > -1) {
    selectedSizes.value.splice(index, 1)
  } else {
    selectedSizes.value.push(size)
  }
  filterProducts()
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedBrands.value = []
  selectedColors.value = []
  selectedSizes.value = []
  priceRange.value = ''
  sortBy.value = 'name'
  filterProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
