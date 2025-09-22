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
            <!-- Show discount price if available -->
            <span v-if="selectedVariant.hasDiscount && selectedVariant.giaGiamGia" class="text-3xl font-bold text-green-600">
              {{ formatPrice(selectedVariant.giaGiamGia) }}
            </span>
            <!-- Show regular price if no discount -->
            <span v-else class="text-3xl font-bold text-gray-900">
              {{ formatPrice(selectedVariant.price) }}
            </span>
            
            <!-- Show original price (crossed out) when there's discount -->
            <span v-if="selectedVariant.hasDiscount && selectedVariant.giaGiamGia" class="text-xl text-gray-500 line-through">
              {{ formatPrice(selectedVariant.price) }}
            </span>
            
            <!-- Show campaign name if available -->
            <span v-if="selectedVariant.tenDotGiamGia" class="bg-green-500 text-white px-3 py-1 text-sm font-bold rounded-full">
              <i class="fas fa-tag mr-1"></i>{{ selectedVariant.tenDotGiamGia }}
            </span>
          </div>

          <!-- Color Selection -->
          <div class="color-selection">
            <h3 class="text-lg font-semibold mb-3">Chọn màu sắc</h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="(color, index) in product.colors"
                :key="index"
                @click="selectColor(color)"
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
                @click="selectSize(size)"
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
              Còn {{ selectedSize.stock }} sản phẩm - 
              <span v-if="selectedVariant.hasDiscount && selectedVariant.giaGiamGia" class="font-semibold text-green-600">
                {{ formatPrice(selectedVariant.giaGiamGia) }}
              </span>
              <span v-else class="font-semibold">
                {{ formatPrice(selectedSize.price) }}
              </span>
            </p>
          </div>

          <!-- Add to Cart -->
          <div class="space-y-4">
            <button
              @click="addToCart"
              :disabled="!selectedColor || !selectedSize || selectedSize.stock === 0"
              class="w-full bg-black text-white py-4 px-8 rounded-full font-semibold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {{ addToCartButtonText }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { productAPI, mapBackendToFrontend } from '../services/productAPI.js'
import { cartService } from '../services/cartAPI.js'
import { useStockUpdates } from '@/composables/useStockUpdates'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { watchStock, getStock } = useStockUpdates()

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

// Computed property for button text based on action
const addToCartButtonText = computed(() => {
  const action = route.query.action
  const baseText = action === 'buy-now' ? 'Mua ngay' : 'Thêm vào giỏ hàng'
  
  if (!selectedColor.value) return 'Chọn màu sắc'
  if (!selectedSize.value) return 'Chọn kích cỡ'
  if (selectedSize.value.stock === 0) return 'Hết hàng'
  return baseText
})

// Computed property to show only sizes available for selected color
const availableSizesForColor = computed(() => {
  if (!selectedColor.value || !productDetails.value.length) {
    return product.value.sizes || []
  }
  
  // Filter product details that match the selected color
  const colorDetails = productDetails.value.filter(detail => {
    const mappedDetail = mapBackendToFrontend.productDetail(detail)
    return mappedDetail.colorId === selectedColor.value.id
  })
  
  // Create size objects with stock and price from matching details
  const sizesForColor = colorDetails.map(detail => {
    const mappedDetail = mapBackendToFrontend.productDetail(detail)
    return {
      size: mappedDetail.size,
      sizeId: mappedDetail.sizeId,
      stock: mappedDetail.stock,
      price: mappedDetail.price
    }
  })
  
  return sizesForColor
})

const selectedVariant = computed(() => {
  // Find the actual product detail for selected color and size
  const selectedDetail = productDetails.value.find(detail => {
    const mappedDetail = mapBackendToFrontend.productDetail(detail)
    return mappedDetail.colorId === selectedColor.value?.id && 
           mappedDetail.sizeId === selectedSize.value?.sizeId
  })
  
  if (selectedDetail) {
    const mappedDetail = mapBackendToFrontend.productDetail(selectedDetail)
    const variant = {
      price: mappedDetail.price,
      giaGiamGia: mappedDetail.giaGiamGia,
      tenDotGiamGia: mappedDetail.tenDotGiamGia,
      hasDiscount: mappedDetail.hasDiscount,
      stock: mappedDetail.stock
    }
    
    console.log('Selected variant with discount info:', variant)
    return variant
  }
  
  // Fallback if no detail found
  return {
    price: selectedSize.value?.price || product.value.sizes[0]?.price || 2890000,
    giaGiamGia: null,
    tenDotGiamGia: null,
    hasDiscount: false,
    stock: 0
  }
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = async () => {
  if (selectedColor.value && selectedSize.value && selectedSize.value.stock > 0) {
    try {
      loading.value = true
      
      // Find the exact product detail ID from productDetails array
      console.log('Searching for product detail with:', {
        selectedColorId: selectedColor.value.id,
        selectedSizeId: selectedSize.value.sizeId,
        availableDetails: productDetails.value.map(detail => {
          const mapped = mapBackendToFrontend.productDetail(detail)
          return {
            id: mapped.id,
            colorId: mapped.colorId,
            sizeId: mapped.sizeId,
            color: mapped.color,
            size: mapped.size
          }
        })
      })
      
      const selectedDetail = productDetails.value.find(detail => {
        const mappedDetail = mapBackendToFrontend.productDetail(detail)
        return mappedDetail.colorId === selectedColor.value.id && 
               mappedDetail.sizeId === selectedSize.value.sizeId
      })
      
      if (!selectedDetail) {
        console.error('Không tìm thấy chi tiết sản phẩm phù hợp')
        console.error('Available details:', productDetails.value)
        return
      }
      
      const mappedDetail = mapBackendToFrontend.productDetail(selectedDetail)
      
      // Debug: Log the selected detail info
      console.log('Selected Detail Info:', {
        selectedColorId: selectedColor.value.id,
        selectedSizeId: selectedSize.value.sizeId,
        foundDetailId: mappedDetail.id,
        detailColor: mappedDetail.color,
        detailSize: mappedDetail.size,
        detailPrice: mappedDetail.price,
        detailStock: mappedDetail.stock
      })
      
      // Add to cart using cartService - use discount price if available
      const finalPrice = mappedDetail.hasDiscount && mappedDetail.giaGiamGia 
        ? mappedDetail.giaGiamGia 
        : mappedDetail.price
        
      const cartResult = await cartService.addToCart(
        mappedDetail.id, // Real database ID
        1, // quantity
        finalPrice // Use discount price if available
      )
      
      console.log('Add to cart result:', cartResult)
      
      // Small delay to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Xử lý action từ query parameter
      const action = route.query.action
      if (action === 'buy-now') {
        // Nếu là "mua ngay", chuyển thẳng đến checkout
        toast.success('Đã thêm vào giỏ hàng! Chuyển đến thanh toán...', {
          position: 'top-center',
          timeout: 2000,
          icon: "✅"
        })
        setTimeout(() => {
          router.push('/checkout')
        }, 1000)
      } else {
        // Nếu là "thêm giỏ hàng", chuyển đến trang giỏ hàng
        toast.success('Đã thêm vào giỏ hàng thành công!', {
          position: 'top-center',
          timeout: 2000,
          icon: "🛒"
        })
        setTimeout(() => {
          router.push('/cart')
        }, 1000)
      }
      
      console.log('Đã thêm vào giỏ hàng thành công')
      
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error)
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!', {
        position: 'top-center',
        timeout: 3000,
        icon: "❌"
      })
    } finally {
      loading.value = false
    }
  }
}

const toggleFavorite = () => {
  product.value.isFavorite = !product.value.isFavorite
  console.log(`${product.value.isFavorite ? 'Đã thêm' : 'Đã xóa'} khỏi danh sách yêu thích`)
}

// Handle color selection with debug
const selectColor = (color) => {
  selectedColor.value = color
  selectedSize.value = null // Reset size when color changes
  
  console.log('Color selected:', {
    colorName: color.name,
    colorId: color.id,
    colorCode: color.code
  })
  
  // Auto-select first available size for this color
  const availableSizes = availableSizesForColor.value.filter(size => size.stock > 0)
  if (availableSizes.length > 0) {
    selectSize(availableSizes[0])
  }
}

// Handle size selection with debug
const selectSize = (size) => {
  selectedSize.value = size
  
  console.log('Size selected:', {
    sizeName: size.size,
    sizeId: size.sizeId,
    stock: size.stock,
    price: size.price
  })
}

// Load product data from API
const loadProductData = async () => {
  try {
    loading.value = true
    const productId = route.params.id
    
    // Get product details (keep original logic)
    const detailsResponse = await productAPI.getProductDetails(productId)
    productDetails.value = detailsResponse
    
    // Try to enrich with discount information
    try {
      const discountDetails = await productAPI.getProductDetailsWithDiscount(productId)
      console.log('Raw discount details from API:', discountDetails)
      
      // Create a map of discount information by detail ID
      const discountMap = new Map()
      discountDetails.forEach(detail => {
        console.log('Processing discount detail:', detail)
        discountMap.set(detail.id, {
          giaGiamGia: detail.giaGiamGia,
          tenDotGiamGia: detail.tenDotGiamGia,
          hasDiscount: detail.hasDiscount
        })
      })
      
      // Enrich existing product details with discount information
      productDetails.value.forEach(detail => {
        const discountInfo = discountMap.get(detail.id)
        if (discountInfo && discountInfo.hasDiscount && discountInfo.giaGiamGia) {
          detail.giaGiamGia = discountInfo.giaGiamGia
          detail.tenDotGiamGia = discountInfo.tenDotGiamGia
          detail.hasDiscount = discountInfo.hasDiscount
          console.log(`Enriched detail ${detail.id} with discount:`, {
            originalPrice: detail.giaBan,
            discountPrice: detail.giaGiamGia,
            campaignName: detail.tenDotGiamGia,
            hasDiscount: detail.hasDiscount
          })
        }
      })
      
      console.log('Product details enriched with discount info')
      console.log('Discount details from API:', discountDetails)
    } catch (discountError) {
      console.warn('Failed to enrich product details with discount, using regular details:', discountError)
    }
    
    // Debug: Log product details from API
    console.log('Product Details from API:', detailsResponse)
    console.log('Mapped Product Details:', detailsResponse.map(detail => {
      const mapped = mapBackendToFrontend.productDetail(detail)
      return {
        id: mapped.id,
        color: mapped.color,
        colorId: mapped.colorId,
        size: mapped.size,
        sizeId: mapped.sizeId,
        stock: mapped.stock,
        price: mapped.price
      }
    }))
    
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
      
      // Watch stock updates for all product details
      productDetails.value.forEach(detail => {
        watchStock(detail.id, (productDetailId, newStock, oldStock) => {
          console.log(`Stock updated for product detail ${productDetailId}: ${oldStock} -> ${newStock}`)
          
          // Update the specific product detail stock
          const detailIndex = productDetails.value.findIndex(d => d.id === productDetailId)
          if (detailIndex !== -1) {
            productDetails.value[detailIndex].soLuongTonKho = newStock
            
            // Trigger reactivity by creating new array
            productDetails.value = [...productDetails.value]
            
            // Update selected size stock if it matches
            if (selectedSize.value && selectedSize.value.sizeId === productDetails.value[detailIndex].idKichCo?.id) {
              selectedSize.value.stock = newStock
            }
          }
        })
      })
      
      // Store variant mapping for color-size selection
      product.value.variants = Array.from(colorSizeVariants.values())
      
      // Set default selections
      selectedImage.value = product.value.images[0]
      selectedColor.value = product.value.colors[0]
      
      // Set default size based on selected color's available sizes
      if (selectedColor.value && productDetails.value.length > 0) {
        // Find sizes available for the selected color
        const colorDetails = productDetails.value.filter(detail => {
          const mappedDetail = mapBackendToFrontend.productDetail(detail)
          return mappedDetail.colorId === selectedColor.value.id && mappedDetail.stock > 0
        })
        
        if (colorDetails.length > 0) {
          const firstColorDetail = mapBackendToFrontend.productDetail(colorDetails[0])
          selectSize({
            size: firstColorDetail.size,
            sizeId: firstColorDetail.sizeId,
            stock: firstColorDetail.stock,
            price: firstColorDetail.price
          })
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

onMounted(async () => {
  await loadProductData()
  
  // Xử lý query parameters từ URL
  const action = route.query.action
  if (action === 'add-to-cart' || action === 'buy-now') {
    // Hiển thị thông báo yêu cầu chọn màu sắc và kích cỡ
    showActionMessage(action)
  }
})

// Hiển thị thông báo yêu cầu chọn thuộc tính
const showActionMessage = (action) => {
  const actionText = action === 'add-to-cart' ? 'thêm vào giỏ hàng' : 'mua ngay'
  
  // Hiển thị toast notification
  toast.info(`Vui lòng chọn màu sắc và kích cỡ để ${actionText}`, {
    position: 'top-center',
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: "🛍️",
    rtl: false
  })
  
  // Scroll đến phần chọn màu sắc và kích cỡ
  setTimeout(() => {
    const colorSection = document.querySelector('.color-selection')
    if (colorSection) {
      colorSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Thêm hiệu ứng highlight
      colorSection.classList.add('highlight-selection')
      setTimeout(() => {
        colorSection.classList.remove('highlight-selection')
      }, 3000)
    }
  }, 500)
}
</script>

<style scoped>
.highlight-selection {
  animation: highlight-pulse 3s ease-in-out;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
}

@keyframes highlight-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  25% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0.1);
  }
  75% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style>
