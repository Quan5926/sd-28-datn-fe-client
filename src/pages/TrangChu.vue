<script setup>
import { inject, ref, reactive, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import CardList from '../components/CardList.vue'
import Banner from '../components/Banner.vue'
import { productAPI, mapBackendToFrontend } from '../services/productAPI.js'

// Dữ liệu cho các bộ sưu tập theo danh mục thực từ backend
const collections = ref([
  {
    title: 'GIÀY THỂ THAO',
    categoryName: 'Giày thể thao',
    interval: 6000 // Thêm khoảng thời gian riêng cho từng bộ sưu tập
  },
  {
    title: 'GIÀY THỜI TRANG',
    categoryName: 'Giày thời trang',
    interval: 7000
  },
  {
    title: 'GIÀY CASUAL',
    categoryName: 'Casual',
    interval: 8000
  }
])

// Injection for cart actions
const { addToCart, removeFromCart, cart } = inject('cartActions')

// Reactive object for filters
const filters = reactive({
  sortBy: 'tenSanPham',
  searchQuery: ''
})

// Pagination state for 'Tất cả sản phẩm' section
const currentPage = ref(0)
const totalPages = ref(0)
const itemsPerPage = 10
const allItems = ref([])
const sortedAndFilteredItems = ref([]) // Stores the sorted and filtered list
const isAllItemsFading = ref(false); // New state to control fade effect
const autoplayInterval = ref(null); // Interval for main product list

// Reference to store items for each collection
const collectionItems = reactive({
  'GIÀY THỂ THAO': [],
  'GIÀY THỜI TRANG': [],
  'GIÀY CASUAL': []
})

// New state for collection pagination and fading effect
const collectionPagination = reactive({
  'GIÀY THỂ THAO': { currentPage: 0, itemsPerPage: 4, isFading: false, totalPages: 0 },
  'GIÀY THỜI TRANG': { currentPage: 0, itemsPerPage: 4, isFading: false, totalPages: 0 },
  'GIÀY CASUAL': { currentPage: 0, itemsPerPage: 4, isFading: false, totalPages: 0 }
});

const collectionAutoplayIntervals = reactive({}); // Intervals for each collection

// Reference for scrolling to the products section
const productsSection = ref(null)

// Function to convert a string to a URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD') // Normalize the string to a decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

// Handler for select element change
const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
  currentPage.value = 0
  sortAndFilterAllItems()
  startAutoplay();
}

// Handler for search input change
const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
  currentPage.value = 0 // Reset page on search change
  sortAndFilterAllItems()
  startAutoplay();
}

// Handler for adding/removing items from the cart
const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

// Handler for toggling favorite
const onToggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
  console.log(`${item.isFavorite ? 'Đã thêm' : 'Đã xóa'} ${item.title} ${item.isFavorite ? 'vào' : 'khỏi'} danh sách yêu thích`)
}

// Function to sort and filter all items based on status and user's sort preference
const sortAndFilterAllItems = () => {
  // Ẩn các sản phẩm có trạng thái 'Ngừng kinh doanh' (idTrangThai === 4)
  let filteredList = allItems.value.filter(item => item.idTrangThai !== 4 &&
    item.tenSanPham.toLowerCase().includes(filters.searchQuery.toLowerCase())
  )

  // Sắp xếp ưu tiên: 'Đang kinh doanh' (3) lên đầu, 'Hết hàng' (5) xuống cuối
  const statusOrder = { '3': 1, '5': 2 }
  filteredList.sort((a, b) => {
    const statusA = statusOrder[a.idTrangThai] || 99
    const statusB = statusOrder[b.idTrangThai] || 99

    if (statusA !== statusB) {
      return statusA - statusB
    }

    // Sắp xếp theo giá hoặc tên nếu trạng thái giống nhau
    if (filters.sortBy === 'price-desc') {
      return b.giaBanThapNhat - a.giaBanThapNhat
    }
    if (filters.sortBy === 'price-asc') {
      return a.giaBanThapNhat - b.giaBanThapNhat
    }
    // Sắp xếp mặc định theo tên sản phẩm
    return a.tenSanPham.localeCompare(b.tenSanPham)
  })

  totalPages.value = Math.ceil(filteredList.length / itemsPerPage)
  sortedAndFilteredItems.value = filteredList
}


// Function to fetch all items for the main section
const fetchAllItems = async () => {
  try {
    const response = await productAPI.getProducts({ page: 0, size: 9999 })
    
    // Try to enrich with discount information
    try {
      const allProductDetails = await productAPI.getAllProductDetailsWithDiscount()
      
      // Create a map of discount information by product ID
      const discountMap = new Map()
      allProductDetails.forEach(detail => {
        // Use the new idSanPham field from backend
        const productId = detail.idSanPham
        console.log('Processing discount detail:', {
          detailId: detail.id,
          productId: productId,
          idSanPham: detail.idSanPham,
          tenSanPham: detail.tenSanPham,
          hasDiscount: detail.hasDiscount,
          giaGiamGia: detail.giaGiamGia,
          tenDotGiamGia: detail.tenDotGiamGia
        })
        
        if (productId && detail.hasDiscount && detail.giaGiamGia) {
          if (!discountMap.has(productId)) {
            discountMap.set(productId, [])
          }
          discountMap.get(productId).push({
            giaGiamGia: detail.giaGiamGia,
            tenDotGiamGia: detail.tenDotGiamGia,
            hasDiscount: detail.hasDiscount
          })
        }
      })
      
      console.log('Discount map created:', discountMap)
      
      // Enrich existing products with discount information
      response.content.forEach(product => {
        const discountInfo = discountMap.get(product.id)
        console.log(`Checking product ${product.id} (${product.tenSanPham}):`, discountInfo)
        
        if (discountInfo && discountInfo.length > 0) {
          // Find variants with discount
          const variantsWithDiscount = discountInfo.filter(info => info.hasDiscount && info.giaGiamGia)
          console.log(`Variants with discount for product ${product.id}:`, variantsWithDiscount)
          
          if (variantsWithDiscount.length > 0) {
            // Add discount info to product's chiTietSanPhams
            if (!product.chiTietSanPhams) product.chiTietSanPhams = []
            variantsWithDiscount.forEach(discount => {
              product.chiTietSanPhams.push({
                giaGiamGia: discount.giaGiamGia,
                tenDotGiamGia: discount.tenDotGiamGia,
                hasDiscount: discount.hasDiscount
              })
            })
            console.log(`Added discount info to product ${product.id}:`, product.chiTietSanPhams)
          }
        }
      })
      
      console.log('Homepage products enriched with discount info')
      console.log('All homepage products:', allItems.value.slice(0, 3).map(p => ({
        id: p.id,
        name: p.tenSanPham,
        hasDiscount: p.hasDiscount,
        campaignName: p.campaignName,
        discountPrice: p.discountPrice
      })))
      console.log('Sample homepage product with discount:', allItems.value.find(p => p.hasDiscount))
    } catch (discountError) {
      console.warn('Failed to enrich homepage products with discount, using regular products:', discountError)
    }
    
    // Sắp xếp dữ liệu gốc theo trạng thái trước khi gán vào allItems
    const statusOrder = { '3': 1, '5': 2 }
    const sortedData = response.content.filter(item => item.idTrangThai !== 4).sort((a, b) => {
      const statusA = statusOrder[a.idTrangThai] || 99
      const statusB = statusOrder[b.idTrangThai] || 99

      if (statusA !== statusB) {
        return statusA - statusB
      }
      return new Date(b.ngayTao) - new Date(a.ngayTao)
    })

    // Map dữ liệu từ backend sang frontend format
    allItems.value = sortedData.map(item => {
      const mappedProduct = mapBackendToFrontend.product(item)
      console.log('Mapped product:', {
        id: mappedProduct.id,
        name: mappedProduct.tenSanPham,
        hasDiscount: mappedProduct.hasDiscount,
        campaignName: mappedProduct.campaignName,
        discountPrice: mappedProduct.discountPrice
      })
      return {
        ...mappedProduct,
        originalPrice: null,
        discount: null,
        isFavorite: false
      }
    })
    sortAndFilterAllItems()
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm từ API:', err)
    // Set empty array if API fails
    allItems.value = []
    sortAndFilterAllItems()
  }
}

// Optimized function to fetch items for a specific collection by category
const fetchCollectionItems = async (collection) => {
  try {
    console.log(`Fetching products for ${collection.title} with category: "${collection.categoryName}"`)
    
    const response = await productAPI.getProductsByCategory(collection.categoryName, 0, 20)
    
    if (response?.content?.length > 0) {
      // Try to enrich collection products with discount information
      try {
        const allProductDetails = await productAPI.getAllProductDetailsWithDiscount()
        
        // Create a map of discount information by product ID
        const discountMap = new Map()
        allProductDetails.forEach(detail => {
          const productId = detail.idSanPham
          if (productId && detail.hasDiscount && detail.giaGiamGia) {
            if (!discountMap.has(productId)) {
              discountMap.set(productId, [])
            }
            discountMap.get(productId).push({
              giaGiamGia: detail.giaGiamGia,
              tenDotGiamGia: detail.tenDotGiamGia,
              hasDiscount: detail.hasDiscount
            })
          }
        })
        
        // Enrich collection products with discount information
        response.content.forEach(product => {
          const discountInfo = discountMap.get(product.id)
          if (discountInfo && discountInfo.length > 0) {
            // Add discount info to product's chiTietSanPhams
            if (!product.chiTietSanPhams) product.chiTietSanPhams = []
            discountInfo.forEach(discount => {
              product.chiTietSanPhams.push({
                giaGiamGia: discount.giaGiamGia,
                tenDotGiamGia: discount.tenDotGiamGia,
                hasDiscount: discount.hasDiscount
              })
            })
            console.log(`Added discount info to collection product ${product.id}:`, discountInfo)
          }
        })
        
        console.log(`Collection ${collection.title} enriched with discount info`)
      } catch (discountError) {
        console.warn(`Failed to enrich collection ${collection.title} with discount info:`, discountError)
      }
      
      const mappedProducts = response.content.map(backendProduct => 
        mapBackendToFrontend.product(backendProduct)
      )
      
      collectionItems[collection.title] = mappedProducts
      console.log(`✅ Loaded ${mappedProducts.length} products for ${collection.title}`)
      console.log(`Collection products with discount:`, mappedProducts.filter(p => p.hasDiscount))
    } else {
      console.warn(`⚠️ No products found for ${collection.title} with category "${collection.categoryName}"`)
      collectionItems[collection.title] = []
    }
    
    collectionPagination[collection.title].totalPages = Math.ceil(
      collectionItems[collection.title].length / collectionPagination[collection.title].itemsPerPage
    )
  } catch (err) {
    console.error(`❌ Error fetching products for ${collection.title}:`, err)
    collectionItems[collection.title] = []
    collectionPagination[collection.title].totalPages = 0
  }
}

// Optimized category loading - no need for complex mapping since we already have exact names
const loadCategoriesAndUpdateCollections = async () => {
  try {
    console.log('Using predefined category names for homepage sections')
    // Categories are already correctly set in collections array, no need to fetch and map
  } catch (error) {
    console.error('Error in category setup:', error)
  }
}

// Fetch all product items for the main list
const fetchAllCollections = async () => {
  const promises = collections.value.map(collection => fetchCollectionItems(collection));
  await Promise.all(promises);
}

// Autoplay logic for main product list
const startAutoplay = () => {
  // Kiểm tra nếu chỉ có một trang sản phẩm, không cần tự động chuyển trang
  if (totalPages.value <= 1) {
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value);
    }
    return;
  }

  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }
  // Đặt thời gian tự động cuộn cho mục "Tất cả sản phẩm" là 5 giây
  autoplayInterval.value = setInterval(() => {
    nextPageAutoPlay();
  }, 5000);
};

// Autoplay logic for collections
const startCollectionAutoplay = (collection) => {
  // Kiểm tra nếu chỉ có một trang sản phẩm, không cần tự động chuyển trang
  if (collectionPagination[collection.title].totalPages <= 1) {
    if (collectionAutoplayIntervals[collection.title]) {
      clearInterval(collectionAutoplayIntervals[collection.title]);
    }
    return;
  }

  if (collectionAutoplayIntervals[collection.title]) {
    clearInterval(collectionAutoplayIntervals[collection.title]);
  }
  // Sử dụng khoảng thời gian riêng cho từng bộ sưu tập
  collectionAutoplayIntervals[collection.title] = setInterval(() => {
    nextCollectionPageAutoPlay(collection.title);
  }, collection.interval);
};

onMounted(async () => {
  // First load categories from database and update collections
  await loadCategoriesAndUpdateCollections()
  
  await fetchAllItems()
  await fetchAllCollections()
  startAutoplay()
  
  // Start autoplay for each collection
  collections.value.forEach(collection => {
    startCollectionAutoplay(collection)
  })
})

onUnmounted(() => {
  // Clear all intervals to prevent memory leaks
  clearInterval(autoplayInterval.value);
  for (const key in collectionAutoplayIntervals) {
    clearInterval(collectionAutoplayIntervals[key]);
  }
});

// Computed property for main section pagination
const paginatedItems = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return sortedAndFilteredItems.value.slice(start, end)
})

// Computed property for collection section pagination
const paginatedCollectionItems = (collectionTitle) => {
  const collection = collectionItems[collectionTitle];
  if (!collection) {
    return [];
  }
  const start = collectionPagination[collectionTitle].currentPage * collectionPagination[collectionTitle].itemsPerPage;
  const end = start + collectionPagination[collectionTitle].itemsPerPage;
  return collection.slice(start, end);
};

// Hàm mới: chuyển trang tự động cho các bộ sưu tập mà không cuộn
const nextCollectionPageAutoPlay = async (collectionTitle) => {
  const currentCollection = collectionPagination[collectionTitle];
  if (currentCollection.currentPage < currentCollection.totalPages - 1) {
    currentCollection.isFading = true;
    await nextTick();
    setTimeout(() => {
      currentCollection.currentPage++;
      currentCollection.isFading = false;
    }, 200);
  } else {
    currentCollection.isFading = true;
    await nextTick();
    setTimeout(() => {
      currentCollection.currentPage = 0;
      currentCollection.isFading = false;
    }, 200);
  }
};

// Hàm mới: chỉ chuyển trang tự động cho 'Tất cả sản phẩm' mà không cuộn
const nextPageAutoPlay = async () => {
  if (currentPage.value < totalPages.value - 1) {
    isAllItemsFading.value = true;
    await nextTick();
    setTimeout(() => {
      currentPage.value++;
      isAllItemsFading.value = false;
    }, 200);
  } else {
    isAllItemsFading.value = true;
    await nextTick();
    setTimeout(() => {
      isAllItemsFading.value = false;
    }, 200);
  }
}

// Hàm cũ, chỉ dùng cho click thủ công
const nextPage = async () => {
  if (currentPage.value < totalPages.value - 1) {
    startAutoplay(); // Restart interval on manual interaction
    isAllItemsFading.value = true;
    await nextTick();
    setTimeout(() => {
      currentPage.value++;
      isAllItemsFading.value = false;
      scrollToProducts('Tất cả sản phẩm'); // Cuộn khi người dùng click
    }, 200);
  }
}

const prevPage = async () => {
  if (currentPage.value > 0) {
    startAutoplay(); // Restart interval on manual interaction
    isAllItemsFading.value = true;
    await nextTick();
    setTimeout(() => {
      currentPage.value--;
      isAllItemsFading.value = false;
      scrollToProducts('Tất cả sản phẩm');
    }, 200);
  }
}

// Cập nhật hàm scrollToProducts để chấp nhận tham số
const scrollToProducts = (collectionTitle) => {
  // Tạo id bằng cách sử dụng hàm slugify để xử lý các ký tự tiếng Việt
  const targetId = slugify(collectionTitle);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Nếu không tìm thấy, cuộn đến phần 'Tất cả sản phẩm'
    if (productsSection.value) {
      productsSection.value.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Function to handle click on page number buttons
const onPageClick = (page) => {
  currentPage.value = page - 1;
  scrollToProducts('Tất cả sản phẩm');
  startAutoplay(); // Restart autoplay on manual page navigation
}

// Cập nhật hàm điều hướng trang cho bộ sưu tập
const nextCollectionPage = async (collectionTitle) => {
  const currentCollection = collectionPagination[collectionTitle];
  // Lỗi: Biến `collection` không được định nghĩa, cần tìm lại từ `collections`
  const collection = collections.value.find(c => c.title === collectionTitle);
  if (currentCollection.currentPage < currentCollection.totalPages - 1) {
    // Sửa lỗi: Truyền đối tượng collection đã tìm thấy vào hàm
    startCollectionAutoplay(collection); // Restart interval on manual interaction
    currentCollection.isFading = true;
    await nextTick();
    setTimeout(() => {
      currentCollection.currentPage++;
      currentCollection.isFading = false;
      scrollToProducts(collectionTitle);
    }, 200);
  }
};

const prevCollectionPage = async (collectionTitle) => {
  const currentCollection = collectionPagination[collectionTitle];
  // Lỗi: Biến `collection` không được định nghĩa, cần tìm lại từ `collections`
  const collection = collections.value.find(c => c.title === collectionTitle);
  if (currentCollection.currentPage > 0) {
    // Sửa lỗi: Truyền đối tượng collection đã tìm thấy vào hàm
    startCollectionAutoplay(collection); // Restart interval on manual interaction
    currentCollection.isFading = true;
    await nextTick();
    setTimeout(() => {
      currentCollection.currentPage--;
      currentCollection.isFading = false;
      scrollToProducts(collectionTitle);
    }, 200);
  }
};

watch(cart, () => {
  allItems.value = allItems.value.map((obj) => ({
    ...obj,
    isAdded: cart.value.some((cartItem) => cartItem.id === obj.id)
  }))
  collections.forEach(collection => {
    collectionItems[collection.title] = collectionItems[collection.title].map((obj) => ({
      ...obj,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id)
    }))
  })
})
</script>

<template>
  <!-- Banner Section -->
  <Banner @scroll-to-products="scrollToProducts" :collections="collections" />
  

  <!-- Collections Section -->
  <div class="bg-gradient-to-b from-gray-50 to-white pt-8 pb-16">
    <section v-for="(collection, index) in collections" :key="collection.title" :id="slugify(collection.title)" 
      class="mb-20 last:mb-0">
      <div class="container mx-auto px-4 md:px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-4 mb-4">
            <div class="w-12 h-0.5 bg-primary-500 rounded-full"></div>
            <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Bộ sưu tập {{ String(index + 1).padStart(2, '0') }}</span>
            <div class="w-12 h-0.5 bg-primary-500 rounded-full"></div>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-josefin-sans">
            {{ collection.title }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những thiết kế độc đáo và chất lượng cao trong bộ sưu tập này
          </p>
        </div>

        <!-- Products Container -->
        <div class="relative group bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <!-- Collection items with transition -->
          <div :class="['transition-all duration-300 ease-in-out', {
            'opacity-0 scale-95': collectionPagination[collection.title].isFading,
            'opacity-100 scale-100': !collectionPagination[collection.title].isFading
          }]">
            <CardList
              :items="paginatedCollectionItems(collection.title)"
              @add-to-cart="onClickAddPlus"
              @toggle-favorite="onToggleFavorite"
              :is-loading="false"
            />
          </div>

          <!-- Navigation Arrows -->
          <button
            v-if="collectionPagination[collection.title].currentPage > 0"
            @click="prevCollectionPage(collection.title)"
            class="absolute -left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-full z-20 shadow-lg hover:bg-primary-600 hover:scale-110"
            aria-label="Trang trước"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-if="collectionItems[collection.title].length > (collectionPagination[collection.title].currentPage + 1) * collectionPagination[collection.title].itemsPerPage"
            @click="nextCollectionPage(collection.title)"
            class="absolute -right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-full z-20 shadow-lg hover:bg-primary-600 hover:scale-110"
            aria-label="Trang sau"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Progress Indicators -->
          <div class="flex justify-center mt-8 gap-2">
            <div 
              v-for="page in collectionPagination[collection.title].totalPages" 
              :key="page"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                collectionPagination[collection.title].currentPage === page - 1
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- End Collections Section -->

  <!-- All Products Section -->
  <section ref="productsSection" class="bg-white py-20">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-4 mb-6">
          <div class="w-16 h-0.5 bg-primary-500 rounded-full"></div>
          <span class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Sản phẩm</span>
          <div class="w-16 h-0.5 bg-primary-500 rounded-full"></div>
        </div>
        <h2 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-josefin-sans">
          Tất cả sản phẩm
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Khám phá toàn bộ bộ sưu tập giày dép chất lượng cao với đa dạng phong cách và thiết kế
        </p>
        
        <!-- Search and Filter Controls -->
        <div class="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div class="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <!-- Search Input -->
            <div class="relative flex-1 max-w-md">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                @input="onChangeSearchInput"
                class="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
            
            <!-- Sort Dropdown -->
            <div class="relative">
              <select @change="onChangeSelect" 
                class="appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-gray-700 font-medium cursor-pointer">
                <option value="tenSanPham">Sắp xếp theo tên</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid Container -->
      <div class="relative group bg-gray-50 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300">
        <!-- Products with enhanced transition -->
        <div :class="['transition-all duration-300 ease-in-out', {
          'opacity-0 scale-95 blur-sm': isAllItemsFading,
          'opacity-100 scale-100 blur-0': !isAllItemsFading
        }]">
          <CardList
            :items="paginatedItems"
            @add-to-cart="onClickAddPlus"
            @toggle-favorite="onToggleFavorite"
            :is-loading="false"
          />
        </div>
        
        <!-- Enhanced Navigation Arrows -->
        <button
          v-if="currentPage > 0"
          @click="prevPage"
          class="absolute -left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-full z-20 shadow-xl hover:scale-110 hover:shadow-2xl"
          aria-label="Trang sản phẩm trước"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-if="currentPage < totalPages - 1"
          @click="nextPage"
          class="absolute -right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out rounded-full z-20 shadow-xl hover:scale-110 hover:shadow-2xl"
          aria-label="Trang sản phẩm sau"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Enhanced Pagination -->
      <div class="mt-12 flex flex-col items-center gap-6">
        <!-- Page Info -->
        <div class="text-gray-600 text-lg">
          Trang <span class="font-bold text-primary-600">{{ currentPage + 1 }}</span> 
          trên <span class="font-bold text-primary-600">{{ totalPages }}</span>
          ({{ sortedAndFilteredItems.length }} sản phẩm)
        </div>
        
        <!-- Page Numbers -->
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="onPageClick(page)"
            :class="[
              'min-w-[3rem] h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-105',
              currentPage === page - 1
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-110'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 shadow-sm'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
