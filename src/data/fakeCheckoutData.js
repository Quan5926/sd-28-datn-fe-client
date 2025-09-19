// Fake data for checkout page testing
export const fakeCartData = [
  {
    id: 1,
    tenSanPham: "Nike Air Force 1 '07",
    urlAnhDaiDien: "/sneakers/sneakers-1-alt1.jpg",
    tenKichCo: "42",
    tenMauSac: "Trắng",
    soLuong: 2,
    giaBanHienTai: 2500000,
    soLuongTonKho: 15
  },
  {
    id: 2,
    tenSanPham: "Adidas Ultraboost 22",
    urlAnhDaiDien: "/sneakers/sneakers-2-alt1.jpg",
    tenKichCo: "41",
    tenMauSac: "Đen",
    soLuong: 1,
    giaBanHienTai: 3200000,
    soLuongTonKho: 8
  },
  {
    id: 3,
    tenSanPham: "Converse Chuck Taylor All Star",
    urlAnhDaiDien: "/sneakers/sneakers-3-alt1.jpg",
    tenKichCo: "43",
    tenMauSac: "Xanh Navy",
    soLuong: 1,
    giaBanHienTai: 1800000,
    soLuongTonKho: 20
  },
  {
    id: 4,
    tenSanPham: "Vans Old Skool",
    urlAnhDaiDien: "/sneakers/sneakers-4-alt1.jpg",
    tenKichCo: "40",
    tenMauSac: "Đen/Trắng",
    soLuong: 3,
    giaBanHienTai: 2100000,
    soLuongTonKho: 12
  }
]

export const fakeCustomerData = {
  // Authenticated customer data
  authenticated: {
    profile: {
      id: 1,
      ten: "Nguyễn Văn An",
      soDienThoai: "0987654321",
      email: "nguyenvanan@gmail.com",
      ngaySinh: "1995-05-15"
    },
    addresses: [
      {
        id: 1,
        ten: "Nguyễn Văn An",
        soDienThoai: "0987654321",
        diaChiCuThe: "123 Đường Láng",
        phuong: "Phường Láng Thượng",
        quan: "Quận Đống Đa",
        thanhPho: "Hà Nội",
        macDinh: true
      },
      {
        id: 2,
        ten: "Nguyễn Văn An",
        soDienThoai: "0987654321",
        diaChiCuThe: "456 Phố Huế",
        phuong: "Phường Phúc Tân",
        quan: "Quận Hoàn Kiếm",
        thanhPho: "Hà Nội",
        macDinh: false
      },
      {
        id: 3,
        ten: "Nguyễn Văn An (Công ty)",
        soDienThoai: "0987654321",
        diaChiCuThe: "789 Nguyễn Trãi",
        phuong: "Phường Thanh Xuân Trung",
        quan: "Quận Thanh Xuân",
        thanhPho: "Hà Nội",
        macDinh: false
      }
    ]
  },
  
  // Guest customer data (empty initially)
  guest: {
    ten: "",
    soDienThoai: "",
    email: "",
    diaChi: "",
    ghiChu: ""
  }
}

export const fakeVoucherData = [
  {
    id: 1,
    ma: "WELCOME10",
    tenVoucher: "Chào mừng khách hàng mới",
    moTa: "Giảm 10% cho đơn hàng đầu tiên",
    loaiGiamGia: "PERCENT",
    giaTriGiam: 10,
    giaTriGiamToiDa: 500000,
    donHangToiThieu: 1000000,
    soLuongSuDung: 150,
    soLuongToiDa: 1000,
    ngayBatDau: "2024-01-01",
    ngayKetThuc: "2024-12-31",
    trangThai: "ACTIVE",
    loaiKhachHang: "NEW",
    isActive: true,
    isExpired: false,
    isUsedUp: false
  },
  {
    id: 2,
    ma: "FREESHIP50",
    tenVoucher: "Miễn phí vận chuyển",
    moTa: "Miễn phí ship cho đơn từ 2 triệu",
    loaiGiamGia: "FIXED",
    giaTriGiam: 50000,
    giaTriGiamToiDa: null,
    donHangToiThieu: 2000000,
    soLuongSuDung: 500,
    soLuongToiDa: 2000,
    ngayBatDau: "2024-01-01",
    ngayKetThuc: "2024-11-30",
    trangThai: "ACTIVE",
    loaiKhachHang: "ALL",
    isActive: true,
    isExpired: false,
    isUsedUp: false
  },
  {
    id: 3,
    ma: "SAVE200K",
    tenVoucher: "Giảm 200K cho đơn từ 5 triệu",
    moTa: "Giảm ngay 200.000đ cho đơn hàng từ 5 triệu",
    loaiGiamGia: "FIXED",
    giaTriGiam: 200000,
    giaTriGiamToiDa: null,
    donHangToiThieu: 5000000,
    soLuongSuDung: 200,
    soLuongToiDa: 500,
    ngayBatDau: "2024-01-01",
    ngayKetThuc: "2024-12-15",
    trangThai: "ACTIVE",
    loaiKhachHang: "ALL",
    isActive: true,
    isExpired: false,
    isUsedUp: false
  },
  {
    id: 4,
    ma: "VIP15",
    tenVoucher: "VIP giảm 15%",
    moTa: "Ưu đãi đặc biệt cho khách hàng VIP",
    loaiGiamGia: "PERCENT",
    giaTriGiam: 15,
    giaTriGiamToiDa: 1000000,
    donHangToiThieu: 3000000,
    soLuongSuDung: 50,
    soLuongToiDa: 100,
    ngayBatDau: "2024-01-01",
    ngayKetThuc: "2024-12-31",
    trangThai: "ACTIVE",
    loaiKhachHang: "VIP",
    isActive: true,
    isExpired: false,
    isUsedUp: false
  },
  {
    id: 5,
    ma: "SUMMER2024",
    tenVoucher: "Khuyến mãi mùa hè",
    moTa: "Giảm 8% cho tất cả sản phẩm",
    loaiGiamGia: "PERCENT",
    giaTriGiam: 8,
    giaTriGiamToiDa: 300000,
    donHangToiThieu: 1500000,
    soLuongSuDung: 800,
    soLuongToiDa: 1500,
    ngayBatDau: "2024-06-01",
    ngayKetThuc: "2024-08-31",
    trangThai: "ACTIVE",
    loaiKhachHang: "ALL",
    isActive: true,
    isExpired: false,
    isUsedUp: false
  }
]

export const fakeOrderData = {
  maHoaDon: "HD001234",
  ngayTao: "2024-09-18T10:30:00",
  trangThai: 1, // Chờ xác nhận
  phuongThucThanhToan: "COD",
  tenKhachHang: "Nguyễn Văn An",
  soDienThoaiKhachHang: "0987654321",
  diaChiGiaoHang: "123 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội",
  tongTienTruocGiam: 9600000,
  phiVanChuyen: 50000,
  giaTriGiam: 500000,
  tongTienSauGiam: 9150000,
  chiTietHoaDon: [
    {
      id: 1,
      tenSanPham: "Nike Air Force 1 '07",
      urlAnhDaiDien: "/sneakers/sneakers-1-alt1.jpg",
      tenKichCo: "42",
      tenMauSac: "Trắng",
      soLuong: 2,
      giaBan: 2500000
    },
    {
      id: 2,
      tenSanPham: "Adidas Ultraboost 22",
      urlAnhDaiDien: "/sneakers/sneakers-2-alt1.jpg",
      tenKichCo: "41",
      tenMauSac: "Đen",
      soLuong: 1,
      giaBan: 3200000
    },
    {
      id: 3,
      tenSanPham: "Converse Chuck Taylor All Star",
      urlAnhDaiDien: "/sneakers/sneakers-3-alt1.jpg",
      tenKichCo: "43",
      tenMauSac: "Xanh Navy",
      soLuong: 1,
      giaBan: 1800000
    }
  ]
}

// Helper functions for fake data
export const useFakeCheckoutData = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const isAuthenticated = () => {
    // Toggle this to test authenticated vs guest flow
    return true // Change to false to test guest checkout
  }

  const getCartTotal = () => {
    return fakeCartData.reduce((sum, item) => sum + (item.giaBanHienTai * item.soLuong), 0)
  }

  const getShippingFee = (total) => {
    return total >= 3000000 ? 0 : 50000
  }

  const getAvailableVouchers = (orderTotal) => {
    return fakeVoucherData.filter(voucher => {
      return voucher.isActive && 
             !voucher.isExpired && 
             !voucher.isUsedUp &&
             orderTotal >= (voucher.donHangToiThieu || 0)
    })
  }

  return {
    fakeCartData,
    fakeCustomerData,
    fakeVoucherData,
    fakeOrderData,
    formatCurrency,
    isAuthenticated,
    getCartTotal,
    getShippingFee,
    getAvailableVouchers
  }
}

export default {
  fakeCartData,
  fakeCustomerData,
  fakeVoucherData,
  fakeOrderData,
  useFakeCheckoutData
}
