<template>
  <div
    class="navigation"
    :class="menuClass"
  >
    <v-btn
      v-if="breakpoint == 'md'"
      small
      class="navigation__toggle mb-4"
      icon
      @click="setMenuActive(!state.isMenuFixed)"
    >
      <v-icon>{{ state.isMenuFixed ? icons.mdiChevronLeft : icons.mdiChevronRight }}</v-icon>
    </v-btn>

    <ul class="navigation__menu">
      <component
        :is="item.type"
        v-for="(item, idx) in navItems"
        :key="idx"
        :item="item "
      />
    </ul>
  </div>
</template>

<script>
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'
import { onMounted, onUnmounted, computed } from '@vue/composition-api'
import { useNavigation } from '@/composables/navigation'
import navItems from '@/components/layout/navigation/navigation-items'
import NavigationItem from '@/components/layout/navigation/NavigationItem.vue'
import NavigationSubheader from '@/components/layout/navigation/NavigationSubheader.vue'
import { useUser } from '@/composables/user/user'

export default {
  name: 'Navigation',
  components: {
    NavigationItem,
    NavigationSubheader,
  },

  setup() {
    const {
      state, breakpoint, menuClass, setWidth, closeMenu, setHovering, setMenuActive,
    } = useNavigation()

    // const { state: userState } = useUser();

    // const navigationMenuItems = computed(() => {
    //   if (!userState.isPreviewMode) return navItems;
    //   return navItems.filter((item) => item.to != "settings");
    // });

    onMounted(() => window.addEventListener('resize', setWidth))
    onUnmounted(() => window.removeEventListener('resize', setWidth))

    return {
      state,
      breakpoint,
      setMenuActive,
      menuClass,
      setHovering,
      closeMenu,
      navItems,
      icons: {
        mdiChevronRight,
        mdiChevronLeft,
      },
    }
  },
}
</script>

<style lang="scss">
.navigation {
  padding-top: 2rem;
  overflow: hidden;
  background-color: #fff;
  transition: width 0.3s ease-in-out;
}

.navigation-lg {
  position: relative;
  width: 200px;
  min-width: 199px;
}

.navigation-md-collapsed {
  width: 60px;
  min-width: 60px;
}

.navigation-sm-hidden {
  position: absolute;
  width: 0;
  z-index: 9;
  height: 100%;
}

.navigation-sm-active {
  position: absolute;
  height: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  width: 270px;
  z-index: 9;
}

.navigation__menu {
  list-style: none;
  padding: 0px !important;
}

.navigation__toggle {
  padding-left: 22px;
}

.navigation {
  .router-link-active, .navigation__item:hover {
    .navigation__item__text,.v-icon__svg {
        color: white !important;

    }
  }
}
</style>
