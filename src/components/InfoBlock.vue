<script setup>
import { inject } from 'vue';
const { closeDrawer } = inject('cartActions');

const props = defineProps({
  title: String,
  description: String,
  imageUrl: String,
});
</script>

<template>
  <div class="flex flex-col items-center text-center max-w-xs mx-auto p-4">
    <img height="120" width="120" :src="props.imageUrl" :alt="props.title" class="rounded-lg mb-4" />
    <h2 class="text-2xl font-bold text-primary">{{ props.title }}</h2>
    <p class="text-gray-500 mb-6 mt-2">{{ props.description }}</p>

    <button
      class="bg-lime-500 p-4 w-full rounded-full text-white font-semibold shadow-xl hover:bg-lime-600 transition-all active:bg-lime-700 flex justify-center items-center gap-2 transform hover:scale-105 duration-300 ease-in-out"
      @click="closeDrawer"
    >
      <svg
        class="w-5 h-5 animate-pulse"
        style="transform: rotate(180deg);"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
      </svg>
      <span>Quay lại mua sắm</span>
    </button>
  </div>
</template>
