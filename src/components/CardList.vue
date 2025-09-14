<script setup>
import CardSanPham from './CardSanPham.vue'

defineProps({
  items: Array
})

const emit = defineEmits(['add-to-cart', 'toggle-favorite', 'buy-now'])
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <CardSanPham
      v-for="item in items"
      :key="item.id"
      :item="item"
      @add-to-cart="(item) => emit('add-to-cart', item)"
      @toggle-favorite="(item) => emit('toggle-favorite', item)"
      @buy-now="(item) => emit('buy-now', item)"
    />
  </div>
</template>
