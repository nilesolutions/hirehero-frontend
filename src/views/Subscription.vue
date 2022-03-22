<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Subscription Plans</h2>

    <div class="d-flex flex-row">
      <available-plans></available-plans>
      <current-plan></current-plan>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import AvailablePlans from "@/components/subscriptions/AvailablePlans.vue";
import CurrentPlan from "@/components/subscriptions/CurrentPlan.vue";

export default {
  name: "Subscription",
  components: {
    AvailablePlans,
    CurrentPlan,
  },
};
</script>

<style></style>
