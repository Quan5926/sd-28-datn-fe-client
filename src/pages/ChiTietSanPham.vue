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
                v-for="size in product.sizes"
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
              Còn {{ selectedSize.stock }} sản phẩm
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

const route = useRoute()
const router = useRouter()
const { addToCart: addToCartAction } = inject('cartActions', {})

const selectedImage = ref('')
const selectedSize = ref(null)
const selectedColor = ref(null)

// Fake product data
const product = ref({
  id: 1,
  name: 'Nike Air Max 270 React',
  brand: 'Nike',
  category: 'Giày thể thao nam',
  description: 'Nike Air Max 270 React kết hợp thiết kế iconic của Air Max với công nghệ React foam tiên tiến, mang đến trải nghiệm êm ái và năng động cho mọi bước chân.',
  features: [
    'Đế React foam siêu nhẹ và đàn hồi',
    'Đơn vị Air Max 270 độc quyền',
    'Upper mesh thoáng khí',
    'Thiết kế hiện đại, phù hợp nhiều phong cách'
  ],
  images: [
    '/sneakers/sneakers-1-alt1.jpg',
    '/sneakers/sneakers-1-alt2.jpg',
    '/sneakers/sneakers-1-alt3.jpg',
    '/sneakers/sneakers-2-alt1.jpg'
  ],
  colors: [
    { name: 'Đen', code: '#000000' },
    { name: 'Trắng', code: '#FFFFFF' },
    { name: 'Đỏ', code: '#FF0000' },
    { name: 'Xanh dương', code: '#0066CC' },
    { name: 'Xám', code: '#708090' }
  ],
  sizes: [
    { size: '39', stock: 5, price: 2890000 },
    { size: '40', stock: 3, price: 2890000 },
    { size: '41', stock: 8, price: 2890000 },
    { size: '42', stock: 0, price: 2890000 },
    { size: '43', stock: 2, price: 2890000 },
    { size: '44', stock: 6, price: 2890000 }
  ],
  isFavorite: false
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

onMounted(() => {
  selectedImage.value = product.value.images[0]
  selectedColor.value = product.value.colors[0] // Set default color
  
  // Load product based on route params
  const productId = route.params.id
  console.log('Loading product:', productId)
})
</script>
