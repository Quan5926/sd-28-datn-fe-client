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
    try {
      const api = createAPI()
      
      let response
      if (customerId) {
        // Get personal + public vouchers for logged in users
        response = await api.get(`/vouchers/personal/${customerId}`, {
          params: { orderAmount: orderTotal }
        })
      } else {
        // Get public vouchers only for guest users
        response = await api.get('/vouchers/public', {
          params: { orderAmount: orderTotal }
        })
      }
      
      console.log('Voucher API response:', response.data)
      
      return {
        success: true,
        data: response.data.allVouchers || response.data.vouchers || [],
        personalVouchers: response.data.personalVouchers || [],
        publicVouchers: response.data.publicVouchers || [],
        bestVoucher: response.data.bestVoucher,
        message: response.data.message
      }
    } catch (error) {
      console.error('Error getting available vouchers:', error)
      throw error
    }
  },

  // Validate voucher code
  validateVoucher: async (voucherCode, orderTotal, customerId = null) => {
    try {
      const api = createAPI()
      
      const params = new URLSearchParams({
        code: voucherCode,
        orderAmount: orderTotal
      })
      
      if (customerId) {
        params.append('customerId', customerId)
      }
      
      const response = await api.post('/vouchers/validate', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      console.log('Voucher validation API response:', response.data)
      
      return {
        success: response.data.valid,
        data: response.data.voucher || null,
        voucher: response.data.voucher || null,
        voucherId: response.data.voucherId,
        discountAmount: response.data.discountAmount,
        message: response.data.message,
        isPersonal: response.data.isPersonal || false
      }
    } catch (error) {
      console.error('Error validating voucher:', error)
      throw error
    }
  },

  // Apply voucher to invoice
  applyVoucherToInvoice: async (voucherId, invoiceId) => {
    try {
      const api = createAPI()
      
      const response = await api.post(`/vouchers/apply/${voucherId}/invoice/${invoiceId}`)
      
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error) {
      console.error('Error applying voucher to invoice:', error)
      throw error
    }
  },

  // Remove voucher from invoice
  removeVoucherFromInvoice: async (invoiceId) => {
    try {
      const api = createAPI()
      
      const response = await api.delete(`/vouchers/remove/invoice/${invoiceId}`)
      
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error) {
      console.error('Error removing voucher from invoice:', error)
      throw error
    }
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
      id: parseInt(backendVoucher.id) || backendVoucher.id,
      ma: backendVoucher.ma,
      tenVoucher: backendVoucher.tenPhieuGiamGia || backendVoucher.tenVoucher,
      moTa: backendVoucher.moTa || `Giảm ${backendVoucher.loaiPhieuGiamGia === 'PERCENTAGE' ? backendVoucher.phanTramGiamGia + '%' : formatCurrency(backendVoucher.soTienGiamToiDa)}`,
      loaiGiamGia: backendVoucher.loaiPhieuGiamGia === 'PERCENTAGE' ? 'PERCENT' : 'FIXED',
      giaTriGiam: backendVoucher.loaiPhieuGiamGia === 'PERCENTAGE' ? backendVoucher.phanTramGiamGia : backendVoucher.soTienGiamToiDa,
      giaTriGiamToiDa: backendVoucher.soTienGiamToiDa,
      donHangToiThieu: backendVoucher.hoaDonToiThieu,
      soLuongSuDung: backendVoucher.soLuongSuDung || 0,
      soLuongToiDa: backendVoucher.soLuongToiDa || 999999,
      ngayBatDau: backendVoucher.ngayBatDau,
      ngayKetThuc: backendVoucher.ngayKetThuc,
      trangThai: backendVoucher.trangThai || 'ACTIVE',
      loaiKhachHang: backendVoucher.loaiKhachHang || 'ALL',
      isPersonal: backendVoucher.isPersonal || false,
      discountAmount: backendVoucher.discountAmount || 0,
      isActive: (backendVoucher.trangThai || 'ACTIVE') === 'ACTIVE',
      isExpired: backendVoucher.ngayKetThuc ? new Date(backendVoucher.ngayKetThuc) < new Date() : false,
      isUsedUp: backendVoucher.soLuongSuDung >= (backendVoucher.soLuongToiDa || 999999)
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
