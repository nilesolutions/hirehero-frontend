<template>
  <div class="d-flex flex-row mt-4">
    <v-card
      class="col-12 box"
      elevation="4"
      :loading="subscriptionState.isRetryingPayment || subscriptionState.isRemovingCard"
      :disabled="subscriptionState.isRetryingPayment || subscriptionState.isRemovingCard"
    >
      <div class="d-flex">
        <v-card-title class="cursive-font ml-auto mr-auto pb-8">
          Your Subscription
        </v-card-title>
      </div>

      <current-plan-details />
      <current-plan-controls v-if="!userState.isPreviewMode" />
    </v-card>
  </div>
</template>

<script>
import CurrentPlanControls from '@/components/subscriptions/CurrentPlanControls.vue'
import CurrentPlanDetails from '@/components/subscriptions/CurrentPlanDetails.vue'
import { useSubscription } from '@/composables/user/subscription'
import { useUser } from '@/composables/user/user'

export default {
  name: 'CurrentPlan',
  components: { CurrentPlanControls, CurrentPlanDetails },
  setup() {
    const { state: subscriptionState } = useSubscription()
    const { state: userState } = useUser()

    return {
      subscriptionState,
      userState,
    }
  },
}
</script>

<style>
.box{
 padding-left: 0 !important;
    padding-right: 0 !important;
}

@media (max-width:767px) {
  .box{
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
