<script setup>
import { ref, watch, provide, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import Header from './components/Header.vue';
import Drawer from './components/Drawer.vue';
import Footer from './components/Footer.vue';

// Base URL for the APIs
const baseURL = 'http://localhost:8080/api';
const gioHangsUrl = `${baseURL}/gioHangs`;
const gioHangChiTietsUrl = `${baseURL}/gioHangChiTiets`;
const ordersUrl = `${baseURL}/orders`;

// Initialize toast
const toast = useToast();

// State
const cart = ref([]);
const drawerState = ref(false);
const isCreatingOrder = ref(false);
const maPhienGioHang = ref(null);
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

// Cart actions
const openDrawer = () => {
  drawerState.value = true;
};
const closeDrawer = () => {
  drawerState.value = false;
};

// Function to fetch cart details from the API
const fetchCartDetails = async () => {
  if (!maPhienGioHang.value) {
    cart.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const res = await axios.get(`${gioHangChiTietsUrl}/by-ma-phien-gio-hang/${maPhienGioHang.value}`);
    cart.value = res.data.map(item => ({
      ...item,
      price: item.giaBanHienTai * item.soLuong,
      cartItemId: item.id
    }));
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết giỏ hàng!', err);
    toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.');
    cart.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Function to generate the next available cart code
const generateCartCode = async () => {
  try {
    // 1. Fetch all existing cart codes from the backend
    const response = await axios.get(gioHangsUrl);
    const existingGioHangs = response.data;
    
    // 2. Filter for valid codes and extract the number
    const validGioHangCodes = existingGioHangs
      .filter(gh => gh.maPhienGioHang && gh.maPhienGioHang.startsWith('CART') && !isNaN(parseInt(gh.maPhienGioHang.replace('CART', ''))))
      .map(gh => parseInt(gh.maPhienGioHang.replace('CART', '')));

    // 3. Find the next sequential ID
    const nextId = validGioHangCodes.length > 0 ? Math.max(...validGioHangCodes) + 1 : 1;

    // 4. Format the new code with leading zeros
    const newCode = `CART${String(nextId).padStart(3, '0')}`;
    
    return newCode;
  } catch (err) {
    console.error('Lỗi khi tạo mã giỏ hàng:', err);
    toast.error('Không thể tạo mã giỏ hàng. Vui lòng thử lại.');
    return null;
  }
};
// Function to add an item to the cart
const addToCart = async (item) => {
  isLoading.value = true;

  try {
    // 1. Check if a cart ID already exists
    let savedSessionId = localStorage.getItem('cartSessionId');

    // 2. If no cart ID exists, generate a new one
    if (!savedSessionId) {
      const newCartCode = await generateCartCode();
      if (!newCartCode) {
        isLoading.value = false;
        return;
      }
      maPhienGioHang.value = newCartCode;
      localStorage.setItem('cartSessionId', newCartCode);
      savedSessionId = newCartCode;
    } else {
        maPhienGioHang.value = savedSessionId;
    }
    
    // The rest of your code to add the item to the cart remains the same
    const existingItem = cart.value.find(cartItem => cartItem.maCtsp === item.maCtsp);
    const newQuantity = existingItem ? existingItem.soLuong + 1 : 1;
    
    const gioHangChiTietDTO = {
      soLuong: newQuantity,
      maCtsp: item.maCtsp,
    };
    
    const cartToUpdate = {
      maPhienGioHang: savedSessionId,
      gioHangChiTiets: [gioHangChiTietDTO],
      idKhachHang: null
    };

    await axios.post(`${gioHangsUrl}/full`, cartToUpdate);
    
    await fetchCartDetails();
    
    openDrawer();
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
    await axios.delete(`${gioHangChiTietsUrl}/${item.id}`);
    
    await fetchCartDetails();
    
    if (cart.value.length === 0) {
        closeDrawer();
    }
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

const createOrder = async () => {
  isCreatingOrder.value = true;

  try {
    const orderPayload = {
      maPhienGioHang: maPhienGioHang.value,
      totalAmount: totalPrice.value
    };

    await axios.post(ordersUrl, orderPayload);
    
    clearCart();
    closeDrawer();
    router.push('/order-confirmation');
    toast.success('Đơn hàng của bạn đã được tạo thành công!');

  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    toast.error('Không thể tạo đơn hàng. Vui lòng thử lại.');
  } finally {
    isCreatingOrder.value = false;
  }
};

const clearCart = async () => {
    try {
      isLoading.value = true;
      await axios.delete(`${gioHangsUrl}/${maPhienGioHang.value}`);
      
      cart.value = [];
      localStorage.removeItem('cartSessionId');
      maPhienGioHang.value = null;
      toast.info('Giỏ hàng đã được làm trống.');

    } catch (err) {
      console.error('Lỗi khi xoá giỏ hàng:', err);
      toast.error('Lỗi khi xoá giỏ hàng. Vui lòng thử lại.');
    } finally {
      isLoading.value = false;
    }
};

// Provide data and actions to child components
provide('cartActions', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
  updateQuantity,
  formatCurrency,
  createOrder,
  clearCart,
  totalPrice,
  isCreatingOrder,
  isLoading,
  maPhienGioHang,
});


// Load session code from localStorage and fetch cart details on startup
onMounted(() => {
  const savedSessionId = localStorage.getItem('cartSessionId');
  if (savedSessionId) {
    maPhienGioHang.value = savedSessionId;
    fetchCartDetails();
  }
});


// Watch for changes in maPhienGioHang to save it to localStorage
watch(maPhienGioHang, (newVal) => {
  if (newVal) {
    localStorage.setItem('cartSessionId', newVal);
  } else {
    localStorage.removeItem('cartSessionId');
  }
});
</script>

<template>
  <!-- Show drawer only for non-auth routes -->
  <Drawer
    v-if="drawerState && !isAuthRoute"
    :total-price="totalPrice"
    :is-creating-order="isCreatingOrder"
    :cart="cart"
  />
  
  <!-- Conditional layout based on route -->
  <div v-if="isAuthRoute">
    <!-- Auth layout without header/footer -->
    <router-view></router-view>
  </div>
  
  <div v-else>
    <!-- Main layout with header/footer -->
    <Header @open-drawer="openDrawer" :total-price="totalPrice" />
    <div class="p-8 md:p-12">
      <router-view></router-view>
    </div>
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