<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">
      Subscriptions
    </h2>

    <div
      v-if="state.isLoading"
      class="d-flex"
    >
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>

    <div v-if="showPlans">
      <current-plan v-if="isSubscriptionActive" />
      <available-plans />
    </div>

    <checkout-form v-if="showCheckoutForm" />
    <update-active-plan v-if="showPlanUpdateForm" />
    <update-payment-method v-if="showUpdatePaymentForm" />
  </div>
</template>

<script>
import axios from '@axios'

import { onMounted, reactive, computed } from '@vue/composition-api'
import AvailablePlans from '@/components/subscriptions/AvailablePlans.vue'
import CurrentPlan from '@/components/subscriptions/CurrentPlan.vue'
import CheckoutForm from '@/components/subscriptions/CheckoutForm.vue'
import UpdateActivePlan from '@/components/subscriptions/UpdateActivePlan.vue'
import UpdatePaymentMethod from '@/components/subscriptions/UpdatePaymentMethod.vue'

import { useSubscription } from '@/composables/user/subscription'
import { useCheckout } from '@/composables/user/checkout'

export default {
  name: 'Subscription',
  components: {
    AvailablePlans,
    CurrentPlan,
    CheckoutForm,
    UpdateActivePlan,
    UpdatePaymentMethod,
  },
  setup() {
    const {
      setSubInfo, setPlans, isSubscribed, isSubscriptionActive, isUpdatingPayment, isUpdatingPlan,
    } = useSubscription()

    const { isCheckingOut } = useCheckout()
    console.log('from SUb ', isSubscriptionActive.value)
    const state = reactive({
      isLoading: true,
    })

    const showPlans = computed(() => {
      if (state.isLoading || isCheckingOut.value || isUpdatingPayment.value || isUpdatingPlan.value) return false
      return true
    })

    const showCheckoutForm = computed(() => {
      if (isCheckingOut.value && !state.isLoading) {
        return true
      }

      return false
    })

    const showUpdatePaymentForm = computed(() => {
      if (isUpdatingPayment.value && !state.isLoading) {
        return true
      }

      return false
    })

    const showPlanUpdateForm = computed(() => {
      if (isUpdatingPlan.value && !state.isLoading) {
        return true
      }

      return false
    })

    onMounted(() => initPage())

    async function initPage() {
      try {
        await Promise.all([fetchActiveSubscription(), fetchPlans()])
      } catch (err) {
        console.log(err)
      } finally {
        state.isLoading = false
      }
    }

    async function fetchPlans() {
      const { data: plans } = await axios.get('subscriptions/plans')
      setPlans(plans)
    }

    async function fetchActiveSubscription() {
      const { data: sub } = await axios.get('/subscriptions/')
      console.log(sub)
      setSubInfo(sub)
    }

    return {
      state,
      showPlans,
      showCheckoutForm,
      showPlanUpdateForm,
      showUpdatePaymentForm,
      isSubscribed,
      isSubscriptionActive,
    }
  },
}
</script>

<style></style>
