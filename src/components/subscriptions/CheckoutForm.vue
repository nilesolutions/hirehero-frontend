<template>
  <v-card
    :loading="state.isInitting || state.isSubmitting"
    :disabled="state.isSubmitting || state.isInitting"
  >
    <v-card-title>
      <span class="cursive-font">Checkout</span>
      <v-btn class="ml-auto" @click="closeForm" icon>
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>

    <div class="d-flex flex-row mt-2 mb-4" v-if="state.isInitting">
      <v-progress-circular
        class="ml-auto mr-auto"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>

    <div>
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

          <v-btn type="submit" class="mt-2" color="primary" :loading="state.isInitting">
            Confirm
          </v-btn>
          <div id="payment-message" class="mt-2 warning--text">{{ state.msg }}</div>
        </form>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import axios from "@axios";
import { loadStripe } from "@stripe/stripe-js";
import { mdiClose } from "@mdi/js";

import { reactive, onMounted, onUnmounted, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "CheckoutForm",
  setup() {
    const {
      state: subscriptionState,
      checkoutPlan,
      isCheckingOut,
      setClickedPrice,
    } = useSubscription();

    const state = reactive({
      isInitting: true,
      isSubmitting: false,
      msg: "",
    });

    var subId = "",
      stripe = null,
      elements = null,
      paymentElement = null;

    async function closeForm() {
      if (subId) cancelCheckout();
      setClickedPrice("");
    }

    const planPrice = computed(() => {
      const currency = checkoutPlan.value.currency.toUpperCase();
      const amount = checkoutPlan.value.amount / 100;
      const interval = checkoutPlan.value.interval;

      return `${amount} ${currency}/${interval}`;
    });

    async function handleSubmit(e) {
      e.preventDefault();

      state.msg = "";
      state.isSubmitting = true;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: process.env.VUE_APP_STRIPE_REDIRECT_URL,
        },
      });

      if (error) {
        state.msg = error.message;
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
        paymentElement.mount("#payment-element");
      } catch (err) {
        console.log(err);
      } finally {
        state.isInitting = false;
      }
    }

    onMounted(() => {
      initForm();
    });

    async function cancelCheckout() {
      try {
        await axios.post("/subscriptions/cancel-checkout", {
          subId,
        });
      } catch (error) {}
    }

    return {
      state,

      subscriptionState,
      isCheckingOut,

      checkoutPlan,
      planPrice,

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
