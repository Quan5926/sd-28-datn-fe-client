<template>
  <div class="auth-container">
    <!-- Background with overlay -->
    <!-- <div class="background-overlay"></div> -->
    
    <div class="auth-wrapper" :class="{ 'register-mode': isRegisterMode }">
      <!-- Brand Section -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-container">
            <img src="/Pho-Step_logo.png" alt="PhoStep Logo" class="logo-image">
          </div>
          <p class="brand-tagline">Hệ thống mua sắm giày sneaker</p>
          <div class="brand-features">
            <div class="feature-item">
              <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
              <span>Sản phẩm chính hãng 100%</span>
            </div>
            <div class="feature-item">
              <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
              <span>Giao hàng nhanh chóng</span>
            </div>
            <div class="feature-item">
              <iconify-icon icon="solar:check-circle-bold"></iconify-icon>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <!-- Toggle Switch -->
        <div class="form-toggle-switch">
          <div class="toggle-container">
            <button 
              class="toggle-btn" 
              :class="{ 'active': !isRegisterMode }"
              @click="showLogin"
            >
              Đăng nhập
            </button>
            <button 
              class="toggle-btn" 
              :class="{ 'active': isRegisterMode }"
              @click="showRegister"
            >
              Đăng ký
            </button>
            <div class="toggle-slider" :class="{ 'register': isRegisterMode }"></div>
          </div>
        </div>

        <!-- Login Form -->
        <div class="form-container login-form" :class="{ 'hidden': isRegisterMode }">
          <div class="form-header">
            <h2 class="form-title">Chào mừng trở lại!</h2>
            <p class="form-subtitle">Đăng nhập vào tài khoản PhoStep của bạn</p>
          </div>

          <form @submit.prevent="handleSignIn" class="auth-form">
            <!-- Username Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:user-bold-duotone"></iconify-icon>
                Tên đăng nhập
              </label>
              <input
                type="text"
                v-model="signInForm.username"
                class="form-input"
                :class="{ 'error': errors.loginUsername }"
                placeholder="Nhập tên đăng nhập của bạn"
                required
              />
              <span v-if="errors.loginUsername" class="error-message">{{ errors.loginUsername }}</span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:lock-password-bold-duotone"></iconify-icon>
                Mật khẩu
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showLoginPassword ? 'text' : 'password'"
                  v-model="signInForm.password"
                  class="form-input password-input"
                  :class="{ 'error': errors.loginPassword }"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="toggleLoginPassword"
                >
                  <iconify-icon :icon="showLoginPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'"></iconify-icon>
                </button>
              </div>
              <span v-if="errors.loginPassword" class="error-message">{{ errors.loginPassword }}</span>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="signInForm.rememberMe" class="checkbox-input" />
                <span class="checkbox-label">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
                Quên mật khẩu?
              </a>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="auth-btn"
              :disabled="isLoading"
              :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>

            <!-- Error Message -->
            <div v-if="loginError" class="auth-error">
              <iconify-icon icon="solar:danger-circle-bold-duotone"></iconify-icon>
              {{ loginError }}
            </div>
          </form>
        </div>

        <!-- Register Form -->
        <div class="form-container register-form" :class="{ 'hidden': !isRegisterMode }">
          <div class="form-header">
            <h2 class="form-title">Tạo tài khoản mới</h2>
            <p class="form-subtitle">Đăng ký để trở thành thành viên PhoStep</p>
          </div>

          <form @submit.prevent="handleSignUp" class="auth-form">
            <!-- Name Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:user-bold-duotone"></iconify-icon>
                Họ và tên
              </label>
              <input
                type="text"
                v-model="signUpForm.name"
                class="form-input"
                :class="{ 'error': errors.name }"
                placeholder="Nhập họ và tên của bạn"
                required
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:letter-bold-duotone"></iconify-icon>
                Email
              </label>
              <input
                type="email"
                v-model="signUpForm.email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="Nhập email của bạn"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <!-- Phone Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:phone-bold-duotone"></iconify-icon>
                Số điện thoại
              </label>
              <input
                type="tel"
                v-model="signUpForm.phoneNumber"
                class="form-input"
                :class="{ 'error': errors.phoneNumber }"
                placeholder="Nhập số điện thoại"
                required
              />
              <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:lock-password-bold-duotone"></iconify-icon>
                Mật khẩu
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showRegPassword ? 'text' : 'password'"
                  v-model="signUpForm.password"
                  class="form-input password-input"
                  :class="{ 'error': errors.password }"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="toggleRegPassword"
                >
                  <iconify-icon :icon="showRegPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'"></iconify-icon>
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label class="form-label">
                <iconify-icon icon="solar:lock-password-bold-duotone"></iconify-icon>
                Xác nhận mật khẩu
              </label>
              <div class="password-input-wrapper">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="signUpForm.confirmPassword"
                  class="form-input password-input"
                  :class="{ 'error': errors.confirmPassword }"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="toggleConfirmPassword"
                >
                  <iconify-icon :icon="showConfirmPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'"></iconify-icon>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              class="auth-btn"
              :disabled="isLoading"
              :class="{ 'loading': isLoading }"
            >
              {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản' }}
            </button>

            <!-- Error Message -->
            <div v-if="registerError" class="auth-error">
              <iconify-icon icon="solar:danger-circle-bold-duotone"></iconify-icon>
              {{ registerError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService.js';
import { useNotification } from '../composables/useNotification.js';

const router = useRouter();
const { success, error } = useNotification();

// State management
const isRegisterMode = ref(false);
const isLoading = ref(false);
const errors = ref({});
const loginError = ref('');
const registerError = ref('');

// Password visibility states
const showLoginPassword = ref(false);
const showRegPassword = ref(false);
const showConfirmPassword = ref(false);

// Form data for Sign Up
const signUpForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
});

// Form data for Sign In
const signInForm = ref({
  username: '',
  password: '',
  rememberMe: false
});

// Toggle functions
const showLogin = () => {
  isRegisterMode.value = false;
  clearErrors();
};

const showRegister = () => {
  isRegisterMode.value = true;
  clearErrors();
};

// Password toggle functions
const toggleLoginPassword = () => {
  showLoginPassword.value = !showLoginPassword.value;
};

const toggleRegPassword = () => {
  showRegPassword.value = !showRegPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Clear errors
const clearErrors = () => {
  errors.value = {};
  loginError.value = '';
  registerError.value = '';
};

// Validation functions
const validateSignUp = () => {
  errors.value = {};
  
  if (!signUpForm.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
  }
  
  if (!signUpForm.value.email.trim()) {
    errors.value.email = 'Vui lòng nhập email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.value.email)) {
    errors.value.email = 'Email không hợp lệ';
  }
  
  if (!signUpForm.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'Vui lòng nhập số điện thoại';
  } else if (!/^[0-9]{10,11}$/.test(signUpForm.value.phoneNumber.replace(/\s/g, ''))) {
    errors.value.phoneNumber = 'Số điện thoại không hợp lệ';
  }
  
  if (!signUpForm.value.password.trim()) {
    errors.value.password = 'Vui lòng nhập mật khẩu';
  } else if (signUpForm.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  if (!signUpForm.value.confirmPassword.trim()) {
    errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (signUpForm.value.password !== signUpForm.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return Object.keys(errors.value).length === 0;
};

const validateSignIn = () => {
  errors.value = {};
  
  if (!signInForm.value.username.trim()) {
    errors.value.loginUsername = 'Vui lòng nhập tên đăng nhập';
  }
  
  if (!signInForm.value.password.trim()) {
    errors.value.loginPassword = 'Vui lòng nhập mật khẩu';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Handle Sign Up
const handleSignUp = async () => {
  if (!validateSignUp()) {
    return;
  }

  isLoading.value = true;
  registerError.value = '';

  try {
    const result = await authService.register({
      name: signUpForm.value.name,
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      phoneNumber: signUpForm.value.phoneNumber,
    });
    
    console.log('Sign Up Success:', result);
    success('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
    
    // Switch to login form after successful registration
    showLogin();
    
    // Clear registration form
    signUpForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    };
    
  } catch (error) {
    console.error('Sign Up Error:', error);
    registerError.value = error.message || 'Đăng ký thất bại! Vui lòng thử lại sau';
  } finally {
    isLoading.value = false;
  }
};

// Handle Sign In
const handleSignIn = async () => {
  if (!validateSignIn()) {
    return;
  }

  isLoading.value = true;
  loginError.value = '';

  try {
    const result = await authService.login({
      username: signInForm.value.username,
      password: signInForm.value.password,
      rememberMe: signInForm.value.rememberMe
    });
    
    console.log('Sign In Success:', result);
    
    success('Đăng nhập thành công!');
    
    // Redirect to home page after successful login
    setTimeout(() => {
      router.push(authService.getRedirectPath());
    }, 1500);
    
  } catch (error) {
    console.error('Sign In Error:', error);
    loginError.value = error.message || 'Đăng nhập thất bại! Vui lòng thử lại sau';
  } finally {
    isLoading.value = false;
  }
};

// Handle Forgot Password
const handleForgotPassword = () => {
  if (!signInForm.value.username.trim()) {
    errors.value.loginUsername = 'Vui lòng nhập tên đăng nhập để khôi phục mật khẩu';
    return;
  }
  
  success('Link khôi phục mật khẩu đã được gửi đến email của bạn');
};

// Function to show a custom message box
const showMessageBox = (message) => {
  const messageBox = document.createElement('div');
  messageBox.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]';
  messageBox.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
      <p class="text-lg font-semibold mb-4 text-gray-800">${message}</p>
      <button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors" onclick="this.parentNode.parentNode.remove()">OK</button>
    </div>
  `;
  document.body.appendChild(messageBox);
};

// Component mounted
onMounted(() => {
  // Icons are now handled by @iconify/vue component
});

</script>

<style scoped>
/* Main Container */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  /* background-image: url('/PhoStep_Wall.png'); */
  /* background-size: cover;
  background-position: center;
  background-repeat: no-repeat; */
}

/* Background Elements */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.3) 0%, transparent 50%),
    rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

/* Main Wrapper */
.auth-wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* Brand Section */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
}

.brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cg transform='translate(10,20) scale(0.25)'%3E%3Cpath d='M96 288v-48c0-8.8 7.2-16 16-16h16c6.4 0 12.3 3.8 14.9 9.7l10.6 23.8c4.2 9.4 13.6 15.5 23.9 15.5h2.6c14.3 0 26-11.7 26-26v-30.7c0-6 4.9-11 11-11h6.1c2.9 0 5.7 0.9 8.1 2.5l46.4 29.7-18.3 18.3c-4.7 4.7-4.7 12.3 0 17l2.8 2.8c4.7 4.7 12.3 4.7 17 0l23.3-23.3 30.8 20.1-18.3 18.3c-4.7 4.7-4.7 12.3 0 17l2.8 2.8c4.7 4.7 12.3 4.7 17 0l25.3-25.3 52.9 10.6c23.6 4.7 40.5 25.4 40.5 49.4V320H96z'/%3E%3Cpath d='M96 336h320v8c0 13.3-10.7 24-24 24H120c-13.3 0-24-10.7-24-24v-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") center/200px;
  pointer-events: none;
}

.brand-content {
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.logo-image {
  width: 280px;
  height: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.brand-tagline {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 300;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  opacity: 0.9;
}

.feature-item iconify-icon {
  font-size: 1.5rem;
  color: #48bb78;
  flex-shrink: 0;
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: #fafbfc;
  position: relative;
}

/* Toggle Switch */
.form-toggle-switch {
  margin-bottom: 40px;
  width: 100%;
  max-width: 400px;
}

.toggle-container {
  display: flex;
  background: #e2e8f0;
  border-radius: 50px;
  padding: 4px;
  position: relative;
  width: 100%;
}

.toggle-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #718096;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 46px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.toggle-btn.active {
  color: white;
}

.toggle-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 46px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.toggle-slider.register {
  transform: translateX(100%);
}

.form-container {
  width: 100%;
  max-width: 400px;
  transition: all 0.6s ease;
}

.form-container.hidden {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  pointer-events: none;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 0;
  font-weight: 400;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-label iconify-icon {
  font-size: 1.2rem;
  color: #3b82f6;
}

.form-input {
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.form-input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1);
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-input {
  width: 100%;
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s ease;
  padding: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #3b82f6;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 4px;
  font-weight: 500;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.95rem;
  color: #4a5568;
  cursor: pointer;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.forgot-password:hover {
  color: #2563eb;
  text-decoration: underline;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
}

.auth-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.auth-btn.loading {
  pointer-events: none;
}

.auth-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 12px;
  color: #c53030;
  font-size: 0.95rem;
  margin-top: 12px;
  font-weight: 500;
}

.auth-error iconify-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .auth-wrapper {
    max-width: 900px;
  }
  
  .brand-section,
  .form-section {
    padding: 40px 30px;
  }
}

@media (max-width: 768px) {
  .auth-container {
    padding: 20px;
  }
  
  .auth-wrapper {
    flex-direction: column;
    max-width: 500px;
    min-height: auto;
  }
  
  .brand-section {
    padding: 40px 30px 30px;
  }
  
  .form-section {
    padding: 30px 30px 40px;
  }
  
  .form-title {
    font-size: 2rem;
  }
  
  .brand-features {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }
  
  .feature-item {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 15px;
  }
  
  .auth-wrapper {
    border-radius: 20px;
  }
  
  .brand-section,
  .form-section {
    padding: 30px 20px;
  }
  
  .form-container {
    max-width: 100%;
  }
  
  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
  
  .logo-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .brand-features {
    flex-direction: column;
    text-align: center;
  }
}
</style>