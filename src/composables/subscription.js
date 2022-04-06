import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  activePlan: {},
});

const setActivePlan = (val) => (state.activePlan = val);

const isSubscribed = computed(() => {
  if (!Object.keys(state.activePlan).length) return false;
  return true;
});

export function useSubscription() {
  return {
    state: readonly(state),

    setActivePlan,

    isSubscribed,
  };
}
