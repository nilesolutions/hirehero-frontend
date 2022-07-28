<template>
  <div class="mt-10">
    <h3 class="cursive-font mx-3">
      Available Plans
    </h3>
    <div class="d-flex flex-row flex-wrap">
      <plan-card
        class="p-0 m-0"
        v-for="plan in plans"
        :key="plan.priceId"
        :plan="plan"
      />
    </div>
  </div>
</template>

<script>
import PlanCard from '@/components/subscriptions/PlanCard.vue'
import { useSubscription } from '@/composables/user/subscription'

export default {
  name: 'AvailablePlans',
  components: { PlanCard },
  setup() {
    const { plans } = useSubscription()

    return {
      plans,
    }
  },
}
</script>

<style></style>
