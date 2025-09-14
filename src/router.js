import { createRouter, createWebHashHistory } from 'vue-router'
import TrangChu from './pages/TrangChu.vue'
import SanPham from './pages/SanPham.vue'
import GiamGia from './pages/GiamGia.vue'
import TraCuuDonHang from './pages/TraCuuDonHang.vue'
import HoTro from './pages/HoTro.vue'
// import FavoritesPage from './pages/Favorites.vue'
// import ProfilePage from './pages/ProfilePage.vue' // Đảm bảo tên file đúng
import ProductDetailCard from './components/ProductDetailCard.vue'
import AuthForm from './components/AuthForm.vue'
import CheckoutPage from './components/CheckoutPage.vue' // <<< Đã thêm import
import OrderSuccessPage from './components/OrderSuccessPage.vue'; // Import OrderSuccessPage mới

// Account Dashboard imports
import AccountDashboard from './components/AccountDashboard.vue'
import TongQuan from './pages/TongQuan.vue'
import LichSuMuaHang from './pages/LichSuMuaHang.vue'
import ThongTinTaiKhoan from './pages/ThongTinTaiKhoan.vue'
import GopYPhanHoi from './pages/GopYPhanHoi.vue'
import ChiTietSanPham from './pages/ChiTietSanPham.vue'
import GioHang from './pages/GioHang.vue'

const routes = [
  { path: '/', name: 'home', component: TrangChu },
  { path: '/products', name: 'products', component: SanPham },
  { path: '/discounts', name: 'discounts', component: GiamGia },
  { path: '/orders', name: 'orders', component: TraCuuDonHang },
  { path: '/support', name: 'support', component: HoTro },
  // { path: '/favorites', name: 'favorites', component: FavoritesPage },
  // { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/product/:id', name: 'product-detail', component: ChiTietSanPham },
  { path: '/cart', name: 'cart', component: GioHang },
  { path: '/auth', name: 'auth', component: AuthForm },
  { path: '/checkout', name: 'checkout', component: CheckoutPage }, // <<< Đã thêm route
  { path: '/order-success/:orderId/:paymentStatus?', component: OrderSuccessPage, name: 'order-success', props: true }, // Route mới cho trang thành công
  
  // Account Dashboard routes
  {
    path: '/account',
    component: AccountDashboard,
    children: [
      { path: '', redirect: '/account/overview' },
      { path: 'overview', name: 'account-overview', component: TongQuan },
      { path: 'purchase-history', name: 'account-purchase-history', component: LichSuMuaHang },
      { path: 'profile', name: 'account-profile', component: ThongTinTaiKhoan },
      { path: 'feedback', name: 'account-feedback', component: GopYPhanHoi }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router