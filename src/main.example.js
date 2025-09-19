import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import cartPlugin from './plugins/cart'

// Import CSS frameworks nếu cần
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

// Use plugins
app.use(router)
app.use(cartPlugin)

// Mount app
app.mount('#app')

// Example: Khởi tạo cart service khi user login
// import { cartService } from '@/services/cartAPI'
// 
// // Khi user đăng nhập
// function onUserLogin(userData) {
//   cartService.setCustomerId(userData.id)
// }
// 
// // Khi user đăng xuất  
// function onUserLogout() {
//   cartService.clearCustomerId()
// }
