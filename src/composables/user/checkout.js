import { computed, reactive, readonly } from "@vue/composition-api";
import { useSubscription } from "./subscription";

const { plans } = useSubscription();

const state = reactive({
  clickedPrice: "",
  appliedCoupon: {},
  isSubmitting: false,
  isBillingLoading: false,
  step: 1,
});

const setClickedPrice = (val) => (state.clickedPrice = val);
const setAppliedCoupon = (val) => (state.appliedCoupon = val);
const toggleIsSubmitting = (val) => (state.isSubmitting = val);
const toggleIsBillingLoading = (val) => (state.isBillingLoading = val);
const setActiveStep = (val) => (state.step = val);

function resetCheckoutState() {
  state.clickedPrice = "";
  state.appliedCoupon = {};
  state.step = 1;
}

const isCheckingOut = computed(() => {
  if (state.clickedPrice) return true;
  return false;
});

const checkoutPlan = computed(() => {
  if (!state.clickedPrice) return {};
  return plans.value.find((plan) => plan.price_id == state.clickedPrice);
});

const isCouponApplied = computed(() => {
  if (Object.keys(state.appliedCoupon).length) return true;
  return false;
});

const appliedCoupon = computed(() => state.appliedCoupon);

export function useCheckout() {
  return {
    state: readonly(state),
    appliedCoupon,

    setClickedPrice,
    setAppliedCoupon,
    setActiveStep,
    toggleIsSubmitting,
    toggleIsBillingLoading,

    isCheckingOut,
    isCouponApplied,

    checkoutPlan,

    resetCheckoutState,
  };
}
