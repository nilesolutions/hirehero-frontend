<template>
  <div>
    <v-btn class="d-block mb-2" small elevation="0" @click="toggleActivePlanUpdate(true)">
      <b>
        Manage plan <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn
      v-if="hasPaymentMethodAttached"
      class="d-block mb-2"
      small
      elevation="0"
      @click="removeCard"
    >
      <b>
        Remove card <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn class="d-block mb-2" small elevation="0" @click="togglePaymentMethodUpdate(true)">
      <b>
        Update payment method <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>

    <v-btn @click="cancelSubscription" small elevation="0">
      <b>
        Cancel subscription <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </b>
    </v-btn>
  </div>
</template>

<script>
import axios from "@axios";

import { reactive } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

import { mdiChevronRight } from "@mdi/js";

export default {
  name: "CurrentPlanControls",
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
    } = useSubscription();

    const state = reactive({
      isCancelOpen: false,
      isCancelling: false,
      isLoading: false,
    });

    async function cancelSubscription() {
      const confirm = await this.$confirm(
        "Are you sure you want to cancel your plan ? This action can not be undone",
        { title: "Warning" }
      );

      if (!confirm) return;

      try {
        state.isCancelling = true;
        await axios.delete("/subscriptions");
        setSubInfo({});
      } catch (err) {
        console.log(err);
      } finally {
        state.isCancelOpen = false;
        state.isCancelling = false;
      }
    }

    async function removeCard() {
      try {
        const confirm = await this.$confirm(
          "Are you sure you want to remove your card ? This will cause future payments to fail."
        );
        if (!confirm) return;

        toggleIsRemovingCard(true);
        await axios.post("/payment-methods/remove-default");
        setPaymentMethod({});
        this.$confirm("Credit card removed successfully", {
          buttonFalseText: "",
          buttonTrueText: "Confirm",
        });
      } catch (err) {
        this.$confirm("Error occured while removing card", {
          buttonFalseText: "",
          buttonTrueText: "Confirm",
        });
        console.log(err);
      } finally {
        toggleIsRemovingCard(false);
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
    };
  },
};
</script>

<style></style>
