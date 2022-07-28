import { computed, reactive, readonly } from '@vue/composition-api'

const state = reactive({
  clickedActivityId: '',
})

const setClickedActivityId = val => (state.clickedActivityId = val)

const isDetailsOpen = computed(() => {
  if (state.clickedActivityId) return true
  return false
})

export function useActivity() {
  return {
    state: readonly(state),
    isDetailsOpen,
    setClickedActivityId,
  }
}
