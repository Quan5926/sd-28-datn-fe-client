import { ref, reactive, computed } from 'vue'
import { checkoutService } from '@/services/checkoutAPI'
import { vnpayService } from '@/services/vnpayAPI'
import { useCart } from '@/composables/useCart'

// Global checkout state
const checkoutState = reactive({
  loading: false,
  error: null,
  currentStep: 1,
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },
  paymentMethod: 'COD',
  shippingFee: 30000, // Default 30k VND
  discount: 0,
  voucherId: null,
  notes: ''
})

export function useCheckout() {
  const loading = ref(false)
  const error = ref(null)
  const { cart, totalAmount, clearCart } = useCart()

  // Computed properties
  const finalTotal = computed(() => {
    return (totalAmount.value || 0) + checkoutState.shippingFee - checkoutState.discount
  })

  // Update customer info
  const updateCustomerInfo = (customerInfo) => {
    Object.assign(checkoutState.customerInfo, customerInfo)
  }

  // Update payment method
  const updatePaymentMethod = (method) => {
    checkoutState.paymentMethod = method
  }

  // Apply voucher
  const applyVoucher = (voucherId, discountAmount) => {
    checkoutState.voucherId = voucherId
    checkoutState.discount = discountAmount
  }

  // Remove voucher
  const removeVoucher = () => {
    checkoutState.voucherId = null
    checkoutState.discount = 0
  }

  // Update shipping fee
  const updateShippingFee = (fee) => {
    checkoutState.shippingFee = fee
  }

  // Update notes
  const updateNotes = (notes) => {
    checkoutState.notes = notes
  }

  // Go to next step
  const nextStep = () => {
    if (checkoutState.currentStep < 3) {
      checkoutState.currentStep++
    }
  }

  // Go to previous step
  const previousStep = () => {
    if (checkoutState.currentStep > 1) {
      checkoutState.currentStep--
    }
  }

  // Set specific step
  const setStep = (step) => {
    if (step >= 1 && step <= 3) {
      checkoutState.currentStep = step
    }
  }

  // Process checkout
  const processCheckout = async () => {
    try {
      loading.value = true
      error.value = null
      checkoutState.loading = true
      checkoutState.error = null

      // Validate checkout data
      const validation = checkoutService.validateCheckoutData(checkoutState)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      console.log('Processing checkout with state:', checkoutState)

      const checkoutData = {
        customerInfo: checkoutState.customerInfo,
        paymentMethod: checkoutState.paymentMethod,
        shippingFee: checkoutState.shippingFee,
        discount: checkoutState.discount,
        voucherId: checkoutState.voucherId,
        notes: checkoutState.notes
      }

      // Handle different payment methods
      if (checkoutState.paymentMethod === 'VNPAY') {
        // For VNPay, create payment URL and redirect
        const vnpayResult = await vnpayService.createVNPayPayment(checkoutData)
        console.log('VNPay payment initiated:', vnpayResult)
        return vnpayResult
      } else {
        // For COD, process normally
        const orderResult = await checkoutService.processCheckout(checkoutData)
        console.log('COD checkout completed:', orderResult)

        // Clear cart after successful checkout
        await clearCart()

        // Reset checkout state
        resetCheckout()

        return orderResult
      }
    } catch (err) {
      error.value = err.message
      checkoutState.error = err.message
      console.error('Error processing checkout:', err)
      throw err
    } finally {
      loading.value = false
      checkoutState.loading = false
    }
  }

  // Reset checkout state
  const resetCheckout = () => {
    checkoutState.currentStep = 1
    checkoutState.customerInfo = {
      name: '',
      phone: '',
      email: '',
      address: ''
    }
    checkoutState.paymentMethod = 'COD'
    checkoutState.shippingFee = 30000
    checkoutState.discount = 0
    checkoutState.voucherId = null
    checkoutState.notes = ''
    checkoutState.error = null
  }

  // Get current invoice ID
  const getCurrentInvoiceId = () => {
    return checkoutService.getCurrentInvoiceId()
  }

  // Handle VNPay return
  const handleVNPayReturn = (urlParams) => {
    return vnpayService.handleVNPayReturn(urlParams)
  }

  // Check VNPay payment status
  const checkVNPayStatus = async (invoiceId) => {
    try {
      return await vnpayService.checkPaymentStatus(invoiceId)
    } catch (error) {
      console.error('Error checking VNPay status:', error)
      throw error
    }
  }

  return {
    // State
    checkoutState,
    loading,
    error,
    finalTotal,

    // Customer info
    updateCustomerInfo,

    // Payment
    updatePaymentMethod,

    // Voucher
    applyVoucher,
    removeVoucher,

    // Shipping
    updateShippingFee,

    // Notes
    updateNotes,

    // Steps
    nextStep,
    previousStep,
    setStep,

    // Checkout
    processCheckout,
    resetCheckout,
    getCurrentInvoiceId,

    // VNPay
    handleVNPayReturn,
    checkVNPayStatus
  }
}
