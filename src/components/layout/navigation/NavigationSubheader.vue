<template>
  <div>
    <v-fade-transition
      v-if="isDividerRendered"
      hide-on-leave
    >
      <div class="navigation__subdivider" />
    </v-fade-transition>
    <v-fade-transition
      v-else
      hide-on-leave
    >
      <small class="navigation__subheader bold-sub-heaing">{{ item.subheader }}</small>
    </v-fade-transition>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { useNavigation } from '@/composables/navigation'

export default {
  name: 'NavigationSubheader',
  props: { item: Object },
  setup() {
    const { breakpoint, state: menuState } = useNavigation()

    const isDividerRendered = computed(() => {
      if (breakpoint.value == 'md' && !menuState.isMenuFixed && !menuState.isHovering) return true
      return false
    })

    return {
      isDividerRendered,
    }
  },
}
</script>

<style lang="scss">
.navigation__subheader {
  display: block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #0c77f8;
  padding-left: 22px;
}

.navigation__subdivider {
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;
  height: 1px;
  border: 1px solid #dadada;
}

.navigation__subdivider:first-of-type,
.navigation__subheader:first-of-type {
  margin-top: 0.5rem;
}
.bold-sub-heaing{
  font-weight: 600;
  letter-spacing: 0.06rem;
}
</style>
