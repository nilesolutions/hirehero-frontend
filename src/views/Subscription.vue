<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Subscriptions</h2>

    <div class="d-flex flex-row justify-center" v-if="state.isLoading">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>

    <div v-if="showPlans">
      <current-plan v-if="isSubscribed"></current-plan>
      <available-plans></available-plans>
    </div>

    <checkout-form v-if="showCheckoutForm"></checkout-form>
    <update-active-plan v-if="showPlanUpdateForm"></update-active-plan>
    <update-payment-method v-if="showUpdatePaymentForm"></update-payment-method>
  </div>
</template>

<script>
import axios from "@axios";

import AvailablePlans from "@/components/subscriptions/AvailablePlans.vue";
import CurrentPlan from "@/components/subscriptions/CurrentPlan.vue";
import CheckoutForm from "@/components/subscriptions/CheckoutForm.vue";
import UpdateActivePlan from "@/components/subscriptions/UpdateActivePlan.vue";
import UpdatePaymentMethod from "@/components/subscriptions/UpdatePaymentMethod.vue";

import { onMounted, reactive, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "Subscription",
  components: {
    AvailablePlans,
    CurrentPlan,
    CheckoutForm,
    UpdateActivePlan,
    UpdatePaymentMethod,
  },
  setup() {
    const { isCheckingOut, setSubInfo, setPlans, isSubscribed, isUpdatingPayment, isUpdatingPlan } =
      useSubscription();

    const state = reactive({
      isLoading: true,
    });

    const showPlans = computed(() => {
      if (state.isLoading || isCheckingOut.value || isUpdatingPayment.value || isUpdatingPlan.value)
        return false;
      return true;
    });

    const showCheckoutForm = computed(() => {
      if (isCheckingOut.value && !state.isLoading) {
        return true;
      }

      return false;
    });

    const showUpdatePaymentForm = computed(() => {
      if (isUpdatingPayment.value && !state.isLoading) {
        return true;
      }

      return false;
    });

    const showPlanUpdateForm = computed(() => {
      if (isUpdatingPlan.value && !state.isLoading) {
        return true;
      }

      return false;
    });

    onMounted(() => initPage());

    async function initPage() {
      try {
        await Promise.all([fetchActiveSubscription(), fetchPlans()]);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    async function fetchPlans() {
      const { data: plans } = await axios.get("subscriptions/plans");
      setPlans(plans);
    }

    async function fetchActiveSubscription() {
      const { data: sub } = await axios.get("/subscriptions/");
      setSubInfo(sub);
    }

    return {
      state,

      showPlans,
      showCheckoutForm,
      showPlanUpdateForm,
      showUpdatePaymentForm,

      isSubscribed,
    };
  },
};
</script>

<style></style>
