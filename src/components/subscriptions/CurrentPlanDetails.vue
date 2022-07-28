<template>
  <div>
    <v-card-text class="d-flex flex-row">
      <span class="heading">
        Active Plan:
      </span>

      <span class="ml-auto data">{{ activePlan.name }}</span>
    </v-card-text>

    <v-card-text
      v-show="!isTrialing"
      class="d-flex flex-row"
    >
      <span class="heading">
        Started On :
      </span>
      <span class="ml-auto data">{{ subscriptionStart }}</span>
    </v-card-text>

    <v-card-text
      v-show="!isTrialing"
      class="d-flex flex-row"
    >
      <span class="heading">
        Ends On :
      </span>
      <span class="ml-auto data">{{ subscriptionEnd }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      <span class="heading">
        Status :
      </span>
      <span class="ml-auto text-capitalize data">{{ subDetails.status.replaceAll("_", " ") }}</span>
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      <span class="heading">
        Payment Card :
      </span>
      <span class="ml-auto text-capitalize data">{{ defaultCardInfo }}</span>
    </v-card-text>

    <v-card-text v-show="updatePlanInfo">
      <v-alert
        border="left"
        dense
        type="info"
      >
        <small>
          Your plan will change to <span class="text-capitalize">{{ updatePlanInfo }}</span> at the
          end of your current billing period.
          <br>
          Head to manage plan to cancel this update.
        </small>
      </v-alert>
    </v-card-text>

    <v-card-text v-show="isTrialing">
      <v-alert
        border="left"
        dense
        type="info"
      >
        <small>
          You are on free trial from
          <span>{{ new Date(trialStatus.trialStart * 1000).toLocaleDateString() }}</span> to
          <span>{{ new Date(trialStatus.trialEnd * 1000).toLocaleDateString() }}</span>
          <br>
          You will be billed after the free trial ends for the amount of your current plan<br>
        </small>
      </v-alert>
    </v-card-text>

    <v-card-text v-show="hasRenewalError">
      <v-alert
        border="left"
        dense
        type="warning"
      >
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
          :loading="subscriptionState.isRetryingPayment"
          @click="retryPayment"
        >
          Retry payment
        </v-btn>
      </v-alert>
    </v-card-text>
  </div>
</template>

<script>
import axios from '@axios'

import { mdiChevronRight } from '@mdi/js'
import { useSubscription } from '@/composables/user/subscription'

export default {
  name: 'CurrentPlanDetails',
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

      isTrialing,
      trialStatus,

      defaultCardInfo,

      toggleIsRetryingPayment,
    } = useSubscription()

    async function retryPayment() {
      try {
        toggleIsRetryingPayment(true)
        const result = await axios.post('subscriptions/manual-renew')

        await this.$confirm('Payment succeeded! Your subscription will resume shortly', {
          buttonFalseText: '',
          buttonTrueText: 'Confirm',
        })

        console.log(result)
      } catch (err) {
        console.log(err.response)
        await this.$confirm('Payment failed', {
          buttonFalseText: '',
          buttonTrueText: 'Confirm',
        })
      } finally {
        toggleIsRetryingPayment(false)
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

      isTrialing,
      trialStatus,

      defaultCardInfo,

      icons: {
        mdiChevronRight,
      },
    }
  },
}
</script>

<style scoped>
.heading{
  font-weight: 700;
  font-size: 16px;
}
.data{
  font-size: 16px;
}
@media (max-width:767px) {
  .heading{
  font-weight: 800;
  font-size: 16px;
}
}
</style>
