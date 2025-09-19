<template>
  <div class="product-detail-page">
    <!-- Loading state -->
    <div v-if="pageLoading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="pageError" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Không thể tải thông tin sản phẩm</h3>
        <p>{{ pageError }}</p>
        <button @click="loadProductDetail" class="retry-btn">
          <i class="fas fa-redo"></i>
          Thử lại
        </button>
      </div>
    </div>

    <!-- Product detail content -->
    <div v-else-if="product" class="product-detail-container">
      <div class="container">
        <div class="row">
          <!-- Product Images -->
          <div class="col-lg-6">
            <div class="product-images">
              <div class="main-image">
                <img 
                  :src="selectedImage" 
                  :alt="product.tenSanPham"
                  @error="handleImageError"
                />
              </div>
              
              <div v-if="productImages.length > 1" class="image-thumbnails">
                <div 
                  v-for="(image, index) in productImages" 
                  :key="index"
                  class="thumbnail"
                  :class="{ active: selectedImage === image }"
                  @click="selectedImage = image"
                >
                  <img :src="image" :alt="`${product.tenSanPham} ${index + 1}`" />
                </div>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-6">
            <div class="product-info">
              <!-- Breadcrumb -->
              <nav class="breadcrumb">
                <a href="/">Trang chủ</a>
                <span>/</span>
                <a href="/products">Sản phẩm</a>
                <span>/</span>
                <span>{{ product.tenSanPham }}</span>
              </nav>

              <!-- Product basic info -->
              <div class="product-header">
                <div class="brand">{{ product.brand || product.thuongHieu?.tenThuongHieu }}</div>
                <h1 class="product-title">{{ product.tenSanPham }}</h1>
                <div class="product-code">Mã sản phẩm: {{ product.ma }}</div>
                
                <div class="price-section">
                  <div class="current-price">{{ formatPrice(selectedVariant?.giaBan || product.giaBanThapNhat) }}</div>
                  <div v-if="product.stock > 0" class="stock-status in-stock">
                    <i class="fas fa-check-circle"></i>
                    Còn hàng
                  </div>
                  <div v-else class="stock-status out-of-stock">
                    <i class="fas fa-times-circle"></i>
                    Hết hàng
                  </div>
                </div>
              </div>

              <!-- Product selection -->
              <div class="product-selection">
                <!-- Color selection -->
                <div class="selection-group">
                  <label class="selection-label">
                    Màu sắc: 
                    <span v-if="selectedColor" class="selected-value">{{ selectedColor.tenMauSac }}</span>
                  </label>
                  <div class="color-options">
                    <div 
                      v-for="color in availableColors" 
                      :key="color.id"
                      class="color-option"
                      :class="{ 
                        active: selectedColor?.id === color.id,
                        disabled: !isColorAvailable(color)
                      }"
                      @click="selectColor(color)"
                    >
                      <div 
                        class="color-swatch" 
                        :style="{ backgroundColor: color.hex || color.colorCode }"
                      ></div>
                      <span class="color-name">{{ color.tenMauSac }}</span>
                    </div>
                  </div>
                </div>

                <!-- Size selection -->
                <div class="selection-group">
                  <label class="selection-label">
                    Kích cỡ: 
                    <span v-if="selectedSize" class="selected-value">{{ selectedSize.tenKichCo }}</span>
                  </label>
                  <div class="size-options">
                    <div 
                      v-for="size in availableSizes" 
                      :key="size.id"
                      class="size-option"
                      :class="{ 
                        active: selectedSize?.id === size.id,
                        disabled: !isSizeAvailable(size)
                      }"
                      @click="selectSize(size)"
                    >
                      {{ size.tenKichCo }}
                    </div>
                  </div>
                </div>

                <!-- Quantity selection -->
                <div v-if="selectedVariant" class="selection-group">
                  <label class="selection-label">Số lượng:</label>
                  <div class="quantity-controls">
                    <button 
                      @click="decreaseQuantity" 
                      :disabled="quantity <= 1"
                      class="quantity-btn"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      v-model.number="quantity" 
                      type="number" 
                      min="1" 
                      :max="maxQuantity"
                      class="quantity-input"
                    />
                    <button 
                      @click="increaseQuantity" 
                      :disabled="quantity >= maxQuantity"
                      class="quantity-btn"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <div class="stock-info">
                    Còn lại: <strong>{{ maxQuantity }}</strong> sản phẩm
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="product-actions">
                <button
                  @click="addToCart"
                  :disabled="!canAddToCart || cartLoading"
                  class="add-to-cart-btn"
                >
                  <i class="fas fa-shopping-cart"></i>
                  {{ cartLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
                </button>
                
                <button @click="buyNow" class="buy-now-btn" :disabled="!canAddToCart">
                  <i class="fas fa-bolt"></i>
                  Mua ngay
                </button>
              </div>

              <!-- Success/Error messages -->
              <div v-if="message" :class="`message message-${messageType}`">
                <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                {{ message }}
              </div>

              <!-- Product attributes -->
              <div class="product-attributes">
                <div class="attribute-item">
                  <span class="label">Danh mục:</span>
                  <span class="value">{{ product.danhMuc || product.categoryName }}</span>
                </div>
                <div v-if="selectedVariant?.chatLieu" class="attribute-item">
                  <span class="label">Chất liệu:</span>
                  <span class="value">{{ selectedVariant.chatLieu }}</span>
                </div>
                <div v-if="product.quocGiaSanXuat" class="attribute-item">
                  <span class="label">Xuất xứ:</span>
                  <span class="value">{{ product.quocGiaSanXuat }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product description -->
        <div v-if="product.moTa || product.description" class="product-description">
          <h3>Mô tả sản phẩm</h3>
          <div class="description-content" v-html="product.moTa || product.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { productAPI } from '@/services/productAPI'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { addToCart: addToCartService } = useCart()

    // State
    const product = ref(null)
    const productDetails = ref([])
    const selectedColor = ref(null)
    const selectedSize = ref(null)
    const selectedImage = ref('')
    const quantity = ref(1)
    const pageLoading = ref(true)
    const cartLoading = ref(false)
    const pageError = ref('')
    const message = ref('')
    const messageType = ref('success')

    // Computed properties
    const availableColors = computed(() => {
      const colorMap = new Map()
      productDetails.value.forEach(detail => {
        if (!detail.deleted && detail.soLuongTonKho > 0) {
          const color = detail.idMauSac
          if (!colorMap.has(color.id)) {
            colorMap.set(color.id, {
              ...color,
              hex: color.hex || color.ma,
              colorCode: color.hex || color.ma
            })
          }
        }
      })
      return Array.from(colorMap.values())
    })

    const availableSizes = computed(() => {
      if (!selectedColor.value) return []
      
      const sizeMap = new Map()
      productDetails.value.forEach(detail => {
        if (!detail.deleted && 
            detail.soLuongTonKho > 0 && 
            detail.idMauSac.id === selectedColor.value.id) {
          const size = detail.idKichCo
          if (!sizeMap.has(size.id)) {
            sizeMap.set(size.id, size)
          }
        }
      })
      return Array.from(sizeMap.values())
    })

    const selectedVariant = computed(() => {
      if (!selectedColor.value || !selectedSize.value) return null
      
      return productDetails.value.find(detail => 
        !detail.deleted &&
        detail.idMauSac.id === selectedColor.value.id && 
        detail.idKichCo.id === selectedSize.value.id
      )
    })

    const maxQuantity = computed(() => {
      return selectedVariant.value?.soLuongTonKho || 0
    })

    const canAddToCart = computed(() => {
      return selectedColor.value && 
             selectedSize.value && 
             selectedVariant.value && 
             quantity.value > 0 && 
             quantity.value <= maxQuantity.value
    })

    const productImages = computed(() => {
      const images = []
      
      // Main product image
      if (product.value?.urlAnhDaiDien) {
        images.push(product.value.urlAnhDaiDien)
      }
      
      // Variant images
      productDetails.value.forEach(detail => {
        if (detail.idAnhSanPham?.urlAnh && !images.includes(detail.idAnhSanPham.urlAnh)) {
          images.push(detail.idAnhSanPham.urlAnh)
        }
      })
      
      // Fallback image
      if (images.length === 0) {
        images.push('/sneakers/sneakers-1-alt1.jpg')
      }
      
      return images
    })

    // Methods
    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    }

    const handleImageError = (event) => {
      event.target.src = '/sneakers/sneakers-1-alt1.jpg'
    }

    const loadProductDetail = async () => {
      try {
        pageLoading.value = true
        pageError.value = ''
        
        const productId = route.params.id
        const details = await productAPI.getProductDetails(productId)
        
        if (!details || details.length === 0) {
          throw new Error('Không tìm thấy thông tin sản phẩm')
        }
        
        productDetails.value = details
        product.value = details[0].idSanPham
        selectedImage.value = productImages.value[0]
        
        // Auto-select first options if coming from add-to-cart action
        if (route.query.action === 'add-to-cart') {
          await nextTick()
          autoSelectFirstOptions()
        }
        
      } catch (error) {
        console.error('Error loading product detail:', error)
        pageError.value = error.message
      } finally {
        pageLoading.value = false
      }
    }

    const autoSelectFirstOptions = () => {
      if (availableColors.value.length > 0) {
        selectColor(availableColors.value[0])
      }
    }

    const isColorAvailable = (color) => {
      return productDetails.value.some(detail => 
        !detail.deleted &&
        detail.soLuongTonKho > 0 &&
        detail.idMauSac.id === color.id
      )
    }

    const isSizeAvailable = (size) => {
      if (!selectedColor.value) return false
      
      return productDetails.value.some(detail => 
        !detail.deleted &&
        detail.soLuongTonKho > 0 &&
        detail.idMauSac.id === selectedColor.value.id &&
        detail.idKichCo.id === size.id
      )
    }

    const selectColor = (color) => {
      if (!isColorAvailable(color)) return
      
      selectedColor.value = color
      selectedSize.value = null // Reset size when color changes
      
      // Update image if variant has specific image
      const variantWithImage = productDetails.value.find(detail => 
        detail.idMauSac.id === color.id && detail.idAnhSanPham?.urlAnh
      )
      if (variantWithImage) {
        selectedImage.value = variantWithImage.idAnhSanPham.urlAnh
      }
      
      // Auto-select first available size
      nextTick(() => {
        if (availableSizes.value.length > 0) {
          selectSize(availableSizes.value[0])
        }
      })
    }

    const selectSize = (size) => {
      if (!isSizeAvailable(size)) return
      selectedSize.value = size
    }

    const increaseQuantity = () => {
      if (quantity.value < maxQuantity.value) {
        quantity.value++
      }
    }

    const decreaseQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = async () => {
      if (!canAddToCart.value) return
      
      cartLoading.value = true
      
      try {
        await addToCartService(selectedVariant.value, quantity.value)
        
        showMessage('Đã thêm sản phẩm vào giỏ hàng!', 'success')
        quantity.value = 1 // Reset quantity
        
      } catch (error) {
        showMessage(error.message, 'error')
      } finally {
        cartLoading.value = false
      }
    }

    const buyNow = async () => {
      await addToCart()
      
      if (!cartLoading.value && messageType.value === 'success') {
        // Redirect to cart page
        router.push('/cart')
      }
    }

    const showMessage = (text, type) => {
      message.value = text
      messageType.value = type
      
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }

    // Lifecycle
    onMounted(() => {
      loadProductDetail()
    })

    return {
      // State
      product,
      productDetails,
      selectedColor,
      selectedSize,
      selectedImage,
      quantity,
      pageLoading,
      cartLoading,
      pageError,
      message,
      messageType,

      // Computed
      availableColors,
      availableSizes,
      selectedVariant,
      maxQuantity,
      canAddToCart,
      productImages,

      // Methods
      formatPrice,
      handleImageError,
      loadProductDetail,
      isColorAvailable,
      isSizeAvailable,
      selectColor,
      selectSize,
      increaseQuantity,
      decreaseQuantity,
      addToCart,
      buyNow,
      showMessage
    }
  }
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 20px 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
}

.error-message {
  max-width: 400px;

  i {
    font-size: 48px;
    color: #dc3545;
    margin-bottom: 16px;
  }

  h3 {
    color: #212529;
    margin-bottom: 8px;
  }

  p {
    color: #6c757d;
    margin-bottom: 24px;
  }

  .retry-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background: #0056b3;
    }
  }
}

.product-detail-container {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.product-images {
  .main-image {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-thumbnails {
    display: flex;
    gap: 8px;
    overflow-x: auto;

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s ease;

      &.active {
        border-color: #007bff;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.product-info {
  padding-left: 40px;

  .breadcrumb {
    font-size: 14px;
    color: #6c757d;
    margin-bottom: 16px;

    a {
      color: #007bff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    span {
      margin: 0 8px;
    }
  }

  .product-header {
    margin-bottom: 32px;

    .brand {
      color: #6c757d;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .product-title {
      font-size: 32px;
      font-weight: 700;
      color: #212529;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .product-code {
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 16px;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 16px;

      .current-price {
        font-size: 28px;
        font-weight: 700;
        color: #dc3545;
      }

      .stock-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;

        &.in-stock {
          color: #28a745;
        }

        &.out-of-stock {
          color: #dc3545;
        }
      }
    }
  }

  .product-selection {
    margin-bottom: 32px;

    .selection-group {
      margin-bottom: 24px;

      .selection-label {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #212529;
        margin-bottom: 12px;

        .selected-value {
          color: #007bff;
          font-weight: 500;
        }
      }
    }

    .color-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .color-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(.disabled) {
          border-color: #007bff;
        }

        &.active {
          border-color: #007bff;
          background: #f8f9fa;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #dee2e6;
        }

        .color-name {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .size-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .size-option {
        min-width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover:not(.disabled) {
          border-color: #007bff;
        }

        &.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .quantity-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #dee2e6;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          border-color: #007bff;
          color: #007bff;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .quantity-input {
        width: 80px;
        height: 40px;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        text-align: center;
        font-weight: 600;
        font-size: 16px;

        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }
    }

    .stock-info {
      font-size: 14px;
      color: #6c757d;
    }
  }

  .product-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;

    button {
      flex: 1;
      padding: 16px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .add-to-cart-btn {
      background: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background: #0056b3;
        transform: translateY(-2px);
      }
    }

    .buy-now-btn {
      background: #28a745;
      color: white;

      &:hover:not(:disabled) {
        background: #1e7e34;
        transform: translateY(-2px);
      }
    }
  }

  .message {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;

    &.message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &.message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }

  .product-attributes {
    .attribute-item {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        font-weight: 600;
        color: #6c757d;
        min-width: 100px;
      }

      .value {
        color: #212529;
      }
    }
  }
}

.product-description {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #dee2e6;

  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #212529;
    margin-bottom: 16px;
  }

  .description-content {
    color: #495057;
    line-height: 1.6;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 992px) {
  .product-info {
    padding-left: 0;
    margin-top: 32px;
  }
}

@media (max-width: 768px) {
  .product-info {
    .product-header .product-title {
      font-size: 24px;
    }

    .product-actions {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
}
</style>
