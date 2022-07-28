<template>
  <div class="col-md-4 col-12 card">
    <v-card
      class="d-flex flex-column align-center py-4"
      elevation="4"
    >
      <v-card-title class="cursive-font plan-card__title">
        {{ plan.name }} {{ isActivePlan ? " (Your Plan)" : "" }}
      </v-card-title>

      <v-card-text class="price">
        {{ planPrice }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-show="showCheckoutBtn"
          :loading="state.isLoading"
          color="primary"
          outlined
          block
          @click="checkout"
        >
          Get it now
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { reactive, computed } from '@vue/composition-api'
import { useSubscription } from '@/composables/user/subscription'
import { useCheckout } from '@/composables/user/checkout'

export default {
  name: 'PlanCard',
  props: { plan: Object },
  setup({ plan }) {
    const { isSubscribed, activePlan, isSubscriptionActive } = useSubscription()
    const { setClickedPrice } = useCheckout()

    const state = reactive({
      isLoading: false,
    })

    const planPrice = computed(() => {
      const price = plan.amount / 100
      const commaSeparatedPrice = price.toLocaleString('en-US')
      // const currency = plan.currency.toUpperCase()
      const billingCycle = plan.interval.charAt(0).toUpperCase() + plan.interval.slice(1)
      return `$${commaSeparatedPrice} / ${billingCycle}`
    })

    const isActivePlan = computed(() => {
      if (!isSubscriptionActive.value) return false
      if (activePlan.value.id === plan.id) return true
      return false
    })

    const showCheckoutBtn = computed(() => {
      // if (isSubscribed.value && isActivePlan.value) return true;
      if (isSubscriptionActive.value) return false
      return true
    })

    async function checkout() {
      try {
        if (isSubscriptionActive.value) return

        setClickedPrice(plan.price_id)
      } catch (err) {
        console.log(err)
      } finally {
        state.isLoading = false
      }
    }

    return {
      state,

      isActivePlan,
      showCheckoutBtn,
      planPrice,
      checkout,
    }
  },
}
</script>

<style>
.plan-card__title {
  word-break: break-all;
}
.card{
padding: 15px 10px !important;
/* margin: 0 5px !important; */
}
.price{
  font-size: 18px !important;
}

@media (max-width:767px) {
  .card{
    padding: 10px 0 !important;
  }
  .price{
  padding: 0;
  font-size: 20px !important;
}
}
</style>
