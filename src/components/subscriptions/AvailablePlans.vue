<template>
  <div class="d-flex flex-column col-12">A</div>
</template>

<script>
import axios from "@axios";
import { reactive, onMounted } from "@vue/composition-api";

export default {
  name: "AvailablePlans",
  setup() {
    const state = reactive({
      isLoading: false,
    });

    onMounted(() => getPlans());

    async function getPlans() {
      try {
        console.log("Getting plans");
        const response = await axios.get("subscriptions/plans");
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }
  },
};
</script>

<style></style>
