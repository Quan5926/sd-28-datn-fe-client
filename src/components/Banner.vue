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
  <section class="relative container mx-auto overflow-hidden rounded-xl banner-container"
    style="height: calc(100vh - 80px); max-height: 700px; min-height: 500px; width: 81.5%;">
    <!-- Banner Image -->
    <div class="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
      :style="{ backgroundImage: `url(${currentBanner.image})`, opacity: isTransitioning ? 0 : 1 }"></div>
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-50"></div>
    <!-- Banner Content -->
    <div
      class="relative z-10 h-full flex items-center justify-center text-center text-white p-4 max-w-2xl mx-auto banner-text-container">
      <div class="banner-content">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up"
          v-html="currentBanner.title"></h2>
        <p class="text-base md:text-xl mb-8 animate-fade-in-up delay-200">
          {{ currentBanner.description }}
        </p>
        <button @click="scrollToProducts"
          class="border-2 border-primary-400 bg-primary-500 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 hover:bg-primary-600 hover:border-primary-600">
          Mua Ngay
        </button>
      </div>
    </div>
    <!-- Navigation Arrows -->
    <button @click="prevBanner"
      class="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors duration-300 rounded-full z-20">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="nextBanner"
      class="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 transition-colors duration-300 rounded-full z-20">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    <!-- Navigation Dots -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      <span v-for="(banner, index) in banners" :key="index" @click="goToBanner(index)" :class="[
        'h-3 w-3 rounded-full cursor-pointer transition-colors duration-300',
        index === currentBannerIndex
          ? 'bg-white'
          : 'bg-gray-400 bg-opacity-50 hover:bg-opacity-70'
      ]">
      </span>
    </div>
  </section>

  <!-- Collection Section -->
  <section class="container mx-auto px-4 my-12">
    <div class="grid md:grid-cols-3 gap-6">
      <div v-for="(collection, index) in collections" :key="index" :style="{ backgroundColor: collection.bgColor }"
        class="relative rounded-lg overflow-hidden group p-8 flex flex-col items-center text-center">
        <h3 class="text-2xl font-bold mb-4 banner-text-container">{{ collection.title }}</h3>
        <img :src="collection.image" :alt="collection.title"
          class="mx-auto w-full max-w-xs object-contain transition-transform duration-300 transform group-hover:scale-105 my-auto" />
        <!-- Cập nhật CTA để gọi hàm scrollToCollection và truyền title -->
        <a href="#" @click.prevent="scrollToCollection(collection.title)"
          class="border-2 border-primary-500 text-primary-700 font-semibold py-3 px-8 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300 flex items-center gap-2 mt-4">
          Khám phá tất cả
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
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
}
</style>
