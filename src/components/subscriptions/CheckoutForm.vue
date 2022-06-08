<template>
  <v-card :loading="isCardDisabled" :disabled="isCardDisabled">
    <v-card-title>
      <span class="cursive-font">Checkout</span>
      <v-btn class="ml-auto" @click="closeForm" icon>
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-stepper v-model="checkoutState.step" elevation="0">
      <v-stepper-header>
        <v-stepper-step step="1">Apply coupon</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2">Checkout details</v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <apply-coupon-step v-if="checkoutState.step == 1"></apply-coupon-step>
    <billing-details-step v-if="checkoutState.step == 2"></billing-details-step>

    <div class="text-center" v-if="state.initError">
      {{ state.initError }}
    </div>
  </v-card>
</template>

<script>
import axios from "@axios";
import { loadStripe } from "@stripe/stripe-js";
import { mdiClose } from "@mdi/js";

import { reactive, onMounted, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

import ApplyCouponStep from "@/components/subscriptions/ApplyCouponStep.vue";
import BillingDetailsStep from "@/components/subscriptions/BillingDetailsStep.vue";
import { useCheckout } from "@/composables/user/checkout";

export default {
  name: "CheckoutForm",
  components: { ApplyCouponStep, BillingDetailsStep },
  setup() {
    const { state: subscriptionState } = useSubscription();

    const { state: checkoutState, checkoutPlan, resetCheckoutState } = useCheckout();

    const state = reactive({
      isInitting: true,
      isSubmitting: false,
      initError: "",
      msg: "",
    });

    var subId = "",
      stripe = null,
      elements = null,
      paymentElement = null;

    async function closeForm() {
      if (subId) cancelCheckout();
      resetCheckoutState();
    }

    const isCardDisabled = computed(() => {
      if (checkoutState.isBillingLoading && checkoutState.step == 2) return true;
      if (checkoutState.isSubmitting) return true;
      return false;
    });

    async function handleSubmit(e) {
      e.preventDefault();

      state.msg = "";
      state.isSubmitting = true;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: process.env.VUE_APP_STRIPE_REDIRECT_URL + "?type=subscribed",
        },
      });

      if (error) {
        state.msg = error.message;
        state.isSubmitting = false;
      }
    }

    async function applyCoupon() {
      if (!state.promotionCode) return;

      try {
        state.isSubmitting = true;
        const { data: appliedCoupon } = await axios.post("/coupons/apply", {
          subId: subId,
          code: state.promotionCode,
        });

        state.appliedCoupon = appliedCoupon;
      } catch (err) {
        const status = err.response.status;
        if (status == 403) state.couponError = "Code expired";
        else if (status == 400) state.couponError = "Code does not exist";
        else state.couponError = "Invalid code";

        state.appliedCoupon = {};
      } finally {
        state.isSubmitting = false;
      }
    }

    async function removeCoupon() {
      try {
        state.isSubmitting = true;
        await axios.post("/coupons/clear", {
          subId: subId,
        });
        state.appliedCoupon = {};
      } catch (err) {
        console.log(err);
      } finally {
        state.isSubmitting = false;
      }
    }

    async function initForm() {
      try {
        const { data: paymentIntent } = await axios.post("/subscriptions", {
          priceId: subscriptionState.clickedPrice,
        });

        subId = paymentIntent.subscriptionId;

        stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        elements = stripe.elements({
          clientSecret: paymentIntent.clientSecret,
        });
        paymentElement = elements.create("payment");
        paymentElement.on("ready", () => {
          state.isInitting = false;
        });

        paymentElement.mount("#payment-element");
      } catch (err) {
        state.initError = "Error occured while checking out. Please try again later";
        state.isInitting = false;
        console.log(err);
      }
    }

    onMounted(() => {
      //initForm();
    });

    async function cancelCheckout() {
      await axios.post("/subscriptions/cancel-checkout", {
        subId,
      });
    }

    return {
      state,
      checkoutState,
      subscriptionState,

      checkoutPlan,
      isCardDisabled,

      handleSubmit,
      closeForm,

      icons: {
        mdiClose,
      },
    };
  },
};
</script>

<style lang="scss"></style>
