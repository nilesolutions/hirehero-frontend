<template>
  <div class="col-md-4 col-12">
    <v-card class="d-flex flex-column align-center" elevation="4">
      <v-card-title class="cursive-font plan-card__title">
        {{ plan.name }} {{ isActivePlan ? " (Your Plan)" : "" }}
      </v-card-title>

      <v-card-text class="text-center">{{ planPrice }}</v-card-text>

      <v-card-actions>
        <v-btn
          @click="checkout"
          v-show="showCheckoutBtn"
          :loading="state.isLoading"
          color="primary"
          outlined
          block
        >
          Get it now
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { reactive, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "PlanCard",
  props: { plan: Object },
  setup({ plan }) {
    const { isSubscribed, setClickedPrice, activePlan } = useSubscription();

    const state = reactive({
      isLoading: false,
    });

    const planPrice = computed(() => {
      const price = plan.amount / 100;
      const currency = plan.currency.toUpperCase();
      return `$ ${price} ${currency} / Month`;
    });

    const isActivePlan = computed(() => {
      if (!isSubscribed) return false;
      if (activePlan.value.id == plan.id) return true;
      return false;
    });

    const showCheckoutBtn = computed(() => {
      //if (isSubscribed.value && isActivePlan.value) return true;
      if (isSubscribed.value) return false;
      return true;
    });

    async function checkout() {
      try {
        if (isSubscribed.value) return;

        setClickedPrice(plan.price_id);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,

      isActivePlan,
      showCheckoutBtn,
      planPrice,
      checkout,
    };
  },
};
</script>

<style>
.plan-card__title {
  word-break: break-all;
}
</style>
