<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Subscription Plans</h2>

    <div v-show="!state.isLoading">
      <available-plans></available-plans>
      <current-plan></current-plan>
    </div>

    <v-progress-circular v-show="state.isLoading" indeterminate></v-progress-circular>
  </div>
</template>

<script>
import axios from "@axios";
import AvailablePlans from "@/components/subscriptions/AvailablePlans.vue";
import CurrentPlan from "@/components/subscriptions/CurrentPlan.vue";
import { useSubscription } from "@/composables/subscription";
import { onMounted, reactive } from "@vue/composition-api";

export default {
  name: "Subscription",
  components: {
    AvailablePlans,
    CurrentPlan,
  },
  setup() {
    const { setActivePlan } = useSubscription();

    const state = reactive({
      isLoading: true,
    });

    onMounted(() => initSubscription());

    async function initSubscription() {
      try {
        const { data: activePlan } = await axios.get("/subscriptions/");
        setActivePlan(activePlan);
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
