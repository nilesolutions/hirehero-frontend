<template>
  <div class="mt-4" v-show="isSubscribed">
    <v-card>
      <v-card-title class="cursive-font">Your current plan</v-card-title>
      <v-card-title>{{ subscriptionState.activePlan.name }}</v-card-title>
      <v-card-text>Started on : {{ planStart }}</v-card-text>
      <v-card-text>Ends on : {{ planEnd }}</v-card-text>

      <v-card-text>
        <v-btn @click="startPortalSession" :loading="state.isLoading" outlined color="primary">
          Manage Plan
        </v-btn>
      </v-card-text>

      <a ref="portalLink" style="display: none" target="_blank"></a>
    </v-card>

    <v-card v-show="!isSubscribed">
      <v-card-text></v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, computed, ref } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";
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

    async function startPortalSession() {
      try {
        state.isLoading = true;
        const { data: session } = await axios.post("/subscriptions/portal");

        portalLink.value.setAttribute("href", session.url);
        portalLink.value.click();
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

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
      portalLink,
      subscriptionState,

      isSubscribed,
      planStart,
      planEnd,

      cancelSubscription,
      startPortalSession,
    };
  },
};
</script>

<style></style>
