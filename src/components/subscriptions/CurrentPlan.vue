<template>
  <div class="d-flex flex-row mt-4">
    <v-card
      class="col-lg-8 col-12"
      elevation="4"
      :loading="subscriptionState.isRetryingPayment || subscriptionState.isRemovingCard"
      :disabled="subscriptionState.isRetryingPayment || subscriptionState.isRemovingCard"
    >
      <div class="d-flex">
        <v-card-title class="cursive-font ml-auto mr-auto">Your Subscription</v-card-title>
      </div>

      <current-plan-details></current-plan-details>
      <current-plan-controls v-if="!userState.isPreviewMode"></current-plan-controls>
    </v-card>
  </div>
</template>

<script>
import CurrentPlanControls from "@/components/subscriptions/CurrentPlanControls.vue";
import CurrentPlanDetails from "@/components/subscriptions/CurrentPlanDetails.vue";
import { useSubscription } from "@/composables/user/subscription";
import { useUser } from "@/composables/user/user";

export default {
  name: "CurrentPlan",
  components: { CurrentPlanControls, CurrentPlanDetails },
  setup() {
    const { state: subscriptionState } = useSubscription();
    const { state: userState } = useUser();

    return {
      subscriptionState,
      userState,
    };
  },
};
</script>

<style></style>
