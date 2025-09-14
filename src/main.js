import './assets/main.scss'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css"
import axios from 'axios';

// Gắn axios vào global properties để có thể sử dụng trong mọi component
const app = createApp(App)
app.config.globalProperties.$axios = axios;

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(autoAnimatePlugin);
// Cài đặt Vue Toastification
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

app.mount('#app')
