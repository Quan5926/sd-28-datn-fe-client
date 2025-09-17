<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <nav class="flex text-sm text-gray-600">
          <router-link to="/" class="hover:text-blue-600">Trang chủ</router-link>
          <span class="mx-2">/</span>
          <router-link to="/products" class="hover:text-blue-600">Sản phẩm</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-900">{{ product.name }}</span>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          <!-- Thumbnail Images -->
          <div class="grid grid-cols-4 gap-3">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              :class="[
                'aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 transition-all',
                selectedImage === image ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Brand & Name -->
          <div>
            <p class="text-sm font-semibold text-blue-600 uppercase tracking-wide">{{ product.brand }}</p>
            <h1 class="text-3xl font-bold text-gray-900 mt-1">{{ product.name }}</h1>
            <p class="text-gray-600 mt-2">{{ product.category }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-center gap-3">
            <span class="text-3xl font-bold text-gray-900">{{ formatPrice(selectedVariant.price) }}</span>
            <span v-if="selectedVariant.originalPrice" class="text-xl text-gray-500 line-through">
              {{ formatPrice(selectedVariant.originalPrice) }}
            </span>
            <span v-if="selectedVariant.discount" class="bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">
              -{{ selectedVariant.discount }}%
            </span>
          </div>

          <!-- Color Selection -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Chọn màu sắc</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="(color, index) in product.colors"
                :key="index"
                @click="selectedColor = color"
                :class="[
                  'w-12 h-12 rounded-full border-4 transition-all relative',
                  selectedColor === color
                    ? 'border-black shadow-lg scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :style="{ backgroundColor: color.code }"
                :title="color.name"
              >
                <!-- White border for light colors -->
                <div 
                  v-if="color.code === '#FFFFFF' || color.code === '#FFD700'"
                  class="absolute inset-1 rounded-full border border-gray-300"
                ></div>
                <!-- Check mark for selected color -->
                <div 
                  v-if="selectedColor === color"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <svg class="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </button>
            </div>
            <p v-if="selectedColor" class="text-sm text-gray-600 mt-2">
              Đã chọn: {{ selectedColor.name }}
            </p>
          </div>

          <!-- Size Selection -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Chọn kích cỡ</h3>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="size in availableSizesForColor"
                :key="size.size"
                @click="selectedSize = size"
                :disabled="size.stock === 0"
                :class="[
                  'py-3 px-4 border rounded-lg font-medium transition-all',
                  selectedSize?.size === size.size
                    ? 'border-black bg-black text-white'
                    : size.stock > 0
                    ? 'border-gray-300 hover:border-black'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ size.size }}
              </button>
            </div>
            <p v-if="selectedSize" class="text-sm text-gray-600 mt-2">
              Còn {{ selectedSize.stock }} sản phẩm - {{ formatPrice(selectedSize.price) }}
            </p>
          </div>

          <!-- Add to Cart -->
          <div class="space-y-4">
            <button
              @click="addToCart"
              :disabled="!selectedColor || !selectedSize || selectedSize.stock === 0"
              class="w-full bg-black text-white py-4 px-8 rounded-full font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {{ !selectedColor ? 'Chọn màu sắc' : !selectedSize ? 'Chọn kích cỡ' : selectedSize.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng' }}
            </button>
            
            <button
              @click="toggleFavorite"
              class="w-full border-2 border-gray-300 py-4 px-8 rounded-full font-semibold text-lg hover:border-black transition-colors flex items-center justify-center gap-2"
            >
              <svg
                :class="['h-5 w-5', product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              Yêu thích
            </button>
          </div>

          <!-- Product Details -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
            <div class="space-y-3 text-gray-700">
              <p>{{ product.description }}</p>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-gray-100 rounded-lg p-4">
            <h4 class="font-semibold mb-2">Thông tin giao hàng</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <p>🚚 Miễn phí giao hàng cho đơn từ 1.000.000₫</p>
              <p>⚡ Giao hàng nhanh trong 2-3 ngày</p>
              <p>🔄 Đổi trả miễn phí trong 30 ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI, mapBackendToFrontend } from '../services/productAPI.js'

const route = useRoute()
const router = useRouter()
const { addToCart: addToCartAction } = inject('cartActions', {})

const selectedImage = ref('')
const selectedSize = ref(null)
const selectedColor = ref(null)
const loading = ref(true)

// Product data from API
const product = ref({
  id: null,
  name: '',
  brand: '',
  category: '',
  description: '',
  features: [],
  images: [],
  colors: [],
  sizes: [],
  isFavorite: false
})

// Product details from API
const productDetails = ref([])

// Computed property to show only sizes available for selected color
const availableSizesForColor = computed(() => {
  if (!selectedColor.value || !product.value.variants) {
    return product.value.sizes || []
  }
  
  // Filter variants that match the selected color
  const colorVariants = product.value.variants.filter(variant => 
    variant.colorId === selectedColor.value.id
  )
  
  // Create size objects with stock and price from matching variants
  const sizesForColor = colorVariants.map(variant => ({
    size: variant.size,
    sizeId: variant.sizeId,
    stock: variant.stock,
    price: variant.price
  }))
  
  return sizesForColor
})

const selectedVariant = computed(() => {
  return {
    price: selectedSize.value?.price || product.value.sizes[0]?.price || 2890000,
    originalPrice: 3200000,
    discount: 10
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = () => {
  if (selectedColor.value && selectedSize.value && selectedSize.value.stock > 0) {
    const cartItem = {
      id: `${product.value.id}-${selectedColor.value.code}-${selectedSize.value.size}`,
      productId: product.value.id,
      name: product.value.name,
      brand: product.value.brand,
      color: selectedColor.value.name,
      colorCode: selectedColor.value.code,
      size: selectedSize.value.size,
      price: selectedSize.value.price,
      image: product.value.images[0],
      quantity: 1
    }
    
    if (addToCartAction) {
      addToCartAction(cartItem)
    }
    
    console.log('Đã thêm vào giỏ hàng:', cartItem)
  }
}

const toggleFavorite = () => {
  product.value.isFavorite = !product.value.isFavorite
  console.log(`${product.value.isFavorite ? 'Đã thêm' : 'Đã xóa'} khỏi danh sách yêu thích`)
}

// Load product data from API
const loadProductData = async () => {
  try {
    loading.value = true
    const productId = route.params.id
    
    // Get product details
    const detailsResponse = await productAPI.getProductDetails(productId)
    productDetails.value = detailsResponse
    
    if (detailsResponse && detailsResponse.length > 0) {
      const firstDetail = detailsResponse[0]
      const mappedProduct = mapBackendToFrontend.productDetail(firstDetail)
      
      // Build product object from details
      product.value = {
        id: mappedProduct.productId,
        name: mappedProduct.name,
        brand: mappedProduct.brand,
        category: mappedProduct.danhMuc || 'Chưa phân loại',
        description: mappedProduct.description || 'Sản phẩm chất lượng cao với thiết kế hiện đại và tính năng vượt trội.',
        features: [
          'Chất liệu cao cấp',
          'Thiết kế hiện đại',
          'Thoải mái khi sử dụng',
          'Độ bền cao'
        ],
        images: [mappedProduct.imageUrl],
        colors: [],
        sizes: [],
        isFavorite: false
      }
      
      // Group details by color and size with proper variant mapping
      const colorMap = new Map()
      const colorSizeVariants = new Map() // Track color-size combinations
      
      detailsResponse.forEach(detail => {
        const mappedDetail = mapBackendToFrontend.productDetail(detail)
        
        // Add unique colors with hex codes
        if (!colorMap.has(mappedDetail.color)) {
          colorMap.set(mappedDetail.color, {
            name: mappedDetail.color,
            code: mappedDetail.colorCode,
            id: mappedDetail.colorId
          })
        }
        
        // Track color-size combinations for proper variant mapping
        const variantKey = `${mappedDetail.color}-${mappedDetail.size}`
        colorSizeVariants.set(variantKey, {
          color: mappedDetail.color,
          colorCode: mappedDetail.colorCode,
          colorId: mappedDetail.colorId,
          size: mappedDetail.size,
          sizeId: mappedDetail.sizeId,
          stock: mappedDetail.stock,
          price: mappedDetail.price,
          detailId: mappedDetail.id
        })
        
        // Add more images if available
        if (mappedDetail.imageUrl && !product.value.images.includes(mappedDetail.imageUrl)) {
          product.value.images.push(mappedDetail.imageUrl)
        }
      })
      
      // Set colors from unique color map
      product.value.colors = Array.from(colorMap.values())
      
      // Create sizes array with all available sizes across colors
      const allSizes = new Map()
      colorSizeVariants.forEach(variant => {
        if (!allSizes.has(variant.size)) {
          allSizes.set(variant.size, {
            size: variant.size,
            sizeId: variant.sizeId,
            stock: 0,
            price: variant.price
          })
        }
        // Add stock from this variant
        allSizes.get(variant.size).stock += variant.stock
      })
      
      product.value.sizes = Array.from(allSizes.values())
      
      // Store variant mapping for color-size selection
      product.value.variants = Array.from(colorSizeVariants.values())
      
      // Set default selections
      selectedImage.value = product.value.images[0]
      selectedColor.value = product.value.colors[0]
      
      // Set default size based on selected color's available sizes
      if (selectedColor.value && product.value.variants) {
        const colorVariants = product.value.variants.filter(variant => 
          variant.colorId === selectedColor.value.id && variant.stock > 0
        )
        if (colorVariants.length > 0) {
          selectedSize.value = {
            size: colorVariants[0].size,
            sizeId: colorVariants[0].sizeId,
            stock: colorVariants[0].stock,
            price: colorVariants[0].price
          }
        }
      } else {
        selectedSize.value = product.value.sizes.find(s => s.stock > 0) || product.value.sizes[0]
      }
    }
  } catch (error) {
    console.error('Error loading product data:', error)
    // Set default fallback data
    product.value = {
      id: route.params.id,
      name: 'Sản phẩm không tìm thấy',
      brand: 'Unknown',
      category: 'Chưa phân loại',
      description: 'Không thể tải thông tin sản phẩm.',
      features: [],
      images: ['/sneakers/sneakers-1-alt1.jpg'],
      colors: [{ name: 'Đen', code: '#000000' }],
      sizes: [{ size: '42', stock: 0, price: 0 }],
      isFavorite: false
    }
    selectedImage.value = product.value.images[0]
    selectedColor.value = product.value.colors[0]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProductData()
})
</script>
