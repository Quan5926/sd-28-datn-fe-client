<script setup>
import { ref, onMounted } from 'vue';

// Giả định dữ liệu footer được lấy từ một API
const footerData = ref({
  links: {
    'Về chúng tôi': [
      { text: 'Giới thiệu', url: '/about' },
      { text: 'Tuyển dụng', url: '/careers' },
      { text: 'Cửa hàng', url: '/stores' },
      { text: 'Chính sách bảo mật', url: '/privacy-policy' }
    ],
    'Hỗ trợ khách hàng': [
      { text: 'Chính sách đổi trả', url: '/return-policy' },
      { text: 'Hướng dẫn mua hàng', url: '/how-to-buy' },
      { text: 'Chính sách thanh toán', url: '/payment-policy' },
      { text: 'Chính sách vận chuyển', url: '/shipping-policy' }
    ]
  },
  contact: {
    address: 'Tòa nhà FPT Polytechnic., Cổng số 2, 13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội',
    phone: '0971502422',
    email: 'phostep1205@gmail.com'
  },
  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/phostep.sneakers', icon: 'M22.675 0h-21.35C.598 0 0 .598 0 1.338v21.325c0 .74.598 1.337 1.325 1.337h11.338v-9.5h-3.375v-3.925h3.375v-2.85c0-3.325 2.037-5.138 4.987-5.138 1.425 0 2.65.1 3.012.15v3.413h-2.025c-1.6 0-1.925.75-1.925 1.888v2.475h3.837l-.5 3.925h-3.337v9.5h6.1C23.402 24 24 23.402 24 22.662V1.338C24 .598 23.402 0 22.675 0z' },
    { name: 'Instagram', url: 'https://www.instagram.com/phostep.sneakers', icon: 'M12 0C8.74 0 8.358.01 7.152.06c-1.218.04-2.03.243-2.75.525-1.52.59-2.766 1.836-3.356 3.356C.293 5.122.09 5.935.05 7.15c-.048 1.208-.06 1.59-.06 4.852s.01 3.644.06 4.852c.04 1.215.242 2.028.525 2.75.59 1.52 1.836 2.766 3.356 3.356.72.283 1.53.485 2.75.525 1.208.048 1.59.06 4.852.06s3.644-.01 4.852-.06c1.215-.04 2.028-.242 2.75-.525 1.52-.59 2.766-1.836 3.356-3.356.283-.72.485-1.53.525-2.75.048-1.208.06-1.59.06-4.852s-.01-3.644-.06-4.852c-.04-1.215-.242-2.028-.525-2.75-1.424-3.6-5.83-4.59-8.498-4.59zM12 2.1c3.27 0 3.682.012 4.966.06c1.17.042 1.76.22 2.162.385.95.385 1.722 1.157 2.106 2.106.165.402.343.992.385 2.162.048 1.284.06 1.696.06 4.966s-.012 3.682-.06 4.966c-.042 1.17-.22 1.76-.385 2.162-.385.95-1.157 1.722-2.106 2.106-.402.165-.992.343-2.162.385-1.284.048-1.696.06-4.966.06s-3.682-.012-4.966-.06c-1.17-.042-1.76-.22-2.162-.385-.95-.385-1.722-1.157-2.106-2.106-.165-.402-.343-.992-.385-2.162-.048-1.284-.06-1.696-.06-4.966s.012-3.682.06-4.966c.042-1.17.22-1.76.385-2.162.385-.95 1.157-1.722 2.106-2.106.402-.165.992-.343 2.162-.385C8.318 2.112 8.73 2.1 12 2.1zM12 6.55c-3.003 0-5.45 2.447-5.45 5.45s2.447 5.45 5.45 5.45 5.45-2.447 5.45-5.45-2.447-5.45-5.45-5.45zM12 15.65c-1.85 0-3.35-1.5-3.35-3.35s1.5-3.35 3.35-3.35 3.35 1.5 3.35 3.35-1.5 3.35-3.35 3.35zM17.5 4.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5z' },
    { name: 'Youtube', url: 'https://www.youtube.com/phostep', icon: 'M23.498 6.186a3.02 3.02 0 0 0-2.13-2.135C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.368.55C.797 4.051 0 4.848 0 6.186v11.628c0 1.338.797 2.135 2.13 2.135 1.668.55 9.368.55 9.368.55s7.7 0 9.368-.55a3.02 3.02 0 0 0 2.13-2.135V6.186zm-13.633 8.35v-4.88l4.43 2.44-4.43 2.44z' }
  ],
  logos: [
    { src: '/bo-cong-thuong.png', alt: 'Logo Bộ Công Thương' },
    { src: '/nca-chungnhan.png', alt: 'Logo chứng nhận NCA' },
    { src: '/dmca.png', alt: 'Logo DMCA' }
  ]
});

// Giả lập việc fetch data từ API
const fetchData = async () => {
  try {
    // const response = await axios.get('/api/footer-data');
    // footerData.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu footer:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <footer class="bg-gray-900 text-gray-400 py-12 lg:py-16">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Cột 1: Giới thiệu chung -->
        <div class="space-y-4">
          <h3 class="text-xl font-bold text-white font-josefin-sans tracking-wide">PHOSTEP SNEAKERS</h3>
          <p class="text-sm leading-relaxed font-sans">
            Nơi cung cấp những mẫu giày sneaker chính hãng, độc đáo và thời thượng nhất. Cam kết chất lượng và dịch vụ tốt nhất cho khách hàng.
          </p>
        </div>

        <!-- Cột 2 & 3: Các liên kết hữu ích -->
        <div v-for="(links, title) in footerData.links" :key="title">
          <h3 class="text-lg font-semibold text-white mb-4 font-josefin-sans tracking-wide">{{ title }}</h3>
          <ul class="space-y-2">
            <li v-for="(link, index) in links" :key="index">
              <a
                :href="link.url"
                class="hover:text-white transition-colors duration-300 text-sm font-sans"
              >{{ link.text }}</a>
            </li>
          </ul>
        </div>

        <!-- Cột 4: Thông tin liên hệ và mạng xã hội -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-white font-josefin-sans tracking-wide">Liên hệ</h3>
          <ul class="space-y-2 text-sm font-sans">
            <li>
              <span class="font-semibold">Địa chỉ:</span>
              {{ footerData.contact.address }}
            </li>
            <li>
              <span class="font-semibold">Điện thoại:</span>
              <a :href="`tel:${footerData.contact.phone}`" class="hover:text-white">{{ footerData.contact.phone }}</a>
            </li>
            <li>
              <span class="font-semibold">Email:</span>
              <a :href="`mailto:${footerData.contact.email}`" class="hover:text-white">{{ footerData.contact.email }}</a>
            </li>
          </ul>

          <div class="flex space-x-4 mt-6">
            <a
              v-for="(social, index) in footerData.socials"
              :key="index"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 hover:text-white transition-colors duration-300"
            >
              <svg
                class="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Bản quyền và dòng cuối chân trang -->
      <div class="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-sm font-sans">
        <p class="text-center sm:text-left">&copy; {{ new Date().getFullYear() }} PHOSTEP SNEAKERS. All Rights Reserved.</p>
        <div class="flex items-center gap-4">
            <img
                v-for="(logo, index) in footerData.logos"
                :key="index"
                :src="logo.src"
                :alt="logo.alt"
                class="object-contain h-10"
                loading="lazy"
                onerror="this.src='https://placehold.co/100x40/d1d5db/374151?text=Logo';"
            />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/*
  Sử dụng Tailwind CSS utility classes để tạo kiểu dáng.
  Các kiểu tùy chỉnh bổ sung có thể được thêm vào đây nếu cần.
*/
.font-josefin-sans {
  font-family: 'Josefin Sans', sans-serif;
}
</style>
