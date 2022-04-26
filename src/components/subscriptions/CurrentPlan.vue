<template>
  <div class="d-flex flex-row mt-4">
    <v-card class="col-md-6 col-12" :loading="state.isCancelling" :disabled="state.isCancelling">
      <v-card-title class="cursive-font">Your Subscription</v-card-title>

      <v-card-text class="d-flex flex-row">
        Current plan:
        <span class="ml-auto">{{ activePlan.name }}</span>
      </v-card-text>

      <v-card-text class="d-flex flex-row">
        Started on :
        <span class="ml-auto">{{ subscriptionStart }}</span>
      </v-card-text>

      <v-card-text class="d-flex flex-row">
        Ends on :
        <span class="ml-auto">{{ subscriptionEnd }}</span>
      </v-card-text>

      <v-card-text class="d-flex flex-row">
        Card :
        <span class="ml-auto text-capitalize">{{ defaultCardInfo }}</span>
      </v-card-text>

      <v-card-text v-show="updatePlanInfo">
        <v-alert border="left" dense type="info">
          <small>
            Your plan will change to <span class="text-capitalize">{{ updatePlanInfo }}</span> at
            the end of your current billing period.
            <br />
            Head to manage plan to cancel this update.
          </small>
        </v-alert>
      </v-card-text>

      <v-btn class="d-block mb-2" small elevation="0" @click="toggleActivePlanUpdate(true)">
        <b>
          Manage plan <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </b>
      </v-btn>

      <v-btn class="d-block mb-2" small elevation="0" @click="togglePaymentMethodUpdate(true)">
        <b>
          Update payment method <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </b>
      </v-btn>

      <v-btn @click="cancelSubscription" small elevation="0">
        <b>
          Cancel subscription <v-icon>{{ icons.mdiChevronRight }}</v-icon>
        </b>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

import { mdiChevronRight } from "@mdi/js";
export default {
  name: "CurrentPlan",
  setup() {
    const {
      isSubscribed,
      setSubInfo,
      activePlan,
      toggleActivePlanUpdate,

      subDetails,
      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      defaultCardInfo,
      togglePaymentMethodUpdate,
    } = useSubscription();

    const state = reactive({
      isCancelOpen: false,
      isCancelling: false,
      isLoading: false,
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
        setSubInfo({});
      } catch (err) {
        console.log(err);
      } finally {
        state.isCancelOpen = false;
        state.isCancelling = false;
      }
    }

    return {
      state,
      activePlan,
      subDetails,
      toggleActivePlanUpdate,

      isSubscribed,
      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      defaultCardInfo,

      cancelSubscription,
      togglePaymentMethodUpdate,

      icons: {
        mdiChevronRight,
      },
    };
  },
};
</script>

<style></style>
