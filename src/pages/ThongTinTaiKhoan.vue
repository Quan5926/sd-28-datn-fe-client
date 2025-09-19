<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
    <div class="container mx-auto px-4 py-12">
      <!-- Page Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-4 mb-6">
          <div class="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <span class="text-sm font-semibold text-blue-600 uppercase tracking-wider">Tài khoản</span>
          <div class="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-josefin-sans">
          Thông tin tài khoản
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Quản lý thông tin cá nhân và địa chỉ giao hàng của bạn một cách dễ dàng và an toàn
        </p>
      </div>
      

      <!-- Authentication Required Message -->
      <div v-if="!customerAPI.isAuthenticated()" class="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8 text-center">
        <div class="flex flex-col items-center">
          <svg class="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-blue-900 mb-2">Cần đăng nhập</h3>
          <p class="text-blue-700 mb-4">Bạn cần đăng nhập để xem thông tin tài khoản và quản lý địa chỉ.</p>
          <router-link to="/auth" class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
            Đăng nhập ngay
          </router-link>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error && customerAPI.isAuthenticated()" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Đang tải thông tin...</span>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div v-else-if="customerAPI.isAuthenticated()" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-12 overflow-hidden">
        <nav class="flex">
          <button 
            @click="activeTab = 'personal'"
            :class="activeTab === 'personal' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'"
            class="flex-1 py-6 px-8 font-semibold text-base transition-all duration-300 transform hover:scale-105"
          >
            <div class="flex items-center justify-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Thông tin cá nhân
            </div>
          </button>
          <button 
            @click="activeTab = 'addresses'"
            :class="activeTab === 'addresses' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'"
            class="flex-1 py-6 px-8 font-semibold text-base transition-all duration-300 transform hover:scale-105"
          >
            <div class="flex items-center justify-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Sổ địa chỉ
            </div>
          </button>
        </nav>
      </div>
      <!-- Personal Information Tab -->
      <div v-if="activeTab === 'personal' && customerAPI.isAuthenticated()" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-10">
        <form @submit.prevent="updatePersonalInfo" class="space-y-8">
          <!-- Avatar Section -->
          <div class="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-8 border border-blue-100/50">
            <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
              <div class="relative group">
                <div class="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
                  <img 
                    :src="currentAvatarUrl" 
                    alt="Avatar" 
                    class="w-full h-full rounded-full object-cover bg-white"
                  >
                </div>
                <button 
                  type="button"
                  @click="showAvatarSelector = true"
                  class="absolute bottom-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white group-hover:scale-110 transform"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </button>
              </div>
              <div class="text-center sm:text-left flex-1">
                <div class="flex items-center mb-3">
                  <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h3 class="text-2xl font-bold text-gray-900">Ảnh đại diện</h3>
                </div>
                <p class="text-lg text-gray-600 mb-6">Chọn một avatar phù hợp để cá nhân hóa tài khoản của bạn</p>
                <div class="flex flex-wrap gap-3">
                  <span class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 border border-blue-200">DiceBear</span>
                  <span class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 border border-purple-200">SVG</span>
                  <span class="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold text-green-700 border border-green-200">Đa dạng</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Avatar Selector Modal -->
          <div 
            v-if="showAvatarSelector"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="showAvatarSelector = false"
          >
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <!-- Header -->
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h3 class="text-3xl font-bold text-gray-900 mb-2">Chọn Avatar</h3>
                  <p class="text-gray-600">Chọn một avatar phù hợp với phong cách của bạn</p>
                </div>
                <button 
                  @click="showAvatarSelector = false"
                  class="text-gray-400 hover:text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Avatar Styles -->
              <div class="mb-8">
                <h4 class="text-xl font-semibold text-gray-900 mb-4">Chọn phong cách</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <button
                    v-for="style in avatarStyles"
                    :key="style.name"
                    @click="selectedStyle = style.name"
                    :class="selectedStyle === style.name ? 'ring-4 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'"
                    class="p-4 rounded-xl border-2 border-gray-200 transition-all duration-200 transform hover:scale-105"
                  >
                    <img 
                      :src="getAvatarUrl(style.name, 'preview')" 
                      :alt="style.label"
                      class="w-16 h-16 rounded-full mx-auto mb-2"
                    >
                    <p class="text-sm font-semibold text-gray-700">{{ style.label }}</p>
                  </button>
                </div>
              </div>

              <!-- Avatar Grid -->
              <div class="mb-8">
                <h4 class="text-xl font-semibold text-gray-900 mb-4">Chọn avatar</h4>
                <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                  <button
                    v-for="seed in avatarSeeds"
                    :key="seed"
                    @click="selectAvatar(selectedStyle, seed)"
                    :class="personalInfo.avatar === getAvatarUrl(selectedStyle, seed) ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'"
                    class="p-2 rounded-xl border border-gray-200 transition-all duration-200 transform hover:scale-110"
                  >
                    <img 
                      :src="getAvatarUrl(selectedStyle, seed)" 
                      :alt="seed"
                      class="w-full aspect-square rounded-lg"
                    >
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-200 pt-6">
                <button 
                  @click="showAvatarSelector = false"
                  class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button 
                  @click="confirmAvatarSelection"
                  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
          
          <!-- Personal Info Form -->
          <div class="space-y-8">
            <!-- Thông tin cơ bản -->
            <div class="bg-gray-50/50 rounded-2xl p-8">
              <h4 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg class="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Thông tin cơ bản
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Họ và tên *
                    </label>
                    <input 
                      v-model="personalInfo.fullName"
                      type="text" 
                      required
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="Nhập họ và tên đầy đủ"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email *
                    </label>
                    <input 
                      v-model="personalInfo.email"
                      type="email" 
                      required
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="example@email.com"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Số điện thoại *
                    </label>
                    <input 
                      v-model="personalInfo.phoneNumber"
                      type="tel" 
                      required
                      pattern="[0-9]{10,11}"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="0901234567"
                    >
                  </div>
                </div>
                
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2v-6a2 2 0 00-2-2"></path>
                      </svg>
                      Ngày sinh
                    </label>
                    <input 
                      v-model="personalInfo.birthDate"
                      type="date" 
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                      Giới tính
                    </label>
                    <select 
                      v-model="personalInfo.gender"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Số CCCD/CMND
                    </label>
                    <input 
                      v-model="personalInfo.cccd"
                      type="text" 
                      maxlength="12"
                      pattern="[0-9]*"
                      @input="validateCCCD"
                      class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                      placeholder="Nhập số CCCD/CMND"
                    >
                    <p class="text-xs text-gray-500 mt-2 flex items-center">
                      <svg class="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Nhập 9-12 số của CCCD hoặc CMND
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trạng thái tài khoản -->
            <div class="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-8 border border-green-100/50">
              <h4 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg class="w-7 h-7 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Trạng thái tài khoản
              </h4>
              <div class="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200/50">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h5 class="text-lg font-semibold text-gray-900">Tài khoản đã xác thực</h5>
                    <p class="text-sm text-gray-600">Tài khoản của bạn đã được xác minh và hoạt động bình thường</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Hoạt động
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t-2 border-gray-100">
            <button 
              type="button"
              class="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Khôi phục
              </div>
            </button>
            <button 
              type="submit"
              :disabled="loading"
              class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div class="flex items-center justify-center">
                <span v-if="loading">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang cập nhật...
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Cập nhật thông tin
                </span>
              </div>
            </button>
          </div>
        </form>
      </div>
    
      <!-- Address Book Tab -->
      <div v-if="activeTab === 'addresses' && customerAPI.isAuthenticated()" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-10">
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
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeAddressModal"
      >
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex justify-between items-center mb-8">
            <div>
              <h3 class="text-3xl font-bold text-gray-900 mb-2">
                {{ editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới' }}
              </h3>
              <p class="text-gray-600">Vui lòng điền đầy đủ thông tin để giao hàng chính xác</p>
            </div>
            <button 
              @click="closeAddressModal"
              class="text-gray-400 hover:text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveAddress" class="space-y-6">
            <!-- Thông tin người nhận -->
            <div class="bg-gray-50/50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Thông tin người nhận
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Họ và tên *</label>
                  <input 
                    v-model="addressForm.tenNguoiNhan"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="Nhập họ và tên người nhận"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Số điện thoại *</label>
                  <input 
                    v-model="addressForm.soDienThoai"
                    type="tel" 
                    required
                    pattern="[0-9]{10,11}"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="Nhập số điện thoại (10-11 số)"
                  >
                </div>
              </div>
            </div>

            <!-- Địa chỉ -->
            <div class="bg-gray-50/50 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Địa chỉ giao hàng
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Tỉnh/Thành phố *</label>
                  <input 
                    v-model="addressForm.thanhPho"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="VD: Hồ Chí Minh"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Quận/Huyện *</label>
                  <input 
                    v-model="addressForm.quan"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="VD: Quận 1"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Phường/Xã *</label>
                  <input 
                    v-model="addressForm.phuong"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white"
                    placeholder="VD: Phường Bến Nghé"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Địa chỉ cụ thể *</label>
                <textarea 
                  v-model="addressForm.diaChiCuThe"
                  required
                  rows="3"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white resize-none"
                  placeholder="Số nhà, tên đường, hẻm... (VD: 123 Nguyễn Huệ, Hẻm 45)"
                ></textarea>
              </div>
            </div>

            <!-- Tùy chọn -->
            <div class="bg-gray-50/50 rounded-xl p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input 
                    v-model="addressForm.macDinh"
                    type="checkbox" 
                    id="defaultAddress"
                    class="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-4"
                  >
                  <label for="defaultAddress" class="ml-3 text-sm font-semibold text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
                <div class="text-xs text-gray-500">
                  Địa chỉ mặc định sẽ được chọn tự động khi đặt hàng
                </div>
              </div>
            </div>
            
            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="closeAddressModal"
                class="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                :disabled="loading"
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </span>
                <span v-else>
                  {{ editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <NotificationToast
    v-if="showToast"
    :message="toastMessage"
    :type="toastType"
    :title="toastType === 'success' ? 'Thành công' : 'Thông báo'"
    @close="closeToast"
  />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { customerAPI } from '@/api/customerAPI'
import NotificationToast from '@/components/NotificationToast.vue'
import { useAvatar } from '@/composables/useAvatar.js'

const activeTab = ref('personal')
const showAddAddressModal = ref(false)
const editingAddress = ref(null)
const currentAddressIndex = ref(0)
const loading = ref(false)
const error = ref('')

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Show notification function
const showNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Avatar Selection using composable
const { 
  getAvatarUrl, 
  getCurrentAvatarUrl, 
  saveAvatar, 
  avatarUrl,
  avatarStyles,
  avatarSeeds 
} = useAvatar()

const showAvatarSelector = ref(false)
const selectedStyle = ref('avataaars')
const selectedAvatar = ref('')

// Personal Information
const personalInfo = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
  avatar: '',
  cccd: '',
  customerCode: ''
})

// Addresses
const addresses = ref([])

// Address Form
const addressForm = reactive({
  tenNguoiNhan: '',
  soDienThoai: '',
  thanhPho: '',
  quan: '',
  phuong: '',
  diaChiCuThe: '',
  macDinh: false
})

// Computed property for current avatar URL
const currentAvatarUrl = computed(() => {
  return personalInfo.avatar || avatarUrl.value || getAvatarUrl('avataaars', 'default')
})

const selectAvatar = (style, seed) => {
  selectedAvatar.value = getAvatarUrl(style, seed)
}

const confirmAvatarSelection = () => {
  if (selectedAvatar.value) {
    personalInfo.avatar = selectedAvatar.value
    // Use composable to save avatar
    saveAvatar(selectedAvatar.value)
    
    // Show success toast
    toastMessage.value = 'Avatar đã được cập nhật thành công!'
    toastType.value = 'success'
    showToast.value = true
  }
  showAvatarSelector.value = false
}

// Toast close handler
const closeToast = () => {
  showToast.value = false
}

// Load customer profile data
const loadCustomerProfile = async () => {
  try {
    loading.value = true
    const response = await customerAPI.getProfile()
    
    if (response.success) {
      const profile = response.data
      personalInfo.fullName = profile.ten || ''
      personalInfo.email = profile.email || ''
      personalInfo.phoneNumber = profile.soDienThoai || ''
      personalInfo.birthDate = profile.ngaySinh || ''
      personalInfo.gender = profile.gioiTinh === 1 ? 'male' : profile.gioiTinh === 0 ? 'female' : ''
      personalInfo.cccd = profile.cccd || ''
      personalInfo.customerCode = profile.ma || ''
      
      // Load avatar from composable
      personalInfo.avatar = getCurrentAvatarUrl()
    } else {
      error.value = response.message || 'Không thể tải thông tin khách hàng'
    }
  } catch (err) {
    error.value = 'Không thể tải thông tin khách hàng: ' + err.message
    console.error('Error loading customer profile:', err)
  } finally {
    loading.value = false
  }
}

// Load customer addresses
const loadCustomerAddresses = async () => {
  try {
    const response = await customerAPI.getAddresses()
    
    if (response.success) {
      addresses.value = response.data.map(addr => ({
        id: addr.id,
        name: addr.tenKhachHang,
        phoneNumber: addr.soDienThoai,
        fullAddress: `${addr.diaChiCuThe}, ${addr.phuong}, ${addr.quan}, ${addr.thanhPho}`,
        isDefault: addr.macDinh,
        thanhPho: addr.thanhPho,
        quan: addr.quan,
        phuong: addr.phuong,
        diaChiCuThe: addr.diaChiCuThe
      }))
    } else {
      error.value = response.message || 'Không thể tải danh sách địa chỉ'
    }
  } catch (err) {
    error.value = 'Không thể tải danh sách địa chỉ: ' + err.message
    console.error('Error loading addresses:', err)
  }
}


// Initialize data
onMounted(async () => {
  try {
    error.value = '' // Clear any previous errors
    
    // Check if user is authenticated
    if (!customerAPI.isAuthenticated()) {
      error.value = 'Bạn cần đăng nhập để xem thông tin tài khoản'
      return
    }
    
    // Load customer data
    await Promise.all([
      loadCustomerProfile(),
      loadCustomerAddresses()
    ])
  } catch (err) {
    console.error('Error initializing customer data:', err)
    error.value = 'Có lỗi xảy ra khi tải dữ liệu: ' + err.message
  }
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

// Validate CCCD input - only allow numbers
const validateCCCD = (event) => {
  const value = event.target.value
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  // Update the model with cleaned value
  personalInfo.cccd = numericValue
}

const updatePersonalInfo = async () => {
  try {
    loading.value = true
    
    // Validate CCCD length if provided
    if (personalInfo.cccd && (personalInfo.cccd.length < 9 || personalInfo.cccd.length > 12)) {
      showNotification('Số CCCD/CMND phải có từ 9-12 chữ số', 'error')
      return
    }
    
    // TODO: Implement profile update API call
    console.log('Updating personal info:', personalInfo)
    
    // Show success notification
    showNotification('Thông tin cá nhân đã được cập nhật thành công!', 'success')
  } catch (err) {
    showNotification('Không thể cập nhật thông tin: ' + err.message, 'error')
    console.error('Error updating profile:', err)
  } finally {
    loading.value = false
  }
}

const editAddress = (address) => {
  editingAddress.value = address
  addressForm.tenNguoiNhan = address.name
  addressForm.soDienThoai = address.phoneNumber
  addressForm.thanhPho = address.thanhPho
  addressForm.quan = address.quan
  addressForm.phuong = address.phuong
  addressForm.diaChiCuThe = address.diaChiCuThe
  addressForm.macDinh = address.isDefault
}

const closeAddressModal = () => {
  showAddAddressModal.value = false
  editingAddress.value = null
  // Reset form
  addressForm.tenNguoiNhan = ''
  addressForm.soDienThoai = ''
  addressForm.thanhPho = ''
  addressForm.quan = ''
  addressForm.phuong = ''
  addressForm.diaChiCuThe = ''
  addressForm.macDinh = false
}

const saveAddress = async () => {
  try {
    loading.value = true
    
    if (editingAddress.value) {
      // Update existing address
      const response = await customerAPI.updateAddress(editingAddress.value.id, addressForm)
      if (response.success) {
        await loadCustomerAddresses()
        closeAddressModal()
        showNotification('Địa chỉ đã được cập nhật thành công!', 'success')
      } else {
        showNotification('Không thể cập nhật địa chỉ. Vui lòng thử lại!', 'error')
      }
    } else {
      // Add new address
      const response = await customerAPI.addAddress(addressForm)
      if (response.success) {
        await loadCustomerAddresses()
        closeAddressModal()
        showNotification('Địa chỉ đã được thêm thành công!', 'success')
      } else {
        showNotification('Không thể thêm địa chỉ. Vui lòng thử lại!', 'error')
      }
    }
  } catch (err) {
    error.value = 'Không thể lưu địa chỉ: ' + err.message
    showNotification('Có lỗi xảy ra khi lưu địa chỉ: ' + err.message, 'error')
    console.error('Error saving address:', err)
  } finally {
    loading.value = false
  }
}

const setDefaultAddress = async (addressId) => {
  try {
    const response = await customerAPI.setDefaultAddress(addressId)
    if (response.success) {
      await loadCustomerAddresses()
      showNotification('Đã đặt làm địa chỉ mặc định!', 'success')
    } else {
      showNotification('Không thể đặt địa chỉ mặc định. Vui lòng thử lại!', 'error')
    }
  } catch (err) {
    error.value = 'Không thể đặt địa chỉ mặc định: ' + err.message
    showNotification('Có lỗi xảy ra khi đặt địa chỉ mặc định: ' + err.message, 'error')
    console.error('Error setting default address:', err)
  }
}

const deleteAddress = async (addressId) => {
  if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
    try {
      const response = await customerAPI.deleteAddress(addressId)
      if (response.success) {
        await loadCustomerAddresses()
        showNotification('Địa chỉ đã được xóa thành công!', 'success')
        
        // Adjust carousel index if needed
        if (currentAddressIndex.value >= addresses.value.length && addresses.value.length > 0) {
          currentAddressIndex.value = addresses.value.length - 1
        }
      } else {
        showNotification('Không thể xóa địa chỉ. Vui lòng thử lại!', 'error')
      }
    } catch (err) {
      error.value = 'Không thể xóa địa chỉ: ' + err.message
      showNotification('Có lỗi xảy ra khi xóa địa chỉ: ' + err.message, 'error')
      console.error('Error deleting address:', err)
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
