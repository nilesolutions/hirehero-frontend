<template>
  <div
    class="navigation"
    :class="menuClass"
    @mouseover="state.isHovering = true"
    @mouseleave="state.isHovering = false"
    v-click-outside="closeMenu"
  >
    <div class="ml-auto mb-5" v-if="breakpoint == 'md'">
      <v-btn @click="state.isMenuFixed = !state.isMenuFixed">Fix</v-btn>
    </div>

    <ul class="navigation__menu">
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <small class="navigation__subheader">Workspace</small>
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <small class="navigation__subheader">General</small>
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mdiChat, mdiCalendar, mdiChartArc } from "@mdi/js";
import { reactive, computed, onMounted, onUnmounted } from "@vue/composition-api";

export default {
  name: "Navigation",

  setup() {
    const state = reactive({
      windowWidth: window.innerWidth,
      isMenuFixed: false,
      isHovering: false,
    });

    const onWidthChange = () => {
      if (window.innerWidth < 550 || window.innerWidth > 1200) state.isMenuFixed = false;
      state.windowWidth = window.innerWidth;
    };
    onMounted(() => window.addEventListener("resize", onWidthChange));
    onUnmounted(() => window.removeEventListener("resize", onWidthChange));

    const breakpoint = computed(() => {
      if (state.windowWidth < 550) {
        return "sm";
      }
      if (state.windowWidth >= 550 && state.windowWidth < 1200) return "md";
      if (state.windowWidth >= 1200) return "lg";
      return null;
    });

    const menuClass = computed(() => {
      if (breakpoint.value == "lg") return "navigation-lg";
      if (breakpoint.value == "md") {
        if (state.isMenuFixed || state.isHovering) return "navigation-lg";
        return "navigation-md-collapsed";
      }
      if (breakpoint.value == "sm") {
        if (state.isMenuFixed) return "navigation-sm-active";
        return "navigation-sm-hidden";
      }
    });

    const closeMenu = () => {
      if (breakpoint.value == "sm" && state.isMenuFixed) state.isMenuFixed = false;
    };

    return {
      state,
      breakpoint,
      menuClass,
      closeMenu,
      icons: { mdiChat, mdiCalendar, mdiChartArc },
    };
  },
};
</script>

<style lang="scss">
.navigation {
  padding-top: 2rem;
  overflow: hidden;
  background-color: #f2f2f2;
  transition: width 0.3s ease-in-out;
}

.navigation-lg {
  position: relative;
  width: 200px;
}

.navigation-md-collapsed {
  width: 60px;
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
  width: 200px;
  z-index: 9;
}

.navigation__subheader {
  display: block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #0c77f8;
}

.navigation__menu {
  list-style: none;
}

.navigation__item {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.navigation__item__icon {
  color: #000;
}

.navigation__item__text {
  margin-left: 1rem;
}
</style>
