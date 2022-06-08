<template>
  <div>
    <div class="d-flex flex-row mt-2 mb-4" v-if="checkoutState.isBillingLoading">
      <v-progress-circular
        class="ml-auto mr-auto"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>

    <div v-if="!state.initError">
      <v-card-text class="text-center">
        <b>Subscribing to {{ checkoutPlan.name }} </b> <br />
        <b>{{ planPrice }}</b>
      </v-card-text>

      <v-card-text>
        <form
          id="payment-form"
          class="d-flex flex-column align-center"
          @submit.prevent="handleSubmit"
        >
          <div id="payment-element">
            <!--Stripe.js injects the Payment Element-->
          </div>

          <hr style="height: 2px" />

          <v-alert v-show="isCouponApplied" type="success">
            Coupon is applied. Your will a recieve a discount of :
            <b>
              <span v-show="appliedCoupon.percent_off">
                {{ appliedCoupon.percent_off }} % off
              </span>
              <span v-show="appliedCoupon.amount_off" class="text-uppercase">
                {{ appliedCoupon.amount_off / 100 }} {{ appliedCoupon.currency }}
              </span>
            </b>
          </v-alert>

          <v-btn
            type="submit"
            class="mt-2"
            color="primary"
            :loading="checkoutState.isBillingLoading"
          >
            Checkout
          </v-btn>
          <div id="payment-message" class="mt-2 warning--text">{{ state.msg }}</div>
        </form>
      </v-card-text>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import { loadStripe } from "@stripe/stripe-js";
import { mdiClose } from "@mdi/js";

import { useSubscription } from "@/composables/user/subscription";
import { useCheckout } from "@/composables/user/checkout";
import { reactive, onMounted, computed, onUnmounted, nextTick } from "@vue/composition-api";

export default {
  name: "BillingDetailsStep",
  setup() {
    const { state: subscriptionState } = useSubscription();

    const {
      state: checkoutState,
      isCouponApplied,
      appliedCoupon,
      toggleIsBillingLoading,
      toggleIsSubmitting,
      checkoutPlan,
    } = useCheckout();

    const state = reactive({
      isSubmitting: false,
      initError: "",
      msg: "",
    });

    var subId = "",
      stripe = null,
      elements = null,
      paymentElement = null;

    const planPrice = computed(() => {
      const currency = checkoutPlan.value.currency.toUpperCase();
      const amount = checkoutPlan.value.amount / 100;
      const interval = checkoutPlan.value.interval;

      return `${amount} ${currency}/${interval}`;
    });

    async function initForm() {
      try {
        const { data: paymentIntent } = await axios.post("/subscriptions", {
          priceId: checkoutState.clickedPrice,
          couponId: appliedCoupon.value.id,
        });

        subId = paymentIntent.subscriptionId;

        stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        elements = stripe.elements({
          clientSecret: paymentIntent.clientSecret,
        });
        paymentElement = elements.create("payment");
        paymentElement.on("ready", () => {
          toggleIsBillingLoading(false);
        });

        paymentElement.mount("#payment-element");
      } catch (err) {
        state.initError = "Error occured while checking out. Please try again later";
        toggleIsBillingLoading(false);
        console.log(err);
      }
    }

    async function cancelCheckout() {
      await axios.post("/subscriptions/cancel-checkout", {
        subId,
      });
    }

    async function handleSubmit(e) {
      e.preventDefault();

      state.msg = "";
      toggleIsSubmitting(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: process.env.VUE_APP_STRIPE_REDIRECT_URL + "?type=subscribed",
        },
      });

      if (error) {
        state.msg = error.message;
        toggleIsSubmitting(false);
      }
    }
    onMounted(() => {
      toggleIsBillingLoading(true);
      console.log("from component", checkoutState);
      nextTick(() => initForm());
    });

    onUnmounted(() => {
      if (subId) cancelCheckout();
    });

    return {
      state,
      checkoutState,
      subscriptionState,

      checkoutPlan,
      planPrice,

      isCouponApplied,
      appliedCoupon,

      handleSubmit,

      icons: {
        mdiClose,
      },
    };
  },
};
</script>

<style></style>
