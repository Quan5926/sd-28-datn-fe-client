<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <h1><i class="fas fa-shopping-cart"></i> Giỏ hàng của bạn</h1>
        <div class="breadcrumb">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <span>Giỏ hàng</span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>

      <!-- Empty cart -->
      <div v-else-if="isEmpty" class="empty-cart">
        <div class="empty-cart-content">
          <i class="fas fa-shopping-cart"></i>
          <h3>Giỏ hàng trống</h3>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <a href="/products" class="continue-shopping-btn">
            <i class="fas fa-arrow-left"></i>
            Tiếp tục mua sắm
          </a>
        </div>
      </div>

      <!-- Cart content -->
      <div v-else class="cart-content">
        <div class="row">
          <!-- Cart items -->
          <div class="col-lg-8">
            <div class="cart-items">
              <div class="cart-items-header">
                <h3>Sản phẩm ({{ itemCount }})</h3>
                <button @click="clearAllItems" class="clear-all-btn" :disabled="loading">
                  <i class="fas fa-trash"></i>
                  Xóa tất cả
                </button>
              </div>

              <div class="cart-item-list">
                <!-- Debug info -->
                <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; font-size: 12px;">
                  <strong>Debug Cart Info:</strong><br>
                  Cart exists: {{ !!cart }}<br>
                  Cart ID: {{ cart?.id || 'N/A' }}<br>
                  Total Items: {{ cart?.totalItems || 'N/A' }}<br>
                  Items Array Length: {{ cart?.items?.length || 0 }}<br>
                  ItemCount computed: {{ itemCount }}<br>
                  IsEmpty computed: {{ isEmpty }}<br>
                  Loading: {{ loading }}<br>
                  <details>
                    <summary>Full Cart Data</summary>
                    <pre>{{ JSON.stringify(cart, null, 2) }}</pre>
                  </details>
                </div>
                
                <div 
                  v-for="item in cart.items" 
                  :key="item.id"
                  class="cart-item"
                >
                  <!-- Product image -->
                  <div class="item-image">
                    <img 
                      :src="item.urlAnhSanPham || '/sneakers/sneakers-1-alt1.jpg'" 
                      :alt="item.tenSanPham"
                      @error="handleImageError"
                    />
                  </div>

                  <!-- Product info -->
                  <div class="item-info">
                    <h4 class="item-name">{{ item.tenSanPham }}</h4>
                    <div class="item-attributes">
                      <span class="brand">{{ item.tenThuongHieu }}</span>
                      <span class="category">{{ item.tenDanhMuc }}</span>
                    </div>
                    <div class="item-variants">
                      <span class="color">
                        <span 
                          class="color-swatch" 
                          :style="{ backgroundColor: item.hexMauSac }"
                        ></span>
                        {{ item.tenMauSac }}
                      </span>
                      <span class="size">Size: {{ item.tenKichCo }}</span>
                    </div>
                    <div class="item-stock">
                      Còn lại: {{ item.soLuongTonKho }} sản phẩm
                    </div>
                  </div>

                  <!-- Quantity controls -->
                  <div class="item-quantity">
                    <div class="quantity-controls">
                      <button 
                        @click="decreaseQuantity(item)" 
                        :disabled="item.soLuong <= 1 || loading"
                        class="quantity-btn"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input 
                        :value="item.soLuong"
                        @input="updateQuantityInput(item, $event)"
                        type="number" 
                        min="1" 
                        :max="item.soLuongTonKho"
                        class="quantity-input"
                        :disabled="loading"
                      />
                      <button 
                        @click="increaseQuantity(item)" 
                        :disabled="item.soLuong >= item.soLuongTonKho || loading"
                        class="quantity-btn"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="item-price">
                    <div class="unit-price">{{ formatCurrency(item.gia) }}</div>
                    <div class="total-price">{{ formatCurrency(item.thanhTien) }}</div>
                  </div>

                  <!-- Remove button -->
                  <div class="item-actions">
                    <button 
                      @click="removeItem(item)" 
                      class="remove-btn"
                      :disabled="loading"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cart summary -->
          <div class="col-lg-4">
            <div class="cart-summary">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div class="summary-details">
                <div class="summary-row">
                  <span>Tạm tính ({{ itemCount }} sản phẩm):</span>
                  <span>{{ formatCurrency(cart.tongTien) }}</span>
                </div>
                <div class="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatCurrency(shippingFee) }}</span>
                </div>
                <div class="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{{ formatCurrency(totalAmount) }}</span>
                </div>
              </div>

              <div class="checkout-section">
                <button 
                  @click="proceedToCheckout" 
                  class="checkout-btn"
                  :disabled="loading || isEmpty"
                >
                  <i class="fas fa-credit-card"></i>
                  Tiến hành thanh toán
                </button>
                
                <a href="/products" class="continue-shopping-link">
                  <i class="fas fa-arrow-left"></i>
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error messages -->
      <div v-if="message" :class="`message message-${messageType}`">
        <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'

export default {
  name: 'Cart',
  setup() {
    const router = useRouter()
    const {
      cart,
      loading,
      itemCount,
      isEmpty,
      loadCart,
      updateQuantity,
      removeItem,
      clearCart,
      formatCurrency
    } = useCart()

    // Local state
    const message = ref('')
    const messageType = ref('success')

    // Computed properties
    const shippingFee = computed(() => {
      return isEmpty.value ? 0 : 30000 // 30k VND shipping fee
    })

    const totalAmount = computed(() => {
      return (cart.value?.tongTien || 0) + shippingFee.value
    })

    // Methods
    const handleImageError = (event) => {
      event.target.src = '/sneakers/sneakers-1-alt1.jpg'
    }

    const showMessage = (text, type = 'success') => {
      message.value = text
      messageType.value = type
      
      setTimeout(() => {
        message.value = ''
      }, 3000)
    }

    const increaseQuantity = async (item) => {
      if (item.soLuong >= item.soLuongTonKho) {
        showMessage('Không thể thêm. Đã đạt số lượng tối đa!', 'error')
        return
      }

      try {
        await updateQuantity(item.id, item.soLuong + 1)
        showMessage('Đã cập nhật số lượng')
      } catch (error) {
        showMessage(error.message, 'error')
      }
    }

    const decreaseQuantity = async (item) => {
      if (item.soLuong <= 1) return

      try {
        await updateQuantity(item.id, item.soLuong - 1)
        showMessage('Đã cập nhật số lượng')
      } catch (error) {
        showMessage(error.message, 'error')
      }
    }

    const updateQuantityInput = async (item, event) => {
      const newQuantity = parseInt(event.target.value)
      
      if (isNaN(newQuantity) || newQuantity < 1) {
        event.target.value = item.soLuong
        return
      }

      if (newQuantity > item.soLuongTonKho) {
        event.target.value = item.soLuongTonKho
        showMessage(`Chỉ còn ${item.soLuongTonKho} sản phẩm trong kho`, 'error')
        return
      }

      if (newQuantity === item.soLuong) return

      try {
        await updateQuantity(item.id, newQuantity)
        showMessage('Đã cập nhật số lượng')
      } catch (error) {
        event.target.value = item.soLuong
        showMessage(error.message, 'error')
      }
    }

    const removeItemFromCart = async (item) => {
      if (!confirm(`Bạn có chắc muốn xóa "${item.tenSanPham}" khỏi giỏ hàng?`)) {
        return
      }

      try {
        await removeItem(item.id)
        showMessage('Đã xóa sản phẩm khỏi giỏ hàng')
      } catch (error) {
        showMessage(error.message, 'error')
      }
    }

    const clearAllItems = async () => {
      if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
        return
      }

      try {
        await clearCart()
        showMessage('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
      } catch (error) {
        showMessage(error.message, 'error')
      }
    }

    const proceedToCheckout = () => {
      // Navigate to checkout page
      router.push('/checkout')
    }

    // Lifecycle
    onMounted(async () => {
      console.log('Cart.vue mounted, loading cart...')
      await loadCart()
      console.log('Cart.vue after loadCart - cart.value:', cart.value)
      console.log('Cart.vue after loadCart - itemCount.value:', itemCount.value)
      console.log('Cart.vue after loadCart - isEmpty.value:', isEmpty.value)
    })

    return {
      // State
      cart,
      loading,
      itemCount,
      isEmpty,
      message,
      messageType,

      // Computed
      shippingFee,
      totalAmount,

      // Methods
      handleImageError,
      increaseQuantity,
      decreaseQuantity,
      updateQuantityInput,
      removeItem: removeItemFromCart,
      clearAllItems,
      proceedToCheckout,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  padding: 20px 0;
  background: #f8f9fa;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
}

.cart-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #212529;
    margin-bottom: 8px;

    i {
      color: #007bff;
      margin-right: 12px;
    }
  }

  .breadcrumb {
    font-size: 14px;
    color: #6c757d;

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
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  .empty-cart-content {
    text-align: center;
    max-width: 400px;

    i {
      font-size: 80px;
      color: #dee2e6;
      margin-bottom: 24px;
    }

    h3 {
      font-size: 24px;
      color: #212529;
      margin-bottom: 8px;
    }

    p {
      color: #6c757d;
      margin-bottom: 24px;
    }

    .continue-shopping-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #007bff;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.3s ease;

      &:hover {
        background: #0056b3;
      }
    }
  }
}

.cart-content {
  .cart-items {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;

    .cart-items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #dee2e6;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #212529;
        margin: 0;
      }

      .clear-all-btn {
        background: transparent;
        color: #dc3545;
        border: 2px solid #dc3545;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          background: #dc3545;
          color: white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f1f3f4;

      &:last-child {
        border-bottom: none;
      }

      .item-image {
        flex-shrink: 0;
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-info {
        flex: 1;
        min-width: 0;

        .item-name {
          font-size: 16px;
          font-weight: 600;
          color: #212529;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-attributes {
          display: flex;
          gap: 12px;
          margin-bottom: 6px;
          font-size: 12px;
          color: #6c757d;

          .brand, .category {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }

        .item-variants {
          display: flex;
          gap: 16px;
          margin-bottom: 6px;
          font-size: 14px;

          .color {
            display: flex;
            align-items: center;
            gap: 6px;

            .color-swatch {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 2px solid #fff;
              box-shadow: 0 0 0 1px #dee2e6;
            }
          }

          .size {
            color: #6c757d;
          }
        }

        .item-stock {
          font-size: 12px;
          color: #28a745;
        }
      }

      .item-quantity {
        flex-shrink: 0;

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 4px;

          .quantity-btn {
            width: 32px;
            height: 32px;
            border: 1px solid #dee2e6;
            background: white;
            border-radius: 4px;
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
            width: 60px;
            height: 32px;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            text-align: center;
            font-weight: 500;

            &:focus {
              outline: none;
              border-color: #007bff;
            }
          }
        }
      }

      .item-price {
        flex-shrink: 0;
        text-align: right;
        min-width: 120px;

        .unit-price {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 4px;
        }

        .total-price {
          font-size: 16px;
          font-weight: 700;
          color: #dc3545;
        }
      }

      .item-actions {
        flex-shrink: 0;

        .remove-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: #f8f9fa;
          color: #dc3545;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          &:hover:not(:disabled) {
            background: #dc3545;
            color: white;
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .cart-summary {
    background: white;
    border-radius: 12px;
    padding: 24px;
    position: sticky;
    top: 20px;

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #212529;
      margin: 0 0 20px 0;
      padding-bottom: 16px;
      border-bottom: 1px solid #dee2e6;
    }

    .summary-details {
      margin-bottom: 24px;

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;

        &.total {
          font-size: 18px;
          font-weight: 700;
          color: #212529;
          padding-top: 12px;
          border-top: 1px solid #dee2e6;
          margin-top: 16px;
        }
      }
    }

    .checkout-section {
      .checkout-btn {
        width: 100%;
        background: #28a745;
        color: white;
        border: none;
        padding: 16px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 16px;

        &:hover:not(:disabled) {
          background: #1e7e34;
          transform: translateY(-1px);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .continue-shopping-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #007bff;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
          color: #0056b3;
          text-decoration: underline;
        }
      }
    }
  }
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  min-width: 300px;
  animation: slideIn 0.3s ease;

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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 992px) {
  .cart-content .cart-summary {
    position: static;
    margin-top: 24px;
  }
}

@media (max-width: 768px) {
  .cart-content .cart-items .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .item-image {
      width: 80px;
      height: 80px;
    }

    .item-info {
      width: 100%;
    }

    .item-quantity,
    .item-price,
    .item-actions {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-price {
      text-align: left;
    }
  }
}
</style>
