<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Thông tin tài khoản</h1>
            <p class="text-gray-600">Quản lý thông tin cá nhân và sổ địa chỉ của bạn</p>
          </div>
          <div class="hidden md:block">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tab Navigation -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <nav class="flex">
          <button 
            @click="activeTab = 'personal'"
            :class="activeTab === 'personal' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            class="flex-1 py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-200 rounded-t-xl"
          >
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Thông tin cá nhân
            </div>
          </button>
          <button 
            @click="activeTab = 'addresses'"
            :class="activeTab === 'addresses' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
            class="flex-1 py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-200 rounded-t-xl"
          >
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Sổ địa chỉ
            </div>
          </button>
        </nav>
      </div>
      <!-- Personal Information Tab -->
      <div v-if="activeTab === 'personal'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form @submit.prevent="updatePersonalInfo" class="space-y-8">
          <!-- Avatar Section -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 pb-8 border-b border-gray-200">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                <img 
                  :src="personalInfo.avatar || '/default-avatar.png'" 
                  alt="Avatar" 
                  class="w-full h-full rounded-full object-cover bg-white"
                >
              </div>
              <button 
                type="button"
                class="absolute bottom-2 right-2 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 group-hover:scale-110"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            <div class="text-center sm:text-left">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Ảnh đại diện</h3>
              <p class="text-gray-600 mb-4">Tải lên ảnh đại diện của bạn để cá nhân hóa tài khoản</p>
              <div class="flex flex-wrap gap-2 text-sm text-gray-500">
                <span class="bg-gray-100 px-3 py-1 rounded-full">JPG</span>
                <span class="bg-gray-100 px-3 py-1 rounded-full">PNG</span>
                <span class="bg-gray-100 px-3 py-1 rounded-full">Max 5MB</span>
              </div>
            </div>
          </div>
          
          <!-- Personal Info Form -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Họ và tên *</label>
                <input 
                  v-model="personalInfo.fullName"
                  type="text" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Nhập họ và tên đầy đủ"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Email *</label>
                <input 
                  v-model="personalInfo.email"
                  type="email" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="example@email.com"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Số điện thoại *</label>
                <input 
                  v-model="personalInfo.phoneNumber"
                  type="tel" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="0901234567"
                >
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Ngày sinh</label>
                <input 
                  v-model="personalInfo.birthDate"
                  type="date" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Giới tính</label>
                <select 
                  v-model="personalInfo.gender"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Trạng thái tài khoản</label>
                <div class="flex items-center space-x-3">
                  <div class="flex items-center justify-center w-3 h-3 bg-green-500 rounded-full">
                    <div class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                  <span class="text-green-700 font-medium">Đã xác thực</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end pt-8 border-t border-gray-200">
            <button 
              type="submit"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Cập nhật thông tin
              </div>
            </button>
          </div>
        </form>
      </div>
    
      <!-- Address Book Tab -->
      <div v-if="activeTab === 'addresses'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-2">Sổ địa chỉ</h3>
            <p class="text-gray-600">Quản lý địa chỉ giao hàng của bạn</p>
          </div>
          <button 
            @click="showAddAddressModal = true"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Thêm địa chỉ mới
          </button>
        </div>
        
        <!-- Address Carousel -->
        <div v-if="addresses.length > 0" class="relative">
          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentAddressIndex * 100}%)` }"
            >
              <div 
                v-for="(address, index) in addresses" 
                :key="address.id"
                class="w-full flex-shrink-0 px-2"
              >
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-xl font-semibold text-gray-900">{{ address.name }}</h4>
                        <div class="flex items-center mt-1">
                          <span 
                            v-if="address.isDefault"
                            class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold mr-2"
                          >
                            <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Mặc định
                          </span>
                          <span class="text-gray-500 text-sm">Địa chỉ {{ index + 1 }} / {{ addresses.length }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="space-y-3 mb-6">
                    <div class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      {{ address.phoneNumber }}
                    </div>
                    <div class="flex items-start text-gray-700">
                      <svg class="w-5 h-5 mr-3 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span class="leading-relaxed">{{ address.fullAddress }}</span>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap gap-3">
                    <button 
                      @click="editAddress(address)"
                      class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Sửa
                    </button>
                    <button 
                      v-if="!address.isDefault"
                      @click="setDefaultAddress(address.id)"
                      class="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Đặt mặc định
                    </button>
                    <button 
                      v-if="!address.isDefault"
                      @click="deleteAddress(address.id)"
                      class="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Navigation -->
          <div class="flex justify-between items-center mt-6">
            <!-- Previous Button -->
            <button 
              @click="previousAddress"
              :disabled="currentAddressIndex === 0"
              :class="currentAddressIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
              class="p-3 rounded-full border border-gray-300 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <!-- Dots Indicator -->
            <div class="flex space-x-2">
              <button
                v-for="(address, index) in addresses"
                :key="index"
                @click="currentAddressIndex = index"
                :class="index === currentAddressIndex ? 'bg-blue-600' : 'bg-gray-300'"
                class="w-3 h-3 rounded-full transition-colors"
              ></button>
            </div>
            
            <!-- Next Button -->
            <button 
              @click="nextAddress"
              :disabled="currentAddressIndex === addresses.length - 1"
              :class="currentAddressIndex === addresses.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
              class="p-3 rounded-full border border-gray-300 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Chưa có địa chỉ nào</h3>
          <p class="text-gray-600 mb-6">Thêm địa chỉ để việc đặt hàng trở nên thuận tiện hơn</p>
          <button 
            @click="showAddAddressModal = true"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      </div>
      
      <!-- Add/Edit Address Modal -->
      <div 
        v-if="showAddAddressModal || editingAddress"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeAddressModal"
      >
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-semibold text-gray-900">
              {{ editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới' }}
            </h3>
            <button 
              @click="closeAddressModal"
              class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveAddress" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Tên người nhận *</label>
              <input 
                v-model="addressForm.name"
                type="text" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Nhập tên người nhận"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Số điện thoại *</label>
              <input 
                v-model="addressForm.phoneNumber"
                type="tel" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Nhập số điện thoại"
              >
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Địa chỉ chi tiết *</label>
              <textarea 
                v-model="addressForm.fullAddress"
                required
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
              ></textarea>
            </div>
            
            <div class="flex items-center p-4 bg-blue-50 rounded-xl">
              <input 
                v-model="addressForm.isDefault"
                type="checkbox" 
                id="isDefault"
                class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="isDefault" class="ml-3 block text-sm font-medium text-gray-700">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="closeAddressModal"
                class="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button 
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {{ editingAddress ? 'Cập nhật' : 'Thêm địa chỉ' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('personal')
const showAddAddressModal = ref(false)
const editingAddress = ref(null)
const currentAddressIndex = ref(0)

// Personal Information
const personalInfo = reactive({
  fullName: 'Nguyễn Văn A',
  email: 'user@example.com',
  phoneNumber: '0901234567',
  birthDate: '1990-01-01',
  gender: 'male',
  avatar: null
})

// Addresses with more sample data
const addresses = ref([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phoneNumber: '0901234567',
    fullAddress: '123 Nguyễn Văn Linh, Phường Tân Thuận Đông, Quận 7, TP.HCM',
    isDefault: true
  },
  {
    id: 2,
    name: 'Nguyễn Văn A (Công ty)',
    phoneNumber: '0901234567',
    fullAddress: '456 Lê Văn Việt, Phường Tăng Nhơn Phú A, Quận 9, TP.HCM',
    isDefault: false
  },
  {
    id: 3,
    name: 'Nguyễn Văn A (Nhà bố mẹ)',
    phoneNumber: '0987654321',
    fullAddress: '789 Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM',
    isDefault: false
  }
])

// Address Form
const addressForm = reactive({
  name: '',
  phoneNumber: '',
  fullAddress: '',
  isDefault: false
})

// Carousel Navigation Functions
const nextAddress = () => {
  if (currentAddressIndex.value < addresses.value.length - 1) {
    currentAddressIndex.value++
  }
}

const previousAddress = () => {
  if (currentAddressIndex.value > 0) {
    currentAddressIndex.value--
  }
}

const updatePersonalInfo = () => {
  // Handle personal info update
  console.log('Updating personal info:', personalInfo)
  // Show success message
  alert('Thông tin cá nhân đã được cập nhật thành công!')
}

const editAddress = (address) => {
  editingAddress.value = address
  addressForm.name = address.name
  addressForm.phoneNumber = address.phoneNumber
  addressForm.fullAddress = address.fullAddress
  addressForm.isDefault = address.isDefault
}

const closeAddressModal = () => {
  showAddAddressModal.value = false
  editingAddress.value = null
  // Reset form
  addressForm.name = ''
  addressForm.phoneNumber = ''
  addressForm.fullAddress = ''
  addressForm.isDefault = false
}

const saveAddress = () => {
  if (editingAddress.value) {
    // Update existing address
    const index = addresses.value.findIndex(addr => addr.id === editingAddress.value.id)
    if (index !== -1) {
      addresses.value[index] = {
        ...editingAddress.value,
        name: addressForm.name,
        phoneNumber: addressForm.phoneNumber,
        fullAddress: addressForm.fullAddress,
        isDefault: addressForm.isDefault
      }
      
      // If setting as default, remove default from others
      if (addressForm.isDefault) {
        addresses.value.forEach(addr => {
          if (addr.id !== editingAddress.value.id) {
            addr.isDefault = false
          }
        })
      }
    }
  } else {
    // Add new address
    const newAddress = {
      id: Date.now(),
      name: addressForm.name,
      phoneNumber: addressForm.phoneNumber,
      fullAddress: addressForm.fullAddress,
      isDefault: addressForm.isDefault
    }
    
    // If setting as default, remove default from others
    if (addressForm.isDefault) {
      addresses.value.forEach(addr => {
        addr.isDefault = false
      })
    }
    
    addresses.value.push(newAddress)
  }
  
  closeAddressModal()
  alert('Địa chỉ đã được lưu thành công!')
}

const setDefaultAddress = (addressId) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === addressId
  })
  alert('Đã đặt làm địa chỉ mặc định!')
}

const deleteAddress = (addressId) => {
  if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    const index = addresses.value.findIndex(addr => addr.id === addressId)
    if (index !== -1) {
      addresses.value.splice(index, 1)
      alert('Địa chỉ đã được xóa!')
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
