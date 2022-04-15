<template>
  <div class="d-flex flex-row flex-wrap">
    <v-progress-circular
      v-show="state.isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>

    <plan-card v-for="plan in state.plans" :key="plan.priceId" :plan="plan"></plan-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, onMounted } from "@vue/composition-api";

import PlanCard from "@/components/subscriptions/PlanCard.vue";

export default {
  name: "AvailablePlans",
  components: { PlanCard },
  setup() {
    const state = reactive({
      isLoading: false,
      plans: [],
    });

    onMounted(() => getPlans());

    async function getPlans() {
      try {
        state.isLoading = true;
        const { data: plans } = await axios.get("subscriptions/plans");
        state.plans = plans;
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
    };
  },
};
</script>

<style></style>
