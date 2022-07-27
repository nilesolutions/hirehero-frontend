import { computed, ref } from '@vue/composition-api'

const route = ref({})

const setRoute = r => (route.value = r)
const routeName = () => route.value.name
const routeParams = () => route.value.params

const currRouteName = computed(() => route.value.name)
const currRouteParams = computed(() => route.value.params)

export function useRouter() {
  return {
    setRoute,
    routeName,
    routeParams,
    currRouteName,
    currRouteParams,
  }
}
