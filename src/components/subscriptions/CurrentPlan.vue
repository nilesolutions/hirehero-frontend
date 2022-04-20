<template>
  <div class="d-flex flex-row mt-4" v-if="isSubscribed">
    <v-card class="col-md-4 col-12" :loading="state.isCancelling" :disabled="state.isCancelling">
      <v-card-title class="cursive-font">Your Subscription</v-card-title>

      <v-card-text class="d-flex flex-row">
        Current plan:
        <span class="ml-auto">{{ subscriptionState.activePlan.name }}</span>
      </v-card-text>

      <v-card-text class="d-flex flex-row">
        Started on :
        <span class="ml-auto">{{ planStart }}</span>
      </v-card-text>

      <v-card-text class="d-flex flex-row">
        Ends on :
        <span class="ml-auto">{{ planEnd }}</span>
      </v-card-text>

      <v-btn class="d-block mb-2" small elevation="0">
        <b>
          Change plan <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </b>
      </v-btn>

      <v-btn @click="cancelSubscription" small elevation="0">
        <b>
          Cancel subscription <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </b>
      </v-btn>

      <a ref="portalLink" style="display: none" target="_blank"></a>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, computed, ref } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

import { mdiChevronRight } from "@mdi/js";
export default {
  name: "CurrentPlan",
  setup() {
    const { state: subscriptionState, isSubscribed, setActivePlan } = useSubscription();
    const portalLink = ref(null);
    const state = reactive({
      isCancelOpen: false,
      isCancelling: false,
      isLoading: false,
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
      const confirm = await this.$confirm(
        "Are you sure you want to cancel your plan ? This action can not be undone",
        { title: "warning" }
      );

      if (!confirm) return;

      try {
        state.isCancelling = true;
        await axios.delete("/subscriptions");
        setActivePlan({});
      } catch (err) {
        console.log(err);
      } finally {
        state.isCancelOpen = false;
        state.isCancelling = false;
      }
    }

    return {
      state,
      portalLink,
      subscriptionState,

      isSubscribed,
      planStart,
      planEnd,

      cancelSubscription,

      icons: {
        mdiChevronRight,
      },
    };
  },
};
</script>

<style></style>
