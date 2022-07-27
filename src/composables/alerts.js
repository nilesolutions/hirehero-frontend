import { computed, reactive, readonly } from '@vue/composition-api'

const state = reactive({
  alerts: [],
})

const alerts = computed(() => state.alerts)

export function useAlerts() {
  return {
    state: readonly(state),
  }
}
