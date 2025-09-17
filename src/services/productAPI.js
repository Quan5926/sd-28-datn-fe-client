import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Product API endpoints
export const productAPI = {
  // Get all products with pagination and search
  getProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/ban-hang-client/san-pham', {
        params: {
          page: params.page || 0,
          size: params.size || 10,
          keyword: params.keyword || ''
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get product details by ID
  getProductDetails: async (productId) => {
    try {
      const response = await apiClient.get(`/ban-hang-client/chi-tiet-san-pham/${productId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product details:', error)
      throw error
    }
  },

  // Get all product details with pagination and search
  getAllProductDetails: async (params = {}) => {
    try {
      const response = await apiClient.get('/ban-hang-client/chi-tiet-san-pham', {
        params: {
          page: params.page || 0,
          size: params.size || 10,
          keyword: params.keyword || ''
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching all product details:', error)
      throw error
    }
  },

  // Get products by brand IDs for collections
  getProductsByBrandIds: async (brandIds, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`/san-pham/by-thuong-hieu`, {
        params: {
          thuongHieuIds: brandIds.join(','),
          page: page,
          size: size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching products by brand IDs:', error)
      throw error
    }
  },

  // Get products by category name for homepage sections
  getProductsByCategory: async (categoryName, page = 0, size = 10) => {
    try {
      const response = await apiClient.get('/san-pham/by-danh-muc', {
        params: {
          categoryName: categoryName, // Remove encodeURIComponent - axios handles encoding automatically
          page: page,
          size: size
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/danh-muc/all')
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get all products (fallback to admin API if needed)
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/san-pham', {
        params: {
          page: params.page || 0,
          size: params.size || 9999
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }
}

// Data mapping functions
export const mapBackendToFrontend = {
  // Map product data from backend to frontend format
  product: (backendProduct) => {
    // Validate input
    if (!backendProduct) {
      console.warn('Invalid product data received:', backendProduct);
      return null;
    }

    // Calculate total stock from all product details (only active variants)
    const activeVariants = backendProduct.chiTietSanPhams?.filter(detail => !detail.deleted) || [];
    const totalStock = activeVariants.reduce((sum, detail) => sum + (detail.soLuongTonKho || 0), 0);

    // Find minimum price from active product details
    const minPrice = activeVariants.length > 0
      ? Math.min(...activeVariants.map(detail => detail.giaBan || 0).filter(price => price > 0))
      : 0;

    // Get main image URL with fallback
    let imageUrl = '/sneakers/sneakers-1-alt1.jpg';
    if (backendProduct.idAnhSanPham?.urlAnh) {
      imageUrl = backendProduct.idAnhSanPham.urlAnh;
    } else if (activeVariants.length > 0) {
      // Try to get image from first variant
      const variantWithImage = activeVariants.find(variant => variant.idAnhSanPham?.urlAnh);
      if (variantWithImage) {
        imageUrl = variantWithImage.idAnhSanPham.urlAnh;
      }
    }

    // Determine status based on stock and deleted flag
    let status = 'Đang kinh doanh';
    let statusId = 3;
    
    if (backendProduct.deleted) {
      status = 'Ngừng kinh doanh';
      statusId = 4;
    } else if (totalStock === 0) {
      status = 'Hết hàng';
      statusId = 5;
    }

    return {
      id: backendProduct.id,
      ma: backendProduct.ma || '',
      tenSanPham: backendProduct.tenSanPham || 'Sản phẩm không tên',
      title: backendProduct.tenSanPham || 'Sản phẩm không tên',
      name: backendProduct.tenSanPham || 'Sản phẩm không tên',
      brand: backendProduct.idThuongHieu?.tenThuongHieu || 'Chưa xác định',
      brandId: backendProduct.idThuongHieu?.id,
      thuongHieu: backendProduct.idThuongHieu,
      danhMuc: backendProduct.idDanhMuc?.tenDanhMuc || 'Chưa phân loại',
      categoryId: backendProduct.idDanhMuc?.id,
      urlAnhDaiDien: imageUrl,
      imageUrl: imageUrl,
      giaBanThapNhat: minPrice,
      price: minPrice,
      formattedPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice),
      soLuongTonKho: totalStock,
      stock: totalStock,
      totalStock: totalStock,
      activeVariants: activeVariants.length,
      idTrangThai: statusId,
      tenTrangThai: status,
      status: status,
      productStatus: status,
      ngayTao: backendProduct.ngayTao,
      ngayCapNhat: backendProduct.ngayCapNhat,
      createdAt: backendProduct.ngayTao ? new Date(backendProduct.ngayTao) : new Date(),
      updatedAt: backendProduct.ngayCapNhat ? new Date(backendProduct.ngayCapNhat) : new Date(),
      moTa: backendProduct.moTaSanPham || '',
      description: backendProduct.moTaSanPham || 'Chưa có mô tả sản phẩm',
      quocGiaSanXuat: backendProduct.quocGiaSanXuat || 'Chưa xác định',
      deleted: backendProduct.deleted || false,
      isAdded: false,
      isFavorite: false,
      colors: activeVariants.map(v => v.idMauSac?.hex || v.idMauSac?.ma || '#CCCCCC').filter(Boolean).filter((v, i, a) => a.indexOf(v) === i),
      sizes: activeVariants.map(v => v.idKichCo?.tenKichCo).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i),
      materials: activeVariants.map(v => v.idChatLieu?.tenChatLieu).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)
    }
  },

  // Map product detail data from backend to frontend format
  productDetail: (backendDetail) => {
    // Validate input
    if (!backendDetail) {
      console.warn('Invalid product detail data received:', backendDetail);
      return null;
    }

    const isActive = !backendDetail.deleted;
    const hasStock = (backendDetail.soLuongTonKho || 0) > 0;
    
    return {
      id: backendDetail.id,
      ma: backendDetail.ma || '',
      idSanPham: backendDetail.idSanPham,
      productId: backendDetail.idSanPham?.id || backendDetail.idSanPham,
      tenSanPham: backendDetail.idSanPham?.tenSanPham || 'Sản phẩm không tên',
      name: backendDetail.idSanPham?.tenSanPham || 'Sản phẩm không tên',
      brand: backendDetail.idSanPham?.idThuongHieu?.tenThuongHieu || 'Chưa xác định',
      danhMuc: backendDetail.idSanPham?.idDanhMuc?.tenDanhMuc || 'Chưa phân loại',
      categoryName: backendDetail.idSanPham?.idDanhMuc?.tenDanhMuc || 'Chưa phân loại',
      giaBan: backendDetail.giaBan || 0,
      price: backendDetail.giaBan || 0,
      formattedPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(backendDetail.giaBan || 0),
      soLuongTonKho: backendDetail.soLuongTonKho || 0,
      stock: backendDetail.soLuongTonKho || 0,
      mauSac: backendDetail.idMauSac?.tenMauSac || 'Chưa xác định',
      color: backendDetail.idMauSac?.tenMauSac || 'Chưa xác định',
      colorCode: backendDetail.idMauSac?.hex || backendDetail.idMauSac?.ma || '#CCCCCC',
      colorId: backendDetail.idMauSac?.id,
      kichCo: backendDetail.idKichCo?.tenKichCo || 'Chưa xác định',
      size: backendDetail.idKichCo?.tenKichCo || 'Chưa xác định',
      sizeId: backendDetail.idKichCo?.id,
      chatLieu: backendDetail.idChatLieu?.tenChatLieu || 'Chưa xác định',
      material: backendDetail.idChatLieu?.tenChatLieu || 'Chưa xác định',
      materialId: backendDetail.idChatLieu?.id,
      anhSanPham: backendDetail.idAnhSanPham?.urlAnh || '/sneakers/sneakers-1-alt1.jpg',
      imageUrl: backendDetail.idAnhSanPham?.urlAnh || '/sneakers/sneakers-1-alt1.jpg',
      ngayTao: backendDetail.ngayTao,
      ngayCapNhat: backendDetail.ngayCapNhat,
      createdAt: backendDetail.ngayTao ? new Date(backendDetail.ngayTao) : new Date(),
      updatedAt: backendDetail.ngayCapNhat ? new Date(backendDetail.ngayCapNhat) : new Date(),
      deleted: backendDetail.deleted || false,
      isActive: isActive,
      hasStock: hasStock,
      status: !isActive ? 'Ngừng kinh doanh' : (hasStock ? 'Đang kinh doanh' : 'Hết hàng'),
      statusId: !isActive ? 4 : (hasStock ? 3 : 5)
    }
  }
}

export default productAPI
