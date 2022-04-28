<template>
  <div>
    <v-card-text class="d-flex flex-row">
      Active Plan:
      <span class="ml-auto">{{ activePlan.name }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      Started On :
      <span class="ml-auto">{{ subscriptionStart }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      Ends On :
      <span class="ml-auto">{{ subscriptionEnd }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      Status :
      <span class="ml-auto text-capitalize">{{ subDetails.status.replaceAll("_", " ") }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      Payment Card :
      <span class="ml-auto text-capitalize">{{ defaultCardInfo }}</span>
    </v-card-text>

    <v-card-text v-show="updatePlanInfo">
      <v-alert border="left" dense type="info">
        <small>
          Your plan will change to <span class="text-capitalize">{{ updatePlanInfo }}</span> at the
          end of your current billing period.
          <br />
          Head to manage plan to cancel this update.
        </small>
      </v-alert>
    </v-card-text>

    <v-card-text v-show="hasRenewalError">
      <v-alert border="left" dense type="warning">
        <small class="d-block mb-1"> Your subscription failed to renew. </small>
        <small class="d-block mb-1">
          The following error occured: {{ renewalError.declineMessage }}
        </small>

        <small class="d-block mb-1">
          Invoice creation time:
          {{ new Date(renewalError.invoiceCreatedAt * 1000).toLocaleString() }}
        </small>

        <small class="d-block mb-1">
          Automatic renewal will occur again at:
          {{ new Date(renewalError.nextRetry * 1000).toLocaleString() }}
        </small>
        <small class="d-block mb-1">
          Please update your card details and try again or wait for automatic renewal.
        </small>

        <v-btn
          class="mt-2"
          small
          @click="retryPayment"
          :loading="subscriptionState.isRetryingPayment"
        >
          Retry payment
        </v-btn>
      </v-alert>
    </v-card-text>
  </div>
</template>

<script>
import axios from "@axios";

import { mdiChevronRight } from "@mdi/js";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "CurrentPlanDetails",
  setup() {
    const {
      state: subscriptionState,
      activePlan,
      subDetails,

      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      renewalError,
      hasRenewalError,

      defaultCardInfo,

      toggleIsRetryingPayment,
    } = useSubscription();

    async function retryPayment() {
      try {
        toggleIsRetryingPayment(true);
        const result = await axios.post("subscriptions/manual-renew");

        await this.$confirm("Payment succeeded! Your subscription will resume shortly", {
          buttonFalseText: "",
          buttonTrueText: "Confirm",
        });

        console.log(result);
      } catch (err) {
        console.log(err.response);
        await this.$confirm("Payment failed", {
          buttonFalseText: "",
          buttonTrueText: "Confirm",
        });
      } finally {
        toggleIsRetryingPayment(false);
      }
    }

    return {
      subscriptionState,
      activePlan,
      subDetails,

      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      renewalError,
      hasRenewalError,
      retryPayment,

      defaultCardInfo,

      icons: {
        mdiChevronRight,
      },
    };
  },
};
</script>

<style></style>
