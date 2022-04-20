<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Subscription Plans</h2>

    <status-message v-if="isStatusOverlayActive"></status-message>

    <div v-if="!isCheckingOut && !state.isLoading">
      <available-plans></available-plans>
      <current-plan></current-plan>
    </div>

    <checkout-form v-else-if="isCheckingOut && !state.isLoading"></checkout-form>

    <div class="d-flex flex-row justify-center" v-if="state.isLoading">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import { loadStripe } from "@stripe/stripe-js";

import AvailablePlans from "@/components/subscriptions/AvailablePlans.vue";
import CurrentPlan from "@/components/subscriptions/CurrentPlan.vue";
import CheckoutForm from "@/components/subscriptions/CheckoutForm.vue";
import StatusMessage from "@/components/subscriptions/StatusMessage.vue";

import { onMounted, reactive } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "Subscription",
  components: {
    AvailablePlans,
    CurrentPlan,
    CheckoutForm,
    StatusMessage,
  },
  setup() {
    const { isCheckingOut, setActivePlan, setPlans, setStatusMsg, isStatusOverlayActive } =
      useSubscription();

    const state = reactive({
      isLoading: true,
      statusMsg: "",
    });

    onMounted(() => initPage());

    async function initPage() {
      try {
        await Promise.all([fetchActiveSubscription(), fetchPlans(), checkPaymentStatus()]);
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
      const { data: activePlan } = await axios.get("/subscriptions/");
      setActivePlan(activePlan);
    }

    async function checkPaymentStatus() {
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) return;

      const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      switch (paymentIntent.status) {
        case "succeeded":
          setStatusMsg("Payment succeeded!");
          break;
        case "processing":
          setStatusMsg("Your payment is processing.");
          break;
        case "requires_payment_method":
          setStatusMsg("Your payment was not successful, please try again.");
          break;
        default:
          setStatusMsg("Something went wrong.");
          break;
      }
    }

    return {
      state,

      isCheckingOut,
      isStatusOverlayActive,
    };
  },
};
</script>

<style></style>
