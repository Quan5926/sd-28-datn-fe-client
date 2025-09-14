<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Góp ý - Phản hồi</h1>
      <p class="text-gray-600">Chia sẻ ý kiến và nhận hỗ trợ từ chúng tôi</p>
    </div>
    
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button 
          @click="activeTab = 'feedback'"
          :class="activeTab === 'feedback' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
        >
          Gửi góp ý
        </button>
        <button 
          @click="activeTab = 'history'"
          :class="activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
        >
          Lịch sử phản hồi
        </button>
        <button 
          @click="activeTab = 'support'"
          :class="activeTab === 'support' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
        >
          Hỗ trợ trực tuyến
        </button>
      </nav>
    </div>
    
    <!-- Feedback Form Tab -->
    <div v-if="activeTab === 'feedback'" class="space-y-6">
      <form @submit.prevent="submitFeedback" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại góp ý *</label>
            <select 
              v-model="feedbackForm.type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn loại góp ý</option>
              <option value="product">Góp ý về sản phẩm</option>
              <option value="service">Góp ý về dịch vụ</option>
              <option value="website">Góp ý về website</option>
              <option value="delivery">Góp ý về giao hàng</option>
              <option value="complaint">Khiếu nại</option>
              <option value="suggestion">Đề xuất cải thiện</option>
              <option value="other">Khác</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
            <select 
              v-model="feedbackForm.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="urgent">Khẩn cấp</option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
          <input 
            v-model="feedbackForm.title"
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tiêu đề góp ý"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết *</label>
          <textarea 
            v-model="feedbackForm.content"
            required
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mô tả chi tiết góp ý của bạn..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Đính kèm file</label>
          <input 
            type="file" 
            multiple 
            accept="image/*,.pdf,.doc,.docx"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <p class="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, PDF, DOC (tối đa 5MB mỗi file)</p>
        </div>
        
        <div class="flex items-center">
          <input 
            v-model="feedbackForm.allowContact"
            type="checkbox" 
            id="allowContact"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="allowContact" class="ml-2 block text-sm text-gray-700">
            Cho phép chúng tôi liên hệ qua email để hỗ trợ tốt hơn
          </label>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="submit"
            class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Gửi góp ý
          </button>
        </div>
      </form>
    </div>
    
    <!-- Feedback History Tab -->
    <div v-if="activeTab === 'history'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-800">Lịch sử góp ý của bạn</h3>
        <div class="flex items-center space-x-2">
          <select 
            v-model="historyFilter"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang xử lý</option>
            <option value="replied">Đã phản hồi</option>
            <option value="resolved">Đã giải quyết</option>
          </select>
        </div>
      </div>
      
      <div class="space-y-4">
        <div 
          v-for="feedback in filteredFeedbackHistory" 
          :key="feedback.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-medium text-gray-800">{{ feedback.title }}</h4>
              <p class="text-sm text-gray-600">{{ feedback.type }} • {{ feedback.date }}</p>
            </div>
            <span 
              :class="getStatusClass(feedback.status)"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ getStatusText(feedback.status) }}
            </span>
          </div>
          
          <p class="text-gray-700 mb-3">{{ feedback.content }}</p>
          
          <div v-if="feedback.reply" class="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h5 class="font-medium text-blue-800">Phản hồi từ PhoStep</h5>
            </div>
            <p class="text-blue-700">{{ feedback.reply.content }}</p>
            <p class="text-xs text-blue-600 mt-2">{{ feedback.reply.date }} • {{ feedback.reply.author }}</p>
          </div>
          
          <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <p class="text-sm text-gray-500">Mã: {{ feedback.ticketId }}</p>
            <div class="space-x-2">
              <button 
                v-if="feedback.status === 'resolved'"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Đánh giá
              </button>
              <button 
                v-if="feedback.status !== 'resolved'"
                class="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Theo dõi
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredFeedbackHistory.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">Chưa có góp ý nào</h3>
        <p class="text-gray-600">Bạn chưa gửi góp ý nào. Hãy chia sẻ ý kiến của bạn với chúng tôi!</p>
      </div>
    </div>
    
    <!-- Online Support Tab -->
    <div v-if="activeTab === 'support'" class="space-y-6">
      <!-- Support Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 rounded-lg p-6 text-center hover:bg-blue-100 transition-colors cursor-pointer">
          <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">Live Chat</h3>
          <p class="text-sm text-gray-600 mb-4">Trò chuyện trực tiếp với nhân viên hỗ trợ</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
            Bắt đầu chat
          </button>
        </div>
        
        <div class="bg-green-50 rounded-lg p-6 text-center hover:bg-green-100 transition-colors cursor-pointer">
          <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">Hotline</h3>
          <p class="text-sm text-gray-600 mb-4">Gọi điện trực tiếp để được hỗ trợ</p>
          <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm">
            1900 1234
          </button>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-6 text-center hover:bg-yellow-100 transition-colors cursor-pointer">
          <div class="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">Email</h3>
          <p class="text-sm text-gray-600 mb-4">Gửi email để được hỗ trợ chi tiết</p>
          <button class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm">
            support@phostep.com
          </button>
        </div>
      </div>
      
      <!-- FAQ Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 mb-4">Câu hỏi thường gặp</h3>
        <div class="space-y-3">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="border border-gray-200 rounded-lg"
          >
            <button 
              @click="toggleFAQ(index)"
              class="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-gray-800">{{ faq.question }}</span>
              <svg 
                :class="{ 'rotate-180': expandedFAQs.includes(index) }"
                class="w-5 h-5 text-gray-500 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div 
              v-if="expandedFAQs.includes(index)"
              class="px-4 pb-3 text-gray-600 border-t border-gray-100"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const activeTab = ref('feedback')
const historyFilter = ref('all')
const expandedFAQs = ref([])

// Feedback Form
const feedbackForm = reactive({
  type: '',
  priority: 'medium',
  title: '',
  content: '',
  allowContact: true
})

// Sample feedback history
const feedbackHistory = ref([
  {
    id: 1,
    ticketId: 'FB001234',
    title: 'Góp ý về chất lượng sản phẩm Nike Air Max',
    type: 'Góp ý về sản phẩm',
    content: 'Tôi mua giày Nike Air Max nhưng chất lượng không như mong đợi...',
    status: 'resolved',
    date: '15/09/2024',
    reply: {
      content: 'Cảm ơn bạn đã góp ý. Chúng tôi đã kiểm tra và sẽ cải thiện quy trình kiểm tra chất lượng.',
      date: '16/09/2024',
      author: 'Nguyễn Văn B - Bộ phận CSKH'
    }
  },
  {
    id: 2,
    ticketId: 'FB001235',
    title: 'Đề xuất cải thiện website',
    type: 'Góp ý về website',
    content: 'Website nên có thêm tính năng so sánh sản phẩm...',
    status: 'replied',
    date: '10/09/2024',
    reply: {
      content: 'Cảm ơn đề xuất của bạn. Chúng tôi sẽ xem xét và cập nhật trong phiên bản tiếp theo.',
      date: '12/09/2024',
      author: 'Trần Thị C - Bộ phận Kỹ thuật'
    }
  },
  {
    id: 3,
    ticketId: 'FB001236',
    title: 'Khiếu nại về thời gian giao hàng',
    type: 'Góp ý về giao hàng',
    content: 'Đơn hàng của tôi giao chậm hơn so với cam kết...',
    status: 'pending',
    date: '08/09/2024',
    reply: null
  }
])

// FAQs
const faqs = ref([
  {
    question: 'Làm thế nào để theo dõi đơn hàng?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và truy cập mục "Lịch sử mua hàng" hoặc sử dụng mã đơn hàng được gửi qua email.'
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ hóa đơn.'
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer: 'Thời gian giao hàng thông thường là 2-3 ngày làm việc trong nội thành và 3-5 ngày làm việc cho các tỉnh thành khác.'
  },
  {
    question: 'Làm sao để liên hệ với bộ phận hỗ trợ?',
    answer: 'Bạn có thể liên hệ qua hotline 1900 1234, email support@phostep.com hoặc sử dụng tính năng live chat trên website.'
  }
])

const filteredFeedbackHistory = computed(() => {
  if (historyFilter.value === 'all') {
    return feedbackHistory.value
  }
  return feedbackHistory.value.filter(feedback => feedback.status === historyFilter.value)
})

const submitFeedback = () => {
  // Handle feedback submission
  console.log('Submitting feedback:', feedbackForm)
  
  // Add to history (simulate)
  const newFeedback = {
    id: Date.now(),
    ticketId: `FB${String(Date.now()).slice(-6)}`,
    title: feedbackForm.title,
    type: getTypeText(feedbackForm.type),
    content: feedbackForm.content,
    status: 'pending',
    date: new Date().toLocaleDateString('vi-VN'),
    reply: null
  }
  
  feedbackHistory.value.unshift(newFeedback)
  
  // Reset form
  Object.keys(feedbackForm).forEach(key => {
    if (key === 'priority') feedbackForm[key] = 'medium'
    else if (key === 'allowContact') feedbackForm[key] = true
    else feedbackForm[key] = ''
  })
  
  // Switch to history tab
  activeTab.value = 'history'
  
  alert('Góp ý của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.')
}

const getTypeText = (type) => {
  const types = {
    'product': 'Góp ý về sản phẩm',
    'service': 'Góp ý về dịch vụ',
    'website': 'Góp ý về website',
    'delivery': 'Góp ý về giao hàng',
    'complaint': 'Khiếu nại',
    'suggestion': 'Đề xuất cải thiện',
    'other': 'Khác'
  }
  return types[type] || type
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'replied': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    'pending': 'Đang xử lý',
    'replied': 'Đã phản hồi',
    'resolved': 'Đã giải quyết'
  }
  return texts[status] || 'Không xác định'
}

const toggleFAQ = (index) => {
  const faqIndex = expandedFAQs.value.indexOf(index)
  if (faqIndex > -1) {
    expandedFAQs.value.splice(faqIndex, 1)
  } else {
    expandedFAQs.value.push(index)
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
