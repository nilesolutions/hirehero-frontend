import axios from '@axios'
import { computed, reactive, readonly } from '@vue/composition-api'

const state = reactive({
  subInfo: {},
  isUpdatingPayment: false,
  isUpdatingPlan: false,
  clickedPrice: '',
  plans: [],
  isRetryingPayment: false,
  isRemovingCard: false,
})

const setSubInfo = val => (state.subInfo = val)
const setClickedPrice = val => (state.clickedPrice = val)
const setPlans = val => (state.plans = val)
const setScheduledUpdate = val => (state.subInfo.scheduledUpdate = val)
const setPaymentMethod = val => (state.subInfo.paymentMethod = val)

const togglePaymentMethodUpdate = val => (state.isUpdatingPayment = val)
const toggleActivePlanUpdate = val => (state.isUpdatingPlan = val)
const toggleIsRetryingPayment = val => (state.isRetryingPayment = val)
const toggleIsRemovingCard = val => (state.isRemovingCard = val)

const plans = computed(() => state.plans.filter(plan => !plan.is_disabled))

// Subscription Getters
const isSubscribed = computed(() => {
  if (!Object.keys(state.subInfo).length) return false
  return true
})

const isSubscriptionActive = computed(() => {
  if (!isSubscribed.value) return false
  if (state.subInfo.subDetails.status != 'active') return false
  return true
})

const subDetails = computed(() => {
  if (isSubscribed.value) return state.subInfo.subDetails
  return {}
})

const subscriptionStart = computed(() => {
  const periodStart = subDetails.value.current_period_start
  if (!periodStart) return ''

  const startDate = new Date(periodStart * 1000)
  return startDate.toLocaleDateString()
})

const subscriptionEnd = computed(() => {
  const periodEnd = subDetails.value.current_period_end
  if (!periodEnd) return ''

  const endDate = new Date(periodEnd * 1000)
  return endDate.toLocaleDateString()
})

const renewalError = computed(() => {
  if (!isSubscribed.value || isSubscriptionActive.value) return {}
  return state.subInfo.renewalErrorStatus
})

const hasRenewalError = computed(() => {
  if (Object.keys(renewalError.value).length) return true
  return false
})

const isTrialing = computed(() => {
  if (state.subInfo.subDetails?.status == 'trialing') return true
  return false
})

const trialStatus = computed(() => state.subInfo.trialStatus)

// Payment Method Getters
const paymentMethod = computed(() => {
  if (isSubscribed.value) return state.subInfo.paymentMethod
  return {}
})

const defaultCardInfo = computed(() => {
  const { card } = paymentMethod.value
  if (!card) return 'No Card Attached'

  return `${card.brand} Ending With ${card.last4}`
})

const hasPaymentMethodAttached = computed(() => {
  if (Object.keys(paymentMethod.value).length) return true
  return false
})

// Active Plan Getters
const activePlan = computed(() => {
  if (isSubscribed.value) return state.subInfo.activePlan
  return {}
})

const isUpdatingPlan = computed(() => state.isUpdatingPlan)

// Update Forms & Checkout
const isCheckingOut = computed(() => {
  if (state.clickedPrice) return true
  return false
})

const isUpdatingPayment = computed(() => state.isUpdatingPayment)

const scheduledUpdate = computed(() => {
  if (!state.subInfo?.scheduledUpdate) return {}
  return state.subInfo.scheduledUpdate
})

const checkoutPlan = computed(() => {
  if (!state.clickedPrice) return {}
  return state.plans.find(plan => plan.price_id == state.clickedPrice)
})

const updatePlanInfo = computed(() => {
  console.log(scheduledUpdate.value)
  if (!scheduledUpdate.value.updatePlan) return ''

  const plan = scheduledUpdate.value.updatePlan
  const {
    name, amount, interval, currency,
  } = plan
  return `${name} (${amount / 100} ${currency.toUpperCase()} / ${interval})`
})

async function handleSubUpdate() {
  const { data: sub } = await axios.get('/subscriptions')
  setSubInfo(sub)
}

export function useSubscription() {
  return {
    state: readonly(state),

    plans,
    activePlan,

    paymentMethod,
    defaultCardInfo,
    hasPaymentMethodAttached,

    subDetails,
    subscriptionStart,
    subscriptionEnd,

    handleSubUpdate,

    setSubInfo,
    setClickedPrice,
    setPlans,
    setScheduledUpdate,
    setPaymentMethod,

    togglePaymentMethodUpdate,
    toggleActivePlanUpdate,
    toggleIsRetryingPayment,
    toggleIsRemovingCard,

    isSubscribed,
    isSubscriptionActive,

    isCheckingOut,
    isUpdatingPlan,
    isUpdatingPayment,

    isTrialing,
    trialStatus,

    hasRenewalError,
    renewalError,

    checkoutPlan,
    scheduledUpdate,
    updatePlanInfo,
  }
}
