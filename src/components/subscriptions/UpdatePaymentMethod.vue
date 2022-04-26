<template>
  <v-card
    :loading="state.isInitting || state.isSubmitting"
    :disabled="state.isSubmitting || state.isInitting"
  >
    <v-card-title>
      <span class="cursive-font">Update your payment method</span>
      <v-btn class="ml-auto" @click="closeUpdateForm" icon>
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
        <b>Changing Default Card </b> <br />
        <b>
          Currently using : <span class="text-capitalize">{{ defaultCardInfo }}</span>
        </b>
      </v-card-text>

      <v-card-text v-if="!state.initError">
        <form
          id="payment-form"
          class="d-flex flex-column align-center"
          @submit.prevent="handleSubmit"
        >
          <div id="payment-element">
            <!-- Stripe.js injects the Payment Element -->
          </div>

          <v-btn type="submit" class="mt-2" color="primary" :loading="state.isInitting">
            Confirm
          </v-btn>
          <div id="payment-message" class="mt-2 warning--text">{{ state.msg }}</div>
        </form>
      </v-card-text>
      <div class="text-center" v-else>
        {{ state.initError }}
      </div>
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
  name: "UpdatePaymentMethod",
  setup() {
    const { defaultCardInfo, togglePaymentMethodUpdate } = useSubscription();

    const state = reactive({
      isInitting: true,
      isSubmitting: false,
      initError: "",
      msg: "",
    });

    var intentId = "",
      stripe = null,
      elements = null,
      paymentElement = null;

    onMounted(() => initForm());

    async function initForm() {
      try {
        const { data: setupIntent } = await axios.post("/payment-methods/update");

        stripe = await loadStripe(process.env.VUE_APP_STRIPE_PK);
        elements = stripe.elements({
          clientSecret: setupIntent.clientSecret,
        });

        paymentElement = elements.create("payment");
        paymentElement.on("ready", () => {
          state.isInitting = false;
        });

        paymentElement.mount("#payment-element");
      } catch (err) {
        console.log(err);
        state.initError = err;
        state.isInitting = false;
      }
    }

    async function closeUpdateForm() {
      if (state.isSubmitting || state.isInitting) return false;
      if (intentId) cancelUpdate();
      togglePaymentMethodUpdate(false);
    }

    async function cancelUpdate() {
      await axios.post("/payment-methods/cancel-update", {
        intentId,
      });
    }

    async function handleSubmit(e) {
      e.preventDefault();

      state.msg = "";
      state.isSubmitting = true;

      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: process.env.VUE_APP_STRIPE_REDIRECT_URL + "?type=paymentUpdate",
        },
      });

      if (error) {
        state.msg = error.message;
        state.isSubmitting = false;
      }
    }

    return {
      state,
      defaultCardInfo,
      handleSubmit,
      closeUpdateForm,

      icons: {
        mdiClose,
      },
    };
  },
};
</script>

<style lang="scss"></style>
