<template>
  <div class="mt-4" v-show="isSubscribed">
    <v-card>
      <v-card-title class="cursive-font">Your current plan</v-card-title>
      <v-card-title>{{ subscriptionState.activePlan.name }}</v-card-title>
      <v-card-text>Started on : {{ planStart }}</v-card-text>
      <v-card-text>Ends on : {{ planEnd }}</v-card-text>

      <v-card-text>
        <v-btn @click="state.isCancelOpen = true" outlined color="warning"
          >Cancel subscription</v-btn
        >
      </v-card-text>
    </v-card>

    <v-dialog v-model="state.isCancelOpen" width="fit-content">
      <v-card>
        <v-card-text>Are you sure you want to cancel your plan ?</v-card-text>
        <v-card-actions>
          <v-btn :loading="state.isCancelling" @click="cancelSubscription" color="warning">
            Yes, I really want to cancel
          </v-btn>
          <v-btn @click="isCancelOpen = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card v-show="!isSubscribed">
      <v-card-text></v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/subscription";
export default {
  name: "CurrentPlan",
  setup() {
    const { state: subscriptionState, isSubscribed, setActivePlan } = useSubscription();
    const state = reactive({
      isCancelOpen: false,
      isCancelling: false,
    });

    const planStart = computed(() => {
      const startDate = new Date(subscriptionState.activePlan.current_period_start * 1000);
      return startDate.toLocaleDateString();
    });

    const planEnd = computed(() => {
      const endDate = new Date(subscriptionState.activePlan.current_period_start * 1000);
      endDate.setMonth(endDate.getMonth() + 1);

      return endDate.toLocaleDateString();
    });

    async function cancelSubscription() {
      try {
        state.isCancelling = true;
        await axios.delete("/subscriptions");
        setActivePlan({});
      } catch (err) {
        console.log();
      } finally {
        state.isCancelOpen = false;
        state.isCancelling = false;
      }
    }

    return {
      state,
      subscriptionState,

      isSubscribed,
      planStart,
      planEnd,

      cancelSubscription,
    };
  },
};
</script>

<style></style>
