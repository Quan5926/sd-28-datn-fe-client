<script setup>
import axios from 'axios'
import { inject, ref, reactive, watch, onMounted, onUnmounted, computed, nextTick } from 'vue'
import CardList from '../components/CardList.vue'
import Banner from '../components/Banner.vue'

// Dữ liệu cho các bộ sưu tập được lấy từ Banner.vue
const collections = [
  {
    title: 'GIÀY THỂ THAO',
    brandIds: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 23, 24, 25],
    interval: 6000 // Thêm khoảng thời gian riêng cho từng bộ sưu tập
  },
  {
    title: 'GIÀY THỜI TRANG',
    brandIds: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    interval: 7000
  },
  {
    title: 'GIÀY CASUAL',
    brandIds: [4, 5],
    interval: 8000
  }
]

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

// Fake data for testing UI
const generateFakeProducts = () => {
  const fakeProducts = []
  const brands = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance', 'Reebok', 'Jordan']
  const categories = ['Air Max', 'Stan Smith', 'Chuck Taylor', 'Old Skool', 'Ultraboost', 'Classic', 'Running', 'Basketball']
  const statuses = [
    { id: 3, name: 'Đang kinh doanh' },
    { id: 5, name: 'Hết hàng' }
  ]

  for (let i = 1; i <= 50; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    const colors = [
      ['#000000', '#FFFFFF', '#FF0000'], // Đen, Trắng, Đỏ
      ['#0066CC', '#FFD700', '#32CD32'], // Xanh dương, Vàng, Xanh lá
      ['#FF69B4', '#800080', '#FFA500'], // Hồng, Tím, Cam
      ['#8B4513', '#708090', '#DC143C'], // Nâu, Xám, Đỏ đậm
      ['#000080', '#FF1493', '#00CED1']  // Xanh navy, Hồng đậm, Xanh ngọc
    ]
    
    fakeProducts.push({
      id: i,
      tenSanPham: `${brand} ${category} ${i.toString().padStart(3, '0')}`,
      urlAnhDaiDien: `/sneakers/sneakers-${((i - 1) % 48) + 1}-alt1.jpg`,
      giaBanThapNhat: Math.floor(Math.random() * 3000000) + 500000, // 500k - 3.5M VND
      soLuongTonKho: status.id === 5 ? 0 : Math.floor(Math.random() * 100) + 1,
      idTrangThai: status.id,
      tenTrangThai: status.name,
      thuongHieu: {
        id: Math.floor(Math.random() * 25) + 1,
        ten: brand
      },
      colors: colors[Math.floor(Math.random() * colors.length)]
    })
  }
  return fakeProducts
}

// Function to fetch all items for the main section
const fetchAllItems = async () => {
  try {
    const { data } = await axios.get('http://localhost:8080/api/san-phams', {
      params: {
        page: 0,
        size: 9999
      }
    })

    // Sắp xếp dữ liệu gốc theo trạng thái trước khi gán vào allItems
    const statusOrder = { '3': 1, '5': 2 }
    const sortedData = data.content.filter(item => item.idTrangThai !== 4).sort((a, b) => {
      const statusA = statusOrder[a.idTrangThai] || 99
      const statusB = statusOrder[b.idTrangThai] || 99

      if (statusA !== statusB) {
        return statusA - statusB
      }
      return a.tenSanPham.localeCompare(b.tenSanPham)
    })

    allItems.value = sortedData.map((obj) => ({
      ...obj,
      title: obj.tenSanPham,
      imageUrl: obj.urlAnhDaiDien || '/images/default-placeholder.jpg',
      price: obj.giaBanThapNhat,
      totalStock: obj.soLuongTonKho,
      productStatus: obj.tenTrangThai,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id),
      isFavorite: false
    }))
    sortAndFilterAllItems()
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu sản phẩm từ API, sử dụng fake data:', err)
    
    // Fallback to fake data
    const fakeData = generateFakeProducts()
    const statusOrder = { '3': 1, '5': 2 }
    const sortedData = fakeData.filter(item => item.idTrangThai !== 4).sort((a, b) => {
      const statusA = statusOrder[a.idTrangThai] || 99
      const statusB = statusOrder[b.idTrangThai] || 99

      if (statusA !== statusB) {
        return statusA - statusB
      }
      return a.tenSanPham.localeCompare(b.tenSanPham)
    })

    allItems.value = sortedData.map((obj) => ({
      ...obj,
      title: obj.tenSanPham,
      imageUrl: obj.urlAnhDaiDien || '/images/default-placeholder.jpg',
      price: obj.giaBanThapNhat,
      totalStock: obj.soLuongTonKho,
      productStatus: obj.tenTrangThai,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id),
      isFavorite: false
    }))
    sortAndFilterAllItems()
  }
}

// Function to fetch items for a specific collection by brand IDs
const fetchCollectionItems = async (collection) => {
  try {
    const brandIdsString = collection.brandIds.join(',')
    const { data } = await axios.get(`http://localhost:8080/api/san-phams/by-thuong-hieu?thuongHieuIds=${brandIdsString}`)

    const filteredData = data.content.filter(item => item.idTrangThai !== 4)

    const statusOrder = { '3': 1, '5': 2 }
    filteredData.sort((a, b) => {
      const statusA = statusOrder[a.idTrangThai] || 99
      const statusB = statusOrder[b.idTrangThai] || 99

      if (statusA !== statusB) {
        return statusA - statusB
      }
      return a.tenSanPham.localeCompare(b.tenSanPham)
    })

    collectionItems[collection.title] = filteredData.map((obj) => ({
      ...obj,
      title: obj.tenSanPham,
      imageUrl: obj.urlAnhDaiDien || '/images/default-placeholder.jpg',
      price: obj.giaBanThapNhat,
      totalStock: obj.soLuongTonKho,
      productStatus: obj.tenTrangThai,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id),
      isFavorite: false
    }))
    // Calculate total pages for the collection
    collectionPagination[collection.title].totalPages = Math.ceil(collectionItems[collection.title].length / collectionPagination[collection.title].itemsPerPage);
  } catch (err) {
    console.error(`Lỗi khi lấy sản phẩm cho bộ sưu tập ${collection.title}, sử dụng fake data:`, err)
    
    // Fallback to fake data for collections
    const fakeData = generateFakeProducts()
    const filteredByBrand = fakeData.filter(item => 
      collection.brandIds.includes(item.thuongHieu.id) && item.idTrangThai !== 4
    )

    const statusOrder = { '3': 1, '5': 2 }
    filteredByBrand.sort((a, b) => {
      const statusA = statusOrder[a.idTrangThai] || 99
      const statusB = statusOrder[b.idTrangThai] || 99

      if (statusA !== statusB) {
        return statusA - statusB
      }
      return a.tenSanPham.localeCompare(b.tenSanPham)
    })

    collectionItems[collection.title] = filteredByBrand.map((obj) => ({
      ...obj,
      title: obj.tenSanPham,
      imageUrl: obj.urlAnhDaiDien || '/images/default-placeholder.jpg',
      price: obj.giaBanThapNhat,
      totalStock: obj.soLuongTonKho,
      productStatus: obj.tenTrangThai,
      isAdded: cart.value.some((cartItem) => cartItem.id === obj.id),
      isFavorite: false
    }))
    // Calculate total pages for the collection
    collectionPagination[collection.title].totalPages = Math.ceil(collectionItems[collection.title].length / collectionPagination[collection.title].itemsPerPage);
  }
}

// Fetch all product items for the main list
const fetchAllCollections = async () => {
  const promises = collections.map(collection => fetchCollectionItems(collection));
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
  // Wait for all data to be fetched before starting autoplay
  await Promise.all([
    fetchAllItems(),
    fetchAllCollections()
  ]);
  
  // Now, all totalPages values are reliable, so we can start autoplay
  startAutoplay();
  collections.forEach(collection => {
    startCollectionAutoplay(collection);
  });
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
  const collection = collections.find(c => c.title === collectionTitle);
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
  const collection = collections.find(c => c.title === collectionTitle);
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
  <!-- Truyền hàm xử lý cuộn xuống Banner -->
  <Banner @scroll-to-products="scrollToProducts" :collections="collections" />

  <!-- Collections Section -->
  <!-- Sử dụng slugify để tạo id hợp lệ cho các phần tử -->
  <section v-for="collection in collections" :key="collection.title" :id="slugify(collection.title)">
    <div class="container mx-auto px-4 py-8 md:px-6">
      <h2 class="text-3xl font-bold mb-6 text-center text-primary-700 border-b-4 border-primary-500 pb-2 font-josefin-sans">
        {{ collection.title }}
      </h2>
      <div class="relative group">
        <!-- Collection items with transition -->
        <div :class="['transition-opacity duration-200 ease-in-out', {
          'opacity-0': collectionPagination[collection.title].isFading
        }]">
          <CardList
            :items="paginatedCollectionItems(collection.title)"
            @add-to-cart="onClickAddPlus"
            @toggle-favorite="onToggleFavorite"
            :is-loading="false"
          />
        </div>

        <!-- Navigation Arrows for Collections -->
        <button
          v-if="collectionPagination[collection.title].currentPage > 0"
          @click="prevCollectionPage(collection.title)"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full z-20 shadow-lg border border-gray-200 hover:shadow-xl"
          aria-label="Trang trước"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-if="collectionItems[collection.title].length > (collectionPagination[collection.title].currentPage + 1) * collectionPagination[collection.title].itemsPerPage"
          @click="nextCollectionPage(collection.title)"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full z-20 shadow-lg border border-gray-200 hover:shadow-xl"
          aria-label="Trang sau"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
  <!-- End Collections Section -->

  <section ref="productsSection">
    <div class="container mx-auto px-4 py-8 md:px-6">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8">
        <!-- Đã thêm class font-josefin-sans để đồng bộ font và border để có gạch chân -->
        <h2 class="text-4xl font-extrabold text-primary-700 mb-4 sm:mb-0 font-josefin-sans border-b-4 border-primary-500 pb-2">Tất cả sản phẩm</h2>
        <div class="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div class="relative w-full sm:w-64">
            <img class="absolute left-3 top-1/2 -translate-y-1/2" src="/search.svg" alt="Search icon" />
            <input
              @input="onChangeSearchInput"
              class="px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 w-full pl-10"
              type="text"
              placeholder="Tìm kiếm..."
            />
          </div>
          <select @change="onChangeSelect" class="px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 w-full sm:w-48">
            <option value="tenSanPham">Theo tên</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </div>
      <div class="relative group">
        <!-- CardList with transition -->
        <div :class="['transition-opacity duration-200 ease-in-out', {
          'opacity-0': isAllItemsFading
        }]">
          <CardList
            :items="paginatedItems"
            @add-to-cart="onClickAddPlus"
            @toggle-favorite="onToggleFavorite"
            :is-loading="false"
          />
        </div>
        <!-- Nút lùi lại đã được đưa ra ngoài để nằm ở hai bên khung -->
        <button
          v-if="currentPage > 0"
          @click="prevPage"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full z-20 shadow-lg border border-gray-200 hover:shadow-xl"
          aria-label="Trang sản phẩm trước"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Nút tiến lên đã được đưa ra ngoài để nằm ở hai bên khung -->
        <button
          v-if="currentPage < totalPages - 1"
          @click="nextPage"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full z-20 shadow-lg border border-gray-200 hover:shadow-xl"
          aria-label="Trang sản phẩm sau"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="mt-8 flex justify-center items-center gap-4">
        <!-- Div chỉ chứa các nút phân trang số -->
        <div class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="onPageClick(page)"
            :class="[
              'px-4 py-2 rounded-full transition-all duration-300 font-bold',
              currentPage === page - 1
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
