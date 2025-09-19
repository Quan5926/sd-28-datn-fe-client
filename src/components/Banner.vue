<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Dữ liệu cho banner slider
const banners = [
  {
    image: '/public/banner2.jpg',
    title: 'Hồn Việt trên từng bước đi',
    description:
      'Tự hào sải bước với những đôi giày mang tinh thần "máu đỏ da vàng", kết hợp giữa thiết kế hiện đại và bản sắc văn hóa Việt Nam.'
  },
  {
    image: '/public/banner.jpg',
    title: 'Phố Xưa - Vẻ Đẹp Không Phai',
    description:
      'Mỗi đôi giày là một câu chuyện về những con phố cổ kính, mang đến vẻ đẹp hoài niệm nhưng đầy chất riêng cho phong cách của bạn.'
  },
  {
    image: '/public/banner4.jpg',
    title: 'PhoStep - Kết Nối Đam Mê',
    description:
      'Thương hiệu được sinh ra từ tình yêu sneaker và văn hóa Việt. Chúng tôi mong muốn rằng những sản phẩm không chỉ để mang, mà còn để tự hào.'
  }
]

// Dữ liệu cho phần bộ sưu tập
const collections = [
  {
    image: '/public/bst-bongro.png',
    title: 'GIÀY THỂ THAO',
    link: '#',
    bgColor: '#f1d7d7',
    brandIds: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 23, 24, 25]
  },
  {
    image: '/public/bst-thoitrang.png',
    title: 'GIÀY THỜI TRANG',
    link: '#',
    bgColor: '#ffe9a6',
    brandIds: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]

  },
  {
    image: '/public/bst-giaycasual.png',
    title: 'GIÀY CASUAL',
    link: '#',
    bgColor: '#C0C0C0',
    brandIds: [4, 5] // Thêm ID của các thương hiệu
  }
]

// Trạng thái reactive cho index banner hiện tại và trạng thái chuyển động
const currentBannerIndex = ref(0)
const isTransitioning = ref(false)
let autoSlideInterval = null

// Thuộc tính tính toán để lấy đối tượng banner hiện tại
const currentBanner = computed(() => banners[currentBannerIndex.value])

// Cập nhật emit để chấp nhận tên bộ sưu tập
const emit = defineEmits(['scrollToProducts', 'scrollToCollection'])

// Chức năng chuyển đến banner tiếp theo
const nextBanner = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  setTimeout(() => {
    currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
    isTransitioning.value = false
  }, 500)
}

// Chức năng chuyển đến banner trước đó
const prevBanner = () => {
  if (isTransitioning.value) return
  isTransitioning.value = true
  setTimeout(() => {
    currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.length) % banners.length
    isTransitioning.value = false
  }, 500)
}

// Chức năng chuyển đến một banner cụ thể theo index
const goToBanner = (index) => {
  if (isTransitioning.value || index === currentBannerIndex.value) return
  isTransitioning.value = true
  setTimeout(() => {
    currentBannerIndex.value = index
    isTransitioning.value = false
  }, 500)
}

// Chức năng bắt đầu interval tự động trượt
const startAutoSlide = () => {
  clearInterval(autoSlideInterval)
  autoSlideInterval = setInterval(() => {
    nextBanner()
  }, 20000) // 20000ms = 20 giây
}

// Lifecycle hook: onMounted để bắt đầu tự động trượt
onMounted(() => {
  startAutoSlide()
})

// Lifecycle hook: onUnmounted để xóa interval tự động trượt
onUnmounted(() => {
  clearInterval(autoSlideInterval)
})

// Cập nhật hàm xử lý click để truyền tên bộ sưu tập
const scrollToCollection = (collectionTitle) => {
  emit('scrollToProducts', collectionTitle);
};

// Hàm mới, để cuộn đến phần 'Tất cả sản phẩm'
const scrollToProducts = () => {
  emit('scrollToProducts', 'Tất cả sản phẩm');
}
</script>

<template>
  <div class="container mx-auto px-4 mt-0 mb-8">
    <section class="relative overflow-hidden rounded-xl banner-container">
      <!-- Banner Image -->
      <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        :style="{ backgroundImage: `url(${currentBanner.image})`, opacity: isTransitioning ? 0 : 1 }"></div>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <!-- Banner Content -->
      <div class="relative z-10 h-full flex items-center text-white">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-full">
          <!-- Left Content -->
          <div class="banner-content text-center lg:text-left order-2 lg:order-1">
            <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 animate-fade-in-up leading-tight"
              v-html="currentBanner.title"></h2>
            <p class="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fade-in-up delay-200 leading-relaxed opacity-90">
              {{ currentBanner.description }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button @click="scrollToProducts"
                class="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base md:text-lg">
                Mua Ngay
              </button>
              <button @click="scrollToCollection('GIÀY THỂ THAO')"
                class="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 text-sm sm:text-base md:text-lg">
                Khám Phá
              </button>
            </div>
          </div>
          
          <!-- Right Content - Visual Element -->
          <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div class="relative">
              <!-- Decorative elements for visual balance -->
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-primary-500 rounded-full opacity-20 animate-pulse"></div>
              <div class="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-full opacity-10"></div>
              
              <!-- Brand highlight -->
              <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white border-opacity-20">
                <div class="text-center">
                  <div class="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-primary-300">
                    PHOSTEP
                  </div>
                  <div class="text-sm sm:text-base text-white opacity-80 font-medium">
                    Nơi những bước chân bắt đầu
                  </div>
                  <div class="mt-4 flex justify-center space-x-2">
                    <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <!-- Navigation Arrows -->
      <button @click="prevBanner"
        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors duration-300 rounded-full z-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button @click="nextBanner"
        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors duration-300 rounded-full z-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <!-- Navigation Dots -->
      <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <span v-for="(banner, index) in banners" :key="index" @click="goToBanner(index)" :class="[
          'h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full cursor-pointer transition-colors duration-300',
          index === currentBannerIndex
            ? 'bg-white'
            : 'bg-gray-400 bg-opacity-50 hover:bg-opacity-70'
        ]">
        </span>
      </div>
    </section>
  </div>

  <!-- Collection Section -->
  <section class="container mx-auto px-4 my-16">
    <!-- Section Header -->
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 banner-text-container">
        Bộ Sưu Tập Nổi Bật
      </h2>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Khám phá những dòng sản phẩm đặc biệt được thiết kế dành riêng cho phong cách của bạn
      </p>
      <div class="w-24 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
    </div>

    <!-- Collection Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="(collection, index) in collections" :key="index" 
        class="relative group cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        
        <!-- Collection Card -->
        <div class="relative rounded-2xl overflow-hidden shadow-lg" :style="{ backgroundColor: collection.bgColor }">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
          </div>
          
          <!-- Content -->
          <div class="relative z-10 p-8 lg:p-10 flex flex-col items-center text-center min-h-[400px]">
            <!-- Title -->
            <div class="mb-6">
              <h3 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 banner-text-container">
                {{ collection.title }}
              </h3>
              <div class="w-16 h-0.5 bg-gray-700 mx-auto"></div>
            </div>
            
            <!-- Image Container -->
            <div class="flex-1 flex items-center justify-center mb-6 w-full">
              <div class="relative">
                <img :src="collection.image" :alt="collection.title"
                  class="w-full max-w-[280px] h-auto object-contain transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3" />
                
                <!-- Floating Elements -->
                <div class="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full opacity-70 animate-bounce" style="animation-delay: 0s"></div>
                <div class="absolute -bottom-3 -left-3 w-4 h-4 bg-primary-400 rounded-full opacity-60 animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
            </div>
            
            <!-- CTA Button -->
            <div class="mt-auto">
              <a href="#" @click.prevent="scrollToCollection(collection.title)"
                class="inline-flex items-center gap-3 bg-gray-800 text-white font-semibold py-4 px-8 rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-xl">
                <span>Khám phá ngay</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <!-- Collection Number -->
        <div class="absolute -top-4 -left-4 w-12 h-12 bg-primary-500 text-white font-bold text-xl rounded-full flex items-center justify-center shadow-lg z-20">
          {{ String(index + 1).padStart(2, '0') }}
        </div>
      </div>
    </div>
    
    <!-- Bottom CTA -->
    <div class="text-center mt-16">
      <p class="text-gray-600 mb-6 text-lg">Không tìm thấy phong cách phù hợp?</p>
      <button @click="scrollToProducts"
        class="inline-flex items-center gap-3 border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
        <span>Xem tất cả sản phẩm</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  </section>
  <!-- End Collection Section -->
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap');

.banner-text-container {
  font-family: 'Josefin Sans', sans-serif;
}

h2 {
  font-family: 'Josefin Sans', sans-serif;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-in-out;
}

.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-button {
  background-color: #f7f7f7;
  color: #1a1a1a;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 9999px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition-property: background-color, transform, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:hover {
  background-color: #e5e7eb;
  transform: scale(1.05);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.banner-container {
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  height: calc(100vh - 80px);
  max-height: 700px;
  min-height: 400px;
}

/* Responsive height adjustments */
@media (max-width: 640px) {
  .banner-container {
    height: calc(100vh - 60px);
    min-height: 350px;
    max-height: 500px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .banner-container {
    height: calc(100vh - 70px);
    min-height: 400px;
    max-height: 600px;
  }
}

@media (min-width: 1025px) {
  .banner-container {
    height: calc(100vh - 80px);
    min-height: 500px;
    max-height: 700px;
  }
}
</style>
