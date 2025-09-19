import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

// Create axios instance
const createAPI = () => {
  const token = localStorage.getItem('token')
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  })
}

export const voucherAPI = {
  // Get available vouchers for customer
  getAvailableVouchers: async (customerId = null, orderTotal = 0) => {
    const api = createAPI()
    
    const params = {
      ...(customerId && { customerId }),
      orderTotal
    }
    
    const response = await api.get('/vouchers/available', { params })
    return response.data
  },

  // Validate voucher code
  validateVoucher: async (voucherCode, orderTotal, customerId = null) => {
    const api = createAPI()
    
    const response = await api.post('/vouchers/validate', {
      ma: voucherCode,
      tongDonHang: orderTotal,
      ...(customerId && { idKhachHang: customerId })
    })
    return response.data
  },

  // Apply voucher to order
  applyVoucher: async (voucherCode, orderData) => {
    const api = createAPI()
    
    const response = await api.post('/vouchers/apply', {
      maVoucher: voucherCode,
      donHang: orderData
    })
    return response.data
  },

  // Get voucher details by code
  getVoucherByCode: async (voucherCode) => {
    const api = createAPI()
    
    const response = await api.get(`/vouchers/code/${voucherCode}`)
    return response.data
  },

  // Check voucher usage for customer
  checkVoucherUsage: async (voucherCode, customerId) => {
    const api = createAPI()
    
    const response = await api.get('/vouchers/usage', {
      params: {
        ma: voucherCode,
        idKhachHang: customerId
      }
    })
    return response.data
  },

  // Calculate discount amount
  calculateDiscount: (voucher, orderTotal) => {
    if (!voucher) return 0
    
    let discount = 0
    
    // Check minimum order requirement
    if (voucher.donHangToiThieu && orderTotal < voucher.donHangToiThieu) {
      return 0
    }
    
    if (voucher.loaiGiamGia === 'PERCENT') {
      // Percentage discount
      discount = (orderTotal * voucher.giaTriGiam) / 100
      
      // Apply maximum discount limit if exists
      if (voucher.giaTriGiamToiDa && discount > voucher.giaTriGiamToiDa) {
        discount = voucher.giaTriGiamToiDa
      }
    } else if (voucher.loaiGiamGia === 'FIXED') {
      // Fixed amount discount
      discount = voucher.giaTriGiam
    }
    
    // Ensure discount doesn't exceed order total
    return Math.min(discount, orderTotal)
  },

  // Format voucher data for frontend display
  formatVoucherData: (backendVoucher) => {
    if (!backendVoucher) return null
    
    return {
      id: backendVoucher.id,
      ma: backendVoucher.ma,
      tenVoucher: backendVoucher.tenVoucher,
      moTa: backendVoucher.moTa,
      loaiGiamGia: backendVoucher.loaiGiamGia, // 'PERCENT' or 'FIXED'
      giaTriGiam: backendVoucher.giaTriGiam,
      giaTriGiamToiDa: backendVoucher.giaTriGiamToiDa,
      donHangToiThieu: backendVoucher.donHangToiThieu,
      soLuongSuDung: backendVoucher.soLuongSuDung,
      soLuongToiDa: backendVoucher.soLuongToiDa,
      ngayBatDau: backendVoucher.ngayBatDau,
      ngayKetThuc: backendVoucher.ngayKetThuc,
      trangThai: backendVoucher.trangThai,
      loaiKhachHang: backendVoucher.loaiKhachHang, // 'ALL', 'NEW', 'VIP'
      isActive: backendVoucher.trangThai === 'ACTIVE',
      isExpired: new Date(backendVoucher.ngayKetThuc) < new Date(),
      isUsedUp: backendVoucher.soLuongSuDung >= backendVoucher.soLuongToiDa
    }
  },

  // Validate voucher conditions
  validateVoucherConditions: (voucher, orderTotal, customerId = null, customerType = 'REGULAR') => {
    const errors = []
    
    if (!voucher) {
      errors.push('Voucher không tồn tại')
      return { isValid: false, errors }
    }
    
    // Check if voucher is active
    if (!voucher.isActive) {
      errors.push('Voucher không còn hiệu lực')
    }
    
    // Check expiry date
    if (voucher.isExpired) {
      errors.push('Voucher đã hết hạn sử dụng')
    }
    
    // Check usage limit
    if (voucher.isUsedUp) {
      errors.push('Voucher đã hết lượt sử dụng')
    }
    
    // Check minimum order requirement
    if (voucher.donHangToiThieu && orderTotal < voucher.donHangToiThieu) {
      errors.push(`Đơn hàng tối thiểu ${formatCurrency(voucher.donHangToiThieu)} để sử dụng voucher này`)
    }
    
    // Check customer type requirement
    if (voucher.loaiKhachHang && voucher.loaiKhachHang !== 'ALL') {
      if (voucher.loaiKhachHang === 'NEW' && customerType !== 'NEW') {
        errors.push('Voucher chỉ dành cho khách hàng mới')
      }
      if (voucher.loaiKhachHang === 'VIP' && customerType !== 'VIP') {
        errors.push('Voucher chỉ dành cho khách hàng VIP')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Get customer voucher history
  getCustomerVoucherHistory: async (customerId) => {
    const api = createAPI()
    
    const response = await api.get(`/vouchers/history/${customerId}`)
    return response.data
  },

  // Mock data for development (remove when backend is ready)
  getMockVouchers: (orderTotal = 0) => {
    const mockVouchers = [
      {
        id: 1,
        ma: 'WELCOME10',
        tenVoucher: 'Chào mừng khách hàng mới',
        moTa: 'Giảm 10% cho đơn hàng đầu tiên',
        loaiGiamGia: 'PERCENT',
        giaTriGiam: 10,
        giaTriGiamToiDa: 100000,
        donHangToiThieu: 500000,
        soLuongSuDung: 150,
        soLuongToiDa: 1000,
        ngayBatDau: '2024-01-01',
        ngayKetThuc: '2024-12-31',
        trangThai: 'ACTIVE',
        loaiKhachHang: 'NEW'
      },
      {
        id: 2,
        ma: 'FREESHIP',
        tenVoucher: 'Miễn phí vận chuyển',
        moTa: 'Miễn phí ship cho đơn từ 300K',
        loaiGiamGia: 'FIXED',
        giaTriGiam: 50000,
        giaTriGiamToiDa: null,
        donHangToiThieu: 300000,
        soLuongSuDung: 500,
        soLuongToiDa: 2000,
        ngayBatDau: '2024-01-01',
        ngayKetThuc: '2024-11-30',
        trangThai: 'ACTIVE',
        loaiKhachHang: 'ALL'
      },
      {
        id: 3,
        ma: 'SAVE50K',
        tenVoucher: 'Giảm 50K cho đơn từ 1 triệu',
        moTa: 'Giảm ngay 50.000đ cho đơn hàng từ 1 triệu',
        loaiGiamGia: 'FIXED',
        giaTriGiam: 50000,
        giaTriGiamToiDa: null,
        donHangToiThieu: 1000000,
        soLuongSuDung: 200,
        soLuongToiDa: 500,
        ngayBatDau: '2024-01-01',
        ngayKetThuc: '2024-12-15',
        trangThai: 'ACTIVE',
        loaiKhachHang: 'ALL'
      },
      {
        id: 4,
        ma: 'VIP20',
        tenVoucher: 'VIP giảm 20%',
        moTa: 'Ưu đãi đặc biệt cho khách hàng VIP',
        loaiGiamGia: 'PERCENT',
        giaTriGiam: 20,
        giaTriGiamToiDa: 200000,
        donHangToiThieu: 800000,
        soLuongSuDung: 50,
        soLuongToiDa: 100,
        ngayBatDau: '2024-01-01',
        ngayKetThuc: '2024-12-31',
        trangThai: 'ACTIVE',
        loaiKhachHang: 'VIP'
      }
    ]
    
    // Filter vouchers based on order total
    return mockVouchers
      .map(voucher => this.formatVoucherData(voucher))
      .filter(voucher => {
        if (!voucher.isActive || voucher.isExpired || voucher.isUsedUp) {
          return false
        }
        return !voucher.donHangToiThieu || orderTotal >= voucher.donHangToiThieu
      })
  }
}

// Helper function for currency formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export default voucherAPI
