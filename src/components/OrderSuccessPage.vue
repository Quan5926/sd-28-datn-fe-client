<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import InfoBlock from './InfoBlock.vue';
import html2pdf from 'html2pdf.js'; // Import thư viện html2pdf.js

const route = useRoute();
const orderId = route.params.orderId || 'không xác định';
const paymentStatus = route.params.paymentStatus || 'đang chờ xác nhận';

// Dữ liệu đơn hàng đầy đủ, sẽ được lấy từ sessionStorage
const orderDetails = ref(null);

// Hàm để định dạng tiền tệ (cần thiết cho hóa đơn)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Lấy dữ liệu đơn hàng từ sessionStorage khi component được mounted
onMounted(() => {
  const storedOrder = sessionStorage.getItem('currentOrderDetails');
  if (storedOrder) {
    orderDetails.value = JSON.parse(storedOrder);
    // Xóa dữ liệu khỏi sessionStorage sau khi đã lấy để tránh bị lưu trữ lâu
    sessionStorage.removeItem('currentOrderDetails');
  } else {
    // Trường hợp không tìm thấy dữ liệu (ví dụ: người dùng refresh trang)
    console.warn('Không tìm thấy chi tiết đơn hàng trong sessionStorage. PDF có thể không đầy đủ.');
  }
});

const getStatusMessage = (status) => {
  switch (status) {
    case 'paid_mock':
      return 'Đơn hàng đã được đặt thành công và thanh toán VNPAY của bạn đang chờ xác nhận.';
    case 'cod_success':
      return 'Đơn hàng của bạn đã được đặt thành công và sẽ được thanh toán khi nhận hàng (COD).';
    case 'bank_transfer_success':
      return 'Đơn hàng của bạn đã được đặt thành công. Vui lòng chuyển khoản để hoàn tất thanh toán.';
    case 'payment_pending_verification':
        return 'Đơn hàng của bạn đã được đặt thành công. Vui lòng đảm bảo bạn đã quét mã QR và chuyển khoản thành công.';
    default:
      return 'Đơn hàng của bạn đã được đặt thành công.';
  }
};

const getTitle = (status) => {
  switch (status) {
    case 'paid_mock':
    case 'payment_pending_verification':
      return 'Thanh toán thành công (VNPAY)';
    case 'cod_success':
      return 'Đặt hàng COD thành công';
    case 'bank_transfer_success':
      return 'Đặt hàng & Chuyển khoản thành công';
    default:
      return 'Đặt hàng thành công';
  }
};

const getImageUrl = (status) => {
  switch (status) {
    case 'paid_mock':
    case 'payment_pending_verification':
      return '/success-payment.png';
    case 'cod_success':
    case 'bank_transfer_success':
    default:
      return '/order-success.png';
  }
};

// Hàm tạo và tải hóa đơn PDF động
const downloadInvoice = () => {
  if (!orderDetails.value) {
    alert('Không có dữ liệu đơn hàng để tạo hóa đơn.');
    return;
  }

  const invoiceContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="/Pho-Step_logo.png" alt="Pho Step Logo" style="width: 100px; margin-bottom: 10px;">
        <h1 style="color: #4CAF50;">HÓA ĐƠN ĐẶT HÀNG</h1>
        <p style="font-size: 14px; color: #555;">Mã đơn hàng: <strong>#${orderId.value}</strong></p>
        <p style="font-size: 12px; color: #777;">Ngày đặt hàng: ${new Date(orderDetails.value.orderDate).toLocaleString('vi-VN')}</p>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px;">Thông tin khách hàng:</h2>
        <p><strong>Họ và tên:</strong> ${orderDetails.value.customerInfo.fullName}</p>
        <p><strong>Email:</strong> ${orderDetails.value.customerInfo.email}</p>
        <p><strong>Điện thoại:</strong> ${orderDetails.value.customerInfo.phoneNumber}</p>
        <p><strong>Địa chỉ:</strong> ${orderDetails.value.customerInfo.address}, ${orderDetails.value.customerInfo.ward}, ${orderDetails.value.customerInfo.district}, ${orderDetails.value.customerInfo.province}</p>
        ${orderDetails.value.customerInfo.note ? `<p><strong>Ghi chú:</strong> ${orderDetails.value.customerInfo.note}</p>` : ''}
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
        <h2 style="font-size: 18px; color: #333; margin-bottom: 10px;">Chi tiết sản phẩm:</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Sản phẩm</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Kích cỡ</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Đơn giá</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Số lượng</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.value.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.selectedSize || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.price)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right;">
          <p>Tạm tính: <strong>${formatCurrency(orderDetails.value.totalPrice)}</strong></p>
          <p>Phí vận chuyển: <strong>${formatCurrency(orderDetails.value.shippingFee)}</strong></p>
          <p>VAT: <strong>${formatCurrency(orderDetails.value.vatPrice)}</strong></p>
          <p style="font-size: 18px; font-weight: bold; margin-top: 10px;">Tổng cộng: <span style="color: #E74C3C;">${formatCurrency(orderDetails.value.finalTotalPrice)}</span></p>
          <p style="font-size: 14px; margin-top: 5px;">Phương thức thanh toán: <strong>${orderDetails.value.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : orderDetails.value.paymentMethod === 'bankTransfer' ? 'Chuyển khoản ngân hàng' : 'VNPAY QR Code'}</strong></p>
        </div>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px; text-align: center;">
        <p style="font-size: 14px; color: #555;">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>
        <p style="font-size: 12px; color: #777;">Mọi thắc mắc xin liên hệ: +84 987 654 321 hoặc email: support@phostep.com</p>
      </div>
    </div>
  `;

  // Cấu hình html2pdf
  const opt = {
    margin: 10,
    filename: `hoa-don-don-hang-${orderId.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(invoiceContent).save();
};

// Hàm mô phỏng gửi lại hóa đơn qua email đã bị xóa
</script>

<template>
  <div class="order-success-page p-8 bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
      <img src="/Pho-Step_logo.png" alt="Pho Step Logo" class="mx-auto w-32 mb-6" />

      <InfoBlock
        :title="getTitle(paymentStatus)"
        :description="getStatusMessage(paymentStatus) + ` Mã đơn hàng của bạn là: #${orderId}.`"
        :image-url="getImageUrl(paymentStatus)"
        image-alt="Order Success"
      />

      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Hóa đơn của bạn</h3>
        <p class="text-gray-600 mb-4">
          Bạn có thể tải hóa đơn chi tiết đơn hàng của mình tại đây.
          <span class="font-semibold text-blue-600">(Hóa đơn được tạo trực tiếp trên trình duyệt.)</span>
        </p>
        <div class="space-y-3">
            <button
                @click="downloadInvoice"
                class="w-full sm:w-auto inline-flex items-center justify-center bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300"
            >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                Tải hóa đơn PDF
            </button>
            </div>
      </div>

      <div class="mt-8 space-y-4">
        <router-link to="/" class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
          Tiếp tục mua sắm
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Có thể thêm các style tùy chỉnh cho trang thành công */
</style>