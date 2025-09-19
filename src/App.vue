<script setup>
import { ref, watch, provide, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useCart } from './composables/useCart.js';

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

// Base URL for the APIs
const baseURL = 'http://localhost:8080/api';
const banHangClientUrl = `${baseURL}/ban-hang-client`;
const gioHangsUrl = `${baseURL}/gioHangs`; // Keep for backward compatibility if needed
const gioHangChiTietsUrl = `${baseURL}/gioHangChiTiets`;
const ordersUrl = `${baseURL}/orders`;

// Initialize toast
const toast = useToast();

// State
const cart = ref([]);
const isLoading = ref(false);

const router = useRouter();

// Computed property to check if current route is authentication
const isAuthRoute = computed(() => {
  return router.currentRoute.value.path === '/auth';
});

// Function to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '0 VND';
  }
  let formatted = new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);

  return `${formatted} VND`;
};

// Computed properties
const totalPrice = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.giaBanHienTai * item.soLuong), 0);
});

// Cart actions - removed drawer functions

// Function to fetch cart details from the API
const fetchCartDetails = async () => {
  const savedInvoiceId = localStorage.getItem('currentInvoiceId');
  if (!savedInvoiceId) {
    cart.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(`${banHangClientUrl}/gio-hang/${savedInvoiceId}`);
    if (res.data && res.data.items) {
      cart.value = res.data.items.map(item => ({
        id: item.id,
        maCtsp: item.maSanPham,
        tenSanPham: item.tenSanPham,
        tenMauSac: item.tenMauSac,
        tenKichCo: item.tenKichCo,
        soLuong: item.soLuong,
        giaBanHienTai: item.gia,
        price: item.thanhTien,
        cartItemId: item.id,
        urlAnhSanPham: item.urlAnhSanPham
      }));
    } else {
      cart.value = [];
    }
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết giỏ hàng!', err);
    if (err.response?.status !== 404) {
      toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.');
    }
    cart.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Function to create pending invoice (new API)
const createPendingInvoice = async () => {
  try {
    // Use new cart API to create pending invoice
    const response = await axios.post(`${banHangClientUrl}/hoa-don-cho`);
    return response.data;
  } catch (err) {
    console.error('Lỗi khi tạo hóa đơn chờ:', err);
    toast.error('Không thể tạo hóa đơn chờ. Vui lòng thử lại.');
    return null;
  }
};
// Function to add an item to the cart
const addToCart = async (item) => {
  isLoading.value = true;

  try {
    // 1. Check if invoice ID already exists
    let savedInvoiceId = localStorage.getItem('currentInvoiceId');

    // 2. If no invoice ID exists, create a new pending invoice
    if (!savedInvoiceId) {
      const invoiceData = await createPendingInvoice();
      if (!invoiceData) {
        isLoading.value = false;
        return;
      }
      savedInvoiceId = invoiceData.id;
      localStorage.setItem('currentInvoiceId', savedInvoiceId);
    }
    
    // 3. Add item to cart using new API
    const addToCartRequest = {
      idChiTietSanPham: item.id, // Use product detail ID
      soLuong: 1,
      gia: item.giaBan || item.price
    };

    const response = await axios.post(
      `${banHangClientUrl}/gio-hang/${savedInvoiceId}/them-san-pham`,
      addToCartRequest
    );
    
    // 4. Update local cart state
    await fetchCartDetails();
    
    // Redirect to cart page instead of opening drawer
    router.push('/cart');
    toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng!', err);
    toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
  } finally {
    isLoading.value = false;
  }
};

const removeFromCart = async (item) => {
  isLoading.value = true;
  try {
    const savedInvoiceId = localStorage.getItem('currentInvoiceId');
    if (!savedInvoiceId) {
      throw new Error('Không tìm thấy giỏ hàng');
    }

    await axios.delete(`${banHangClientUrl}/gio-hang/${savedInvoiceId}/san-pham/${item.cartItemId}`);
    
    await fetchCartDetails();
    
    toast.info('Sản phẩm đã được xóa khỏi giỏ hàng.');

  } catch (err) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng!', err);
    toast.error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.');
  } finally {
    isLoading.value = false;
  }
};

const updateQuantity = async (id, change) => {
  const item = cart.value.find(cartItem => cartItem.id === id);
  if (!item) return;

  const newQuantity = item.soLuong + change;
  if (newQuantity < 0) return;

  if (newQuantity === 0) {
    await removeFromCart(item);
    return;
  }
  
  if (change > 0 && newQuantity > item.soLuongTonKho) {
    toast.warning(`Số lượng tối đa cho sản phẩm này là ${item.soLuongTonKho}`);
    return;
  }
  
  isLoading.value = true;
  
  try {
    const updatedItem = {
      ...item,
      soLuong: newQuantity
    };
    
    await axios.put(`${gioHangChiTietsUrl}/${id}`, updatedItem);
    await fetchCartDetails();
    toast.success('Số lượng sản phẩm đã được cập nhật.');
    
  } catch (err) {
    console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);
    toast.error('Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.');
  } finally {
    isLoading.value = false;
  }
};

// Removed createOrder and clearCart functions - not needed for new cart system

// Provide data and actions to child components
provide('cartActions', {
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  formatCurrency,
  totalPrice,
  isLoading,
});


// Load cart on app start
onMounted(() => {
  const savedInvoiceId = localStorage.getItem('currentInvoiceId');
  if (savedInvoiceId) {
    fetchCartDetails();
  }
});
</script>

<template>
  <!-- Conditional layout based on route -->
  <div v-if="isAuthRoute">
    <!-- Auth layout without header/footer -->
    <router-view></router-view>
  </div>
  
  <div v-else>
    <!-- Main layout with header/footer -->
    <Header :total-price="totalPrice" />
    <main class="pt-0">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles go here if needed, but Tailwind is preferred */
body {
  background-color: #f7f9fc;
  font-family: 'Inter', sans-serif;
}

.app-container {
  min-height: calc(100vh - 56px * 2); /* Adjust based on your header/footer height */
}
</style>