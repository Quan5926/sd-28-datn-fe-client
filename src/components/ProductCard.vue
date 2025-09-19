<template>
  <div class="product-card" :class="{ 'out-of-stock': product.stock <= 0 }">
    <!-- Product Image -->
    <div class="product-image" @click="goToProductDetail">
      <img 
        :src="product.imageUrl || product.urlAnhDaiDien" 
        :alt="product.tenSanPham"
        @error="handleImageError"
      />
      
      <!-- Stock badge -->
      <div v-if="product.stock <= 0" class="stock-badge out-of-stock">
        Hết hàng
      </div>
      <div v-else-if="product.stock <= 5" class="stock-badge low-stock">
        Còn {{ product.stock }}
      </div>

      <!-- Favorite button -->
      <button class="favorite-btn" @click.stop="toggleFavorite">
        <i :class="product.isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      <div class="product-brand">{{ product.brand || product.thuongHieu?.tenThuongHieu }}</div>
      <h3 class="product-name" @click="goToProductDetail">{{ product.tenSanPham }}</h3>
      <div class="product-price">
        <span class="current-price">{{ formatPrice(product.price || product.giaBanThapNhat) }}</span>
      </div>
      
      <!-- Product attributes -->
      <div class="product-attributes">
        <div v-if="product.colors && product.colors.length > 0" class="colors">
          <span class="label">Màu:</span>
          <div class="color-swatches">
            <span 
              v-for="color in product.colors.slice(0, 3)" 
              :key="color"
              class="color-swatch"
              :style="{ backgroundColor: color }"
            ></span>
            <span v-if="product.colors.length > 3" class="more-colors">
              +{{ product.colors.length - 3 }}
            </span>
          </div>
        </div>
        
        <div v-if="product.sizes && product.sizes.length > 0" class="sizes">
          <span class="label">Size:</span>
          <span class="size-list">{{ product.sizes.slice(0, 3).join(', ') }}</span>
          <span v-if="product.sizes.length > 3" class="more-sizes">...</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="product-actions">
      <button 
        v-if="product.stock > 0"
        @click="handleAddToCart" 
        class="add-to-cart-btn"
        :disabled="loading"
      >
        <i class="fas fa-shopping-cart"></i>
        {{ loading ? 'Đang thêm...' : 'Thêm giỏ hàng' }}
      </button>
      
      <button 
        v-else
        class="out-of-stock-btn"
        disabled
      >
        <i class="fas fa-ban"></i>
        Hết hàng
      </button>

      <button @click="goToProductDetail" class="view-detail-btn">
        <i class="fas fa-eye"></i>
        Chi tiết
      </button>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
import { useCart } from '@/composables/useCart'
import { ref } from 'vue'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['favorite-toggled', 'added-to-cart'],
  setup(props, { emit }) {
    const { addToCart } = useCart()
    const loading = ref(false)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price)
    }

    const handleImageError = (event) => {
      event.target.src = '/sneakers/sneakers-1-alt1.jpg'
    }

    const goToProductDetail = () => {
      // Router đến trang chi tiết sản phẩm
      window.location.href = `/product/${props.product.id}`
    }

    const toggleFavorite = () => {
      emit('favorite-toggled', props.product)
    }

    const handleAddToCart = () => {
      // Router đến trang chi tiết để chọn màu/size
      window.location.href = `/product/${props.product.id}?action=add-to-cart`
    }

    return {
      loading,
      formatPrice,
      handleImageError,
      goToProductDetail,
      toggleFavorite,
      handleAddToCart
    }
  }
}
</script>

<style lang="scss" scoped>
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &.out-of-stock {
    opacity: 0.7;
    
    .product-image img {
      filter: grayscale(50%);
    }
  }
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .stock-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;

    &.out-of-stock {
      background: #dc3545;
    }

    &.low-stock {
      background: #fd7e14;
    }
  }

  .favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: white;
      transform: scale(1.1);
    }

    i {
      color: #dc3545;
      font-size: 16px;
    }
  }
}

.product-info {
  padding: 16px;

  .product-brand {
    color: #6c757d;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #212529;
    margin: 0 0 8px 0;
    cursor: pointer;
    transition: color 0.3s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      color: #007bff;
    }
  }

  .product-price {
    margin-bottom: 12px;

    .current-price {
      font-size: 18px;
      font-weight: 700;
      color: #dc3545;
    }
  }

  .product-attributes {
    .colors, .sizes {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 12px;

      .label {
        font-weight: 500;
        margin-right: 6px;
        color: #6c757d;
      }
    }

    .color-swatches {
      display: flex;
      align-items: center;
      gap: 4px;

      .color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px #dee2e6;
      }

      .more-colors {
        font-size: 10px;
        color: #6c757d;
        margin-left: 4px;
      }
    }

    .size-list {
      color: #495057;
    }

    .more-sizes {
      color: #6c757d;
      margin-left: 4px;
    }
  }
}

.product-actions {
  padding: 0 16px 16px;
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    i {
      font-size: 14px;
    }
  }

  .add-to-cart-btn {
    background: #007bff;
    color: white;

    &:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .out-of-stock-btn {
    background: #6c757d;
    color: white;
    cursor: not-allowed;
  }

  .view-detail-btn {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;

    &:hover {
      background: #007bff;
      color: white;
    }
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 768px) {
  .product-card {
    .product-info {
      padding: 12px;

      .product-name {
        font-size: 14px;
      }

      .product-price .current-price {
        font-size: 16px;
      }
    }

    .product-actions {
      padding: 0 12px 12px;

      button {
        padding: 8px 12px;
        font-size: 12px;
      }
    }
  }
}
</style>
