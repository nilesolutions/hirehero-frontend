import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  activePlan: {},
  clickedPrice: "",
  statusMsg: "",
  plans: [],
});

const setActivePlan = (val) => (state.activePlan = val);
const setClickedPrice = (val) => (state.clickedPrice = val);
const setPlans = (val) => (state.plans = val);
const setStatusMsg = (val) => (state.statusMsg = val);

const plans = computed(() => state.plans);

const isSubscribed = computed(() => {
  if (!Object.keys(state.activePlan).length) return false;
  return true;
});

const isStatusOverlayActive = computed(() => {
  if (state.statusMsg) return true;
  return false;
});

const isCheckingOut = computed(() => {
  if (state.clickedPrice) return true;
  return false;
});

const checkoutPlan = computed(() => {
  if (!state.clickedPrice) return {};
  return state.plans.find((plan) => plan.price_id == state.clickedPrice);
});

export function useSubscription() {
  return {
    state: readonly(state),
    plans,

    setActivePlan,
    setClickedPrice,
    setPlans,
    setStatusMsg,

    isSubscribed,
    isCheckingOut,
    isStatusOverlayActive,
    checkoutPlan,
  };
}
