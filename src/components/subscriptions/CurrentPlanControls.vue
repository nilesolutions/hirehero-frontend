<template>
  <div class="py-4">
    <v-btn
      class="d-block mb-2 "
      elevation="0"
      @click="toggleActivePlanUpdate(true)"
    >
      <b class="heading-size">
        Manage plan
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn
      v-if="hasPaymentMethodAttached"
      class="d-block mb-2"
      small
      elevation="0"
      @click="removeCard"
    >
      <b class="heading-size">
        Remove card
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn
      class="d-block mb-2"
      elevation="0"
      @click="togglePaymentMethodUpdate(true)"
    >
      <b class="heading-size">
        Update payment method
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn
      elevation="0"
      @click="cancelSubscription"
    >
      <b class="heading-size">
        Cancel subscription
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>
  </div>
</template>

<script>
import axios from '@axios'

import { reactive } from '@vue/composition-api'
import { mdiChevronRight } from '@mdi/js'
import { useSubscription } from '@/composables/user/subscription'

export default {
  name: 'CurrentPlanControls',
  setup() {
    const {
      isSubscribed,
      setSubInfo,
      activePlan,
      toggleActivePlanUpdate,

      subDetails,
      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      renewalError,

      defaultCardInfo,
      setPaymentMethod,
      togglePaymentMethodUpdate,
      toggleIsRemovingCard,
      hasPaymentMethodAttached,
    } = useSubscription()

    const state = reactive({
      isCancelOpen: false,
      isCancelling: false,
      isLoading: false,
    })

    async function cancelSubscription() {
      const confirm = await this.$confirm(
        'Are you sure you want to cancel your plan?<br> This action can not be undone!',
        { title: 'Warning' },
      )

      if (!confirm) return

      try {
        state.isCancelling = true
        await axios.delete('/subscriptions')
        setSubInfo({})
      } catch (err) {
        console.log(err)
      } finally {
        state.isCancelOpen = false
        state.isCancelling = false
      }
    }

    async function removeCard() {
      try {
        const confirm = await this.$confirm(
          'Are you sure you want to remove your card?<br> This will cause future payments to fail.',
          {
            buttonFalseText: 'Cancel',
            buttonTrueText: 'Remove Card',
          },
        )
        if (!confirm) return

        toggleIsRemovingCard(true)
        await axios.post('/payment-methods/remove-default')
        setPaymentMethod({})
        this.$confirm('Credit card removed successfully', {
          buttonFalseText: '',
          buttonTrueText: 'Confirm',
        })
      } catch (err) {
        this.$confirm('Error occured while removing card', {
          buttonFalseText: '',
          buttonTrueText: 'Confirm',
        })
        console.log(err)
      } finally {
        toggleIsRemovingCard(false)
      }
    }

    return {
      state,
      activePlan,
      subDetails,
      toggleActivePlanUpdate,

      isSubscribed,
      subscriptionStart,
      subscriptionEnd,
      updatePlanInfo,

      renewalError,

      defaultCardInfo,
      removeCard,

      cancelSubscription,
      togglePaymentMethodUpdate,
      hasPaymentMethodAttached,

      icons: {
        mdiChevronRight,
      },
    }
  },
}
</script>

<style>

@media (max-width:767px) {
  .heading-size{
  font-size: 16px !important;
}
}

</style>
