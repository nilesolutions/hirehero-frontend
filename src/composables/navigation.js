import { computed, reactive, readonly } from "@vue/composition-api";

const menuOpenDelay = 200;
var menuOpenTimeout;

const state = reactive({
  windowWidth: window.innerWidth,
  isMenuFixed: false,
  isHovering: false,
});

const setWidth = () => {
  if (window.innerWidth < 550 || window.innerWidth > 1200) state.isMenuFixed = false;
  state.windowWidth = window.innerWidth;
};

const setHovering = (val) => {
  if (val == true) {
    menuOpenTimeout = setTimeout(() => {
      state.isHovering = val;
    }, menuOpenDelay);
  } else {
    clearTimeout(menuOpenTimeout);
    state.isHovering = val;
  }
};

const setMenuActive = (val) => state.isMenuFixed = val;

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
  console.log("closing menu");
  if (breakpoint.value == "sm" && state.isMenuFixed) state.isMenuFixed = false;
};

export function useNavigation() {
  return {
    state: readonly(state),
    setWidth,
    setHovering,
    setMenuActive,
    closeMenu,
    menuClass,
    breakpoint,
  };
}
