<template>
  <div v-if="state.isLoading" class="d-flex flex-row mt-auto mb-auto justify-center mt-12">
    <v-progress-circular color="primary" class="align-center" indeterminate></v-progress-circular>
  </div>

  <div v-else class="d-flex flex-row align-center mt-auto mb-auto">
    <v-card class="d-flex flex-column text-center ml-auto mr-auto">
      <v-card-text>{{ state.msg || state.error }}</v-card-text>
      <v-card-text>
        <v-btn color="primary" @click="closeNotification">
          Go to dashboard <v-icon class="ml-2" small>{{ icons.mdiArrowRight }}</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mdiArrowRight } from "@mdi/js";
import { onMounted, reactive } from "@vue/composition-api";
import { loadStripe } from "@stripe/stripe-js";

export default {
  name: "StatusMessage",

  setup(_, { emit }) {
    const state = reactive({
      isLoading: true,
      msg: "",
      error: "",
    });

    function closeNotification() {
      emit("close");
    }

    onMounted(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const paymentIntentSecret = searchParams.get("payment_intent_client_secret");
      const setupIntentSecret = searchParams.get("setup_intent_client_secret");

      if (paymentIntentSecret) {
        retrievePaymentStatus(paymentIntentSecret);
      } else {
        retrievePaymentSetupStatus(setupIntentSecret);
      }
    });

    async function retrievePaymentSetupStatus(clientSecret) {
      try {
        const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        const { setupIntent } = await stripe.retrieveSetupIntent(clientSecret);

        switch (setupIntent.status) {
          case "succeeded":
            state.msg = "You've successfully set up your payment method for future payments.";
            break;
          case "processing":
            state.msg = "Your payment is processing. Your subscription will be updated shortly.";
            break;
          case "requires_payment_method":
            state.msg = "Your payment was not successful, please try again.";
            break;
          default:
            state.msg = "Something went wrong.";
            break;
        }
      } catch (err) {
        state.error = err;
      } finally {
        state.isLoading = false;
      }
    }

    async function retrievePaymentStatus(clientSecret) {
      try {
        const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

        switch (paymentIntent.status) {
          case "succeeded":
            state.msg = "Payment succeeded! You are now subscribed.";
            break;
          case "processing":
            state.msg = "Your payment is processing. Your subscription will be updated shortly.";
            break;
          case "requires_payment_method":
            state.msg = "Your payment was not successful, please try again.";
            break;
          default:
            state.msg = "Something went wrong.";
            break;
        }
      } catch (err) {
        state.error = err;
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      closeNotification,
      icons: {
        mdiArrowRight,
      },
    };
  },
};
</script>

<style></style>
