<template>
  <div class="col-md-6 col-12">
    <v-card class="d-flex flex-column align-center">
      <v-card-title class="cursive-font">{{ plan.name }}</v-card-title>

      <v-card-text class="text-center">{{ planPrice }}</v-card-text>

      <v-card-actions>
        <v-btn
          @click="checkout"
          v-show="showCheckoutBtn"
          :loading="state.isLoading"
          color="success"
          outlined
          block
        >
          {{ isActivePlan ? "Your plan" : "Get it now" }}
        </v-btn>
      </v-card-actions>

      <a ref="checkoutLink" href="" target="_blank" style="display: none"></a>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { ref, reactive, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/subscription";

export default {
  name: "PlanCard",
  props: { plan: Object },
  setup({ plan }) {
    const { isSubscribed, state: subscriptionState } = useSubscription();
    const state = reactive({
      isLoading: false,
    });
    const checkoutLink = ref(null);

    const planPrice = computed(() => {
      const price = plan.amount / 100;
      const currency = plan.currency.toUpperCase();
      return `$ ${price} ${currency} / Month`;
    });

    const isActivePlan = computed(() => {
      if (!isSubscribed) return false;
      if (subscriptionState.activePlan.id == plan.id) return true;
      return false;
    });

    const showCheckoutBtn = computed(() => {
      if (isSubscribed.value && isActivePlan.value) return true;
      if (isSubscribed.value) return false;
      return true;
    });

    async function checkout() {
      try {
        if (isSubscribed.value) return;
        state.isLoading = true;
        const { data: checkoutSession } = await axios.post("/subscriptions", {
          priceId: plan.price_id,
        });

        checkoutLink.value.setAttribute("href", checkoutSession.url);
        checkoutLink.value.click();
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      checkoutLink,

      isSubscribed,
      isActivePlan,
      showCheckoutBtn,

      planPrice,
      checkout,
    };
  },
};
</script>

<style></style>
