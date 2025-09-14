<script setup>
import { ref, inject, computed, watch, nextTick } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import CardList from '../components/CardList.vue'

// Import icons
import plusIcon from '/plus.svg'
import checkedIcon from '/checked.svg'
import minusIcon from '/minus.svg'
import plusOutlineIcon from '/plus-outline.svg'

// Inject functions from App.vue
const { formatCurrency, addToCart, cart } = inject('cartActions')

// Vue Router
const router = useRouter()
const route = useRoute()

// Define state variables
const productInfo = ref(null)
const productVariants = ref([])
const selectedVariant = ref(null)
const relatedProducts = ref([])
const quantity = ref(1)
const currentMainImage = ref('')
const showModal = ref(false)
const modalMessage = ref('')
const isLoading = ref(true)

// Computed properties
const totalOverallStock = computed(() => {
  if (!productVariants.value || productVariants.value.length === 0) return 0
  return productVariants.value.reduce((sum, variant) => sum + (variant.soLuongTonKho || 0), 0)
})

const selectedVariantStock = computed(() => {
  return selectedVariant.value ? selectedVariant.value.soLuongTonKho : 0
})

const isAddedToCart = computed(() => {
  if (!selectedVariant.value) return false
  return cart.value.some((item) => item.id === selectedVariant.value.id)
})

const isProductDiscontinued = computed(() => {
  return productInfo.value && productInfo.value.idTrangThai === 4
})

const getStatusText = computed(() => {
  if (!productInfo.value) return { text: '', class: '' }

  if (totalOverallStock.value === 0) {
    return { text: 'Hết Hàng', class: 'text-warning' }
  }

  switch (productInfo.value.idTrangThai) {
    case 3:
      return { text: 'Còn Hàng', class: 'text-success' }
    case 4:
      return { text: 'Ngừng Bán', class: 'text-danger' }
    case 5:
      return { text: 'Hết Hàng', class: 'text-warning' }
    default:
      return { text: 'Không xác định', class: 'text-gray-500' }
  }
})

const getVariantStatusText = computed(() => {
  if (selectedVariantStock.value === 0) {
    return { text: 'Hết hàng', class: 'text-danger' }
  }
  return { text: 'Còn hàng', class: 'text-success' }
})

// Fetch product details and related products
const fetchProductDetails = async () => {
  isLoading.value = true
  try {
    const sanPhamId = route.params.id
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

    // Fetch product info and variants concurrently
    const [productInfoResponse, variantsResponse] = await Promise.all([
      axios.get(`${apiUrl}/api/san-phams/${sanPhamId}`),
      axios.get(`${apiUrl}/api/chi-tiet-san-phams/by-san-pham/${sanPhamId}`)
    ])

    productInfo.value = productInfoResponse.data
    productVariants.value = variantsResponse.data

    // Handle discontinued products
    if (isProductDiscontinued.value) {
      productVariants.value = []
      selectedVariant.value = null
      currentMainImage.value = productInfo.value.urlAnhDaiDien || ''
      isLoading.value = false
      return
    }

    if (productVariants.value.length > 0) {
      selectedVariant.value = productVariants.value[0]
      if (selectedVariant.value.urlAnhSanPhams && selectedVariant.value.urlAnhSanPhams.length > 0) {
        currentMainImage.value = selectedVariant.value.urlAnhSanPhams[0]
      } else {
        currentMainImage.value = productInfo.value.urlAnhDaiDien || ''
      }
    } else {
      currentMainImage.value = productInfo.value.urlAnhDaiDien || ''
    }

    await fetchRelatedProducts()
  } catch (error) {
    console.error('Lỗi khi tải chi tiết sản phẩm hoặc biến thể:', error)
    modalMessage.value = 'Đã có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.'
    showModal.value = true
    productInfo.value = null
    productVariants.value = []
    selectedVariant.value = null
    currentMainImage.value = ''
    relatedProducts.value = []
  } finally {
    isLoading.value = false
  }
}

const fetchRelatedProducts = async () => {
  if (!productInfo.value || !productInfo.value.idThuongHieu || !productInfo.value.idDanhMuc) {
    relatedProducts.value = []
    return
  }
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    const { data } = await axios.get(`${apiUrl}/api/san-phams`, {
      params: {
        thuongHieuId: productInfo.value.idThuongHieu,
        danhMucId: productInfo.value.idDanhMuc,
        page: 0,
        size: 8
      }
    })

    const filteredProducts = data.content
      .filter((item) => item.id !== productInfo.value.id && item.idTrangThai === 3)
      .slice(0, 4)

    relatedProducts.value = filteredProducts.map((obj) => ({
      ...obj,
      title: obj.tenSanPham,
      imageUrl: obj.urlAnhDaiDien || '/images/default-placeholder.jpg',
      price: obj.giaBanThapNhat,
      totalStock: obj.soLuongTonKho,
      productStatus: obj.tenTrangThai,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id)
    }))
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm liên quan:', error)
    relatedProducts.value = []
  }
}

const selectVariant = (variant) => {
  selectedVariant.value = variant
  quantity.value = 1
  if (variant.urlAnhSanPhams && variant.urlAnhSanPhams.length > 0) {
    currentMainImage.value = variant.urlAnhSanPhams[0]
  } else if (productInfo.value.urlAnhDaiDien) {
    currentMainImage.value = productInfo.value.urlAnhDaiDien
  }
}

const changeMainImage = (imageUrl) => {
  currentMainImage.value = imageUrl
}

const incrementQuantity = () => {
  if (quantity.value < selectedVariantStock.value) {
    quantity.value++
  } else {
    modalMessage.value = `Bạn chỉ có thể thêm tối đa ${selectedVariantStock.value} sản phẩm.`
    showModal.value = true
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = (item) => {
  if (item.id === selectedVariant.value.id) {
    if (isProductDiscontinued.value) {
      modalMessage.value = 'Sản phẩm này đã ngừng kinh doanh và không thể thêm vào giỏ hàng.'
      showModal.value = true
      return
    }
    if (selectedVariant.value && selectedVariantStock.value > 0) {
      const itemToAdd = {
        id: selectedVariant.value.id,
        sanPhamId: productInfo.value.id,
        name: `${productInfo.value.tenSanPham} - ${selectedVariant.value.tenKichCo} - ${selectedVariant.value.tenMauSac}`,
        price: selectedVariant.value.giaBan,
        imageUrl:
          selectedVariant.value.urlAnhSanPhams && selectedVariant.value.urlAnhSanPhams.length > 0
            ? selectedVariant.value.urlAnhSanPhams[0]
            : productInfo.value.urlAnhDaiDien,
        quantity: quantity.value,
        maCtsp: selectedVariant.value.maCtsp,
        tenSanPham: productInfo.value.tenSanPham,
        tenKichCo: selectedVariant.value.tenKichCo,
        tenMauSac: selectedVariant.value.tenMauSac
      }
      addToCart(itemToAdd)
      quantity.value = 1
    } else if (selectedVariantStock.value === 0) {
      modalMessage.value = 'Biến thể sản phẩm này đã hết hàng!'
      showModal.value = true
    } else {
      modalMessage.value = 'Vui lòng chọn một biến thể sản phẩm trước khi thêm vào giỏ hàng.'
      showModal.value = true
    }
  } else {
    addToCart(item)
  }
}

const handleBuyNow = () => {
  if (!selectedVariant.value) {
    modalMessage.value = 'Vui lòng chọn một biến thể sản phẩm trước khi thanh toán.'
    showModal.value = true
    return
  }
  if (isProductDiscontinued.value) {
    modalMessage.value = 'Sản phẩm này đã ngừng kinh doanh và không thể mua.'
    showModal.value = true
    return
  }
  if (selectedVariantStock.value === 0) {
    modalMessage.value = 'Biến thể sản phẩm này đã hết hàng!'
    showModal.value = true
    return
  }

  const itemToAdd = {
    id: selectedVariant.value.id,
    sanPhamId: productInfo.value.id,
    name: `${productInfo.value.tenSanPham} - ${selectedVariant.value.tenKichCo} - ${selectedVariant.value.tenMauSac}`,
    price: selectedVariant.value.giaBan,
    imageUrl:
      selectedVariant.value.urlAnhSanPhams && selectedVariant.value.urlAnhSanPhams.length > 0
        ? selectedVariant.value.urlAnhSanPhams[0]
        : productInfo.value.urlAnhDaiDien,
    quantity: quantity.value,
    maCtsp: selectedVariant.value.maCtsp,
    tenSanPham: productInfo.value.tenSanPham,
    tenKichCo: selectedVariant.value.tenKichCo,
    tenMauSac: selectedVariant.value.tenMauSac
  }

  addToCart(itemToAdd)
  router.push({ name: 'checkout' })
}

// watch route to reload data when navigating to a different product detail page
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      productInfo.value = null
      productVariants.value = []
      selectedVariant.value = null
      currentMainImage.value = ''
      relatedProducts.value = []
      quantity.value = 1
      await nextTick()
      await fetchProductDetails()
    }
  },
  { immediate: true }
)

// watch cart to update "isAdded" status for related products
watch(cart, () => {
  relatedProducts.value = relatedProducts.value.map((obj) => ({
    ...obj,
    isAdded: cart.value.some((cartItem) => cartItem.id === obj.id)
  }))
})
</script>

<template>
  <div class="container mx-auto p-4 md:p-8 lg:p-12">
    <div v-if="isLoading" class="text-center text-xl text-gray-500 py-20 font-sans">
      <div class="animate-pulse">Đang tải thông tin sản phẩm hoặc không tìm thấy sản phẩm...</div>
    </div>

    <div
      v-if="!isLoading && productInfo"
      class="bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up"
    >
      <div class="md:flex md:space-x-8 lg:space-x-12 p-6 md:p-8">
        <div class="md:w-1/2 flex flex-col items-center">
          <div class="main-image-wrapper w-full relative group">
            <img
              :src="currentMainImage || '/placeholder-image.jpg'"
              :alt="productInfo.tenSanPham"
              class="w-full max-h-[500px] object-contain rounded-xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
              loading="lazy"
            />
          </div>
          <div
            class="thumbnail-wrapper flex flex-wrap gap-2 justify-center mt-4 overflow-x-auto p-2"
          >
            <img
              v-if="productInfo.urlAnhDaiDien"
              :src="productInfo.urlAnhDaiDien"
              @click="changeMainImage(productInfo.urlAnhDaiDien)"
              class="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
              :class="{
                'border-accent scale-110 shadow-lg': currentMainImage === productInfo.urlAnhDaiDien
              }"
              :alt="`Ảnh đại diện ${productInfo.tenSanPham}`"
              loading="lazy"
            />
            <img
              v-for="(image, index) in selectedVariant?.urlAnhSanPhams"
              :key="index"
              :src="image"
              @click="changeMainImage(image)"
              class="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
              :class="{ 'border-accent scale-110 shadow-lg': currentMainImage === image }"
              :alt="`Ảnh biến thể ${productInfo.tenSanPham} ${selectedVariant.tenKichCo} ${selectedVariant.tenMauSac} ${index + 1}`"
              loading="lazy"
            />
          </div>
        </div>

        <div class="md:w-1/2 mt-6 md:mt-0 flex flex-col">
          <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 font-josefin-sans">
            {{ productInfo.tenSanPham }}
          </h1>
          <p class="text-2xl lg:text-3xl font-bold text-accent-dark mb-4 font-josefin-sans">
            <span v-if="selectedVariant">{{ formatCurrency(selectedVariant.giaBan) }}</span>
            <span v-else class="text-gray-500">
              {{ formatCurrency(productInfo.giaBanThapNhat) }} -
              {{ formatCurrency(productInfo.giaBanCaoNhat) }}
            </span>
          </p>

          <div
            class="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-100 shadow-sm animate-fade-in-up"
          >
            <div class="text-gray-600 leading-relaxed mb-4">
              <h2 class="text-lg font-semibold text-gray-800 mb-2 font-josefin-sans">
                Mô tả sản phẩm
              </h2>
              <p class="text-justify text-sm">
                {{ productInfo.moTaSanPham || 'Chưa có mô tả sản phẩm.' }}
              </p>
            </div>
            <div class="border-t border-gray-200 pt-4">
              <h2 class="text-lg font-semibold text-gray-800 mb-2 font-josefin-sans">
                Thông tin chi tiết
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-500 min-w-4"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.35 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09A5.5 5.5 0 0 1 12 3a5.5 5.5 0 0 1 5.5 5.5c0 3.78-3.4 6.85-8.55 11.53L12 21.35z"
                    />
                  </svg>
                  <span class="font-semibold text-gray-800">Thương hiệu:</span>
                  <span class="text-gray-600">{{
                    selectedVariant?.tenThuongHieu || 'Không rõ'
                  }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-500 min-w-4"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span class="font-semibold text-gray-800">Danh mục:</span>
                  <span class="text-gray-600">{{ selectedVariant?.tenDanhMuc || 'Không rõ' }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="min-w-4"
                    :class="getStatusText.class"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  </svg>
                  <span class="font-semibold text-gray-800">Trạng thái:</span>
                  <span :class="getStatusText.class" class="font-semibold uppercase">
                    {{ getStatusText.text }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-500 min-w-4"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <span class="font-semibold text-gray-800">Tồn kho chung:</span>
                  <span class="text-gray-600 font-semibold">{{ totalOverallStock }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="isProductDiscontinued"
            class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm"
            role="alert"
          >
            <p class="font-bold">Thông báo:</p>
            <p>Sản phẩm này hiện đã ngừng kinh doanh và không thể mua.</p>
          </div>

          <div
            v-if="!isProductDiscontinued && productVariants && productVariants.length > 0"
            class="mb-8"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-4 font-josefin-sans">
              Chọn Biến Thể:
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <button
                v-for="variant in productVariants"
                :key="variant.id"
                @click="selectVariant(variant)"
                :class="{
                  'bg-accent text-white shadow-lg scale-105':
                    selectedVariant && selectedVariant.id === variant.id,
                  'bg-gray-100 text-gray-700 hover:bg-gray-200':
                    !selectedVariant || selectedVariant.id !== variant.id,
                  'bg-red-100 text-red-500 border-red-400 opacity-70 cursor-not-allowed':
                    variant.soLuongTonKho === 0,
                  'border-2 border-transparent': variant.soLuongTonKho > 0
                }"
                :disabled="variant.soLuongTonKho === 0"
                class="px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
              >
                {{ variant.tenKichCo }} / {{ variant.tenMauSac }}
                <span
                  v-if="variant.soLuongTonKho === 0"
                  class="text-danger text-xs font-semibold block mt-1"
                  >(Hết hàng)</span
                >
              </button>
            </div>
          </div>
          <div
            v-else-if="!isProductDiscontinued && productVariants.length === 0"
            class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-sm"
            role="alert"
          >
            <p class="font-bold">Thông báo:</p>
            <p>Sản phẩm này hiện chưa có biến thể nào được cung cấp.</p>
          </div>

          <div
            v-if="selectedVariant && !isProductDiscontinued"
            class="mb-6 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-100 animate-fade-in"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-4 font-josefin-sans">
              Chi Tiết Biến Thể:
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center space-x-3 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-accent min-w-6"
                >
                  <path d="M4 15V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
                  <rect x="2" y="11" width="20" height="12" rx="2" />
                  <path d="M12 7V2" />
                  <path d="M12 22V15" />
                  <path d="M8 7v-2" />
                  <path d="M16 7v-2" />
                </svg>
                <div class="flex flex-col">
                  <p class="font-semibold text-sm">Mã:</p>
                  <p class="text-gray-600 font-normal">{{ selectedVariant.maCtsp }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-accent min-w-6"
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <div class="flex flex-col">
                  <p class="font-semibold text-sm">Giá:</p>
                  <p class="text-accent-dark font-bold">
                    {{ formatCurrency(selectedVariant.giaBan) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-accent min-w-6"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                <div class="flex flex-col">
                  <p class="font-semibold text-sm">Tồn kho:</p>
                  <p :class="getVariantStatusText.class">
                    {{ selectedVariantStock > 0 ? selectedVariantStock : 'Hết Hàng' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3 text-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-accent min-w-6"
                >
                  <path
                    d="M12 20v-8m0 0v-8m0 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4zm0 0l-4-4m4 4l4-4m-4 4l-4 4m4-4l4 4"
                  />
                </svg>
                <div class="flex flex-col">
                  <p class="font-semibold text-sm">Chất liệu:</p>
                  <p class="text-gray-600 font-normal">
                    {{ selectedVariant.tenChatLieu || 'Không rõ' }}
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3 text-gray-800 col-span-1 md:col-span-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-accent min-w-6"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" x2="16" y1="13" y2="13" />
                  <line x1="8" x2="16" y1="17" y2="17" />
                  <line x1="10" x2="14" y1="9" y2="9" />
                </svg>
                <div class="flex flex-col">
                  <p class="font-semibold text-sm">Mô tả:</p>
                  <p class="text-gray-600 font-normal">
                    {{ selectedVariant.moTaChiTiet || 'Không có mô tả.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedVariant && !isProductDiscontinued"
            class="flex items-center space-x-4 mb-6"
          >
            <h3 class="text-lg font-semibold text-gray-800 font-josefin-sans">Số lượng:</h3>
            <div
              class="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm"
            >
              <button
                @click="decrementQuantity"
                :disabled="quantity <= 1"
                aria-label="Giảm số lượng"
                class="w-10 h-10 flex items-center justify-center text-gray-600 transition-colors duration-200"
                :class="{
                  'bg-gray-100 hover:bg-gray-200': quantity > 1,
                  'bg-gray-50 text-gray-400 cursor-not-allowed': quantity <= 1
                }"
              >
                <img :src="minusIcon" alt="Giảm" class="w-4 h-4" />
              </button>
              <input
                type="number"
                v-model.number="quantity"
                @input="
                  () => {
                    if (quantity < 1) quantity = 1
                    if (quantity > selectedVariantStock) quantity = selectedVariantStock
                  }
                "
                class="w-16 h-10 text-center font-bold text-gray-800 focus:outline-none"
                :class="{ 'bg-gray-50 cursor-not-allowed': selectedVariantStock === 0 }"
                :disabled="selectedVariantStock === 0"
                aria-label="Nhập số lượng"
                min="1"
                :max="selectedVariantStock"
              />
              <button
                @click="incrementQuantity"
                :disabled="quantity >= selectedVariantStock"
                aria-label="Tăng số lượng"
                class="w-10 h-10 flex items-center justify-center text-gray-600 transition-colors duration-200"
                :class="{
                  'bg-gray-100 hover:bg-gray-200': quantity < selectedVariantStock,
                  'bg-gray-50 text-gray-400 cursor-not-allowed': quantity >= selectedVariantStock
                }"
              >
                <img :src="plusOutlineIcon" alt="Tăng" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            v-if="!isProductDiscontinued"
            class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-auto pt-6 border-t border-gray-200"
          >
            <button
              @click="handleAddToCart(selectedVariant)"
              :disabled="
                !selectedVariant || selectedVariantStock === 0 || productInfo.idTrangThai === 5
              "
              :class="{
                'bg-accent hover:bg-accent-dark': !isAddedToCart && selectedVariantStock > 0,
                'bg-success hover:bg-green-700': isAddedToCart && selectedVariantStock > 0,
                'bg-gray-400 cursor-not-allowed':
                  !selectedVariant || selectedVariantStock === 0 || productInfo.idTrangThai === 5
              }"
              class="flex-1 px-8 py-4 text-white **font-semibold font-sans** rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center"
            >
              <img
                :src="isAddedToCart ? checkedIcon : plusIcon"
                alt="Add to cart"
                class="w-6 h-6 inline-block mr-2"
              />
              {{
                isAddedToCart
                  ? 'Đã thêm vào giỏ hàng'
                  : selectedVariantStock === 0
                    ? 'Hết hàng'
                    : 'Thêm vào giỏ hàng'
              }}
            </button>
<button
  @click="handleBuyNow"
  :disabled="!selectedVariant || selectedVariantStock === 0 || isProductDiscontinued"
  class="w-full flex-1 flex items-center justify-center px-6 py-3 rounded-full font-semibold font-sans transition-all duration-300 shadow-lg border-2 border-accent text-accent hover:bg-accent hover:text-white transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
  :class="{ 'opacity-50 cursor-not-allowed': !selectedVariant || selectedVariantStock === 0 || isProductDiscontinued }"
>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-current"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  Thanh Toán Ngay
</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && relatedProducts.length > 0" class="mt-16">
      <h2
        class="text-3xl font-bold text-center text-primary border-b-4 border-accent pb-2 font-josefin-sans mb-10 animate-fade-in-up"
      >
        Sản Phẩm Có Thể Bạn Thích
      </h2>
      <CardList :items="relatedProducts" @add-to-cart="handleAddToCart" :is-loading="false" />
    </div>
  </div>

  <div
    v-if="showModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 animate-zoom-in"
    >
      <h3 class="text-xl font-bold mb-4 text-gray-900 font-josefin-sans">Thông Báo</h3>
      <p class="text-gray-700 mb-6 font-sans">{{ modalMessage }}</p>
      <div class="flex justify-end">
        <button
          @click="showModal = false"
          class="bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 font-sans"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Thêm các hiệu ứng animation để UI sống động hơn */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out forwards;
}

/* Ẩn thanh cuộn ngang trên mobile */
.thumbnail-wrapper {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.thumbnail-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-zoom-in {
  animation: zoomIn 0.3s ease-out forwards;
}
</style>
