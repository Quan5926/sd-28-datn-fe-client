<script setup>
import { inject, computed } from 'vue'

const { formatCurrency } = inject('cartActions')

const props = defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  class: {
    type: String,
    default: ''
  },
  totalStock: {
    type: Number,
    default: 0
  },
  productStatus: {
    type: String,
    default: 'dang_kinh_doanh'
  }
})

const isOutOfStock = computed(() => props.totalStock <= 0 || props.productStatus === 'het_hang');
const isDiscontinued = computed(() => props.productStatus === 'ngung_kinh_doanh');
</script>

<template>
  <router-link :to="`/product/${id}`" class="block" :title="title" :aria-label="`Xem chi tiết sản phẩm ${title}`">
    <div
      :class="[
        'group relative bg-white rounded-3xl p-6 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full overflow-hidden border border-gray-200',
        { 'opacity-70 grayscale': isDiscontinued || isOutOfStock }
      ]"
      :aria-disabled="isDiscontinued || isOutOfStock" :tabindex="isDiscontinued || isOutOfStock ? -1 : 0" >

      <div v-if="isDiscontinued || isOutOfStock"
           class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none rounded-3xl"
           style="background-color: rgba(0, 0, 0, 0.5);">
        <div
          :class="[
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
            'w-[120%] h-16 flex items-center justify-center text-white text-2xl font-bold uppercase tracking-wide',
            'transform -rotate-12',
            isOutOfStock ? 'bg-accent' : 'bg-red-700'
          ]"
          style="box-shadow: 0 4px 15px rgba(0,0,0,0.3); padding: 0.5rem 2rem;"
        >
          {{ isDiscontinued ? 'Ngừng kinh doanh' : 'Hết hàng' }}
        </div>
      </div>

      <!-- Khu vực hiển thị ảnh sản phẩm -->
      <div class="flex justify-center items-center h-48 mb-4">
        <img :src="imageUrl" :alt="`Ảnh sản phẩm ${title}`" class="h-40 object-contain transition-transform duration-300 group-hover:scale-110" />
      </div>

      <!-- Khu vực hiển thị tên và giá sản phẩm -->
      <h3 class="mt-4 text-lg font-bold text-gray-800 text-center truncate">{{ title }}</h3>

      <div class="mt-4 flex flex-col justify-start">
        <span class="text-sm text-gray-500 font-medium">Giá:</span>
        <span class="text-xl font-bold text-gray-800">{{ formatCurrency(price) }}</span>
      </div>
    </div>
  </router-link>
</template>
