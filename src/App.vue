<template>
  <component
    v-if="!userState.isSettingUpPreview"
    :is="resolveLayoutVariant"
    :class="`skin-variant--${appSkinVariant}`"
  >
    <transition :name="appRouteTransition" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </component>
  <div class="d-flex" v-else>
    <v-progress-circular class="my-4 mx-auto" color="primary" indeterminate></v-progress-circular>
  </div>
</template>
<style lang="scss">
.close-icon-absolute {
  position: absolute;
  top: 10px;
  right: 10px;
}

.v-btn--tile {
  border-radius: 5px !important;
}

.theme--light.v-btn.v-btn--has-bg.v-btn--is-elevated:not(.info):not(.primary):not(.no-hover):not(.toggle-task-btn.incomplete) {
  background: #f5f5f5;
}

.v-dialog {
  .v-btn.grey--text {
    align-items: center;
    border-radius: 5px;
    display: inline-flex;
    flex: 0 0 auto;
    font-weight: 500;
    letter-spacing: 0.01875rem;
    justify-content: center;
    outline: 0;
    position: relative;
    text-decoration: none;
    text-indent: 0.01875rem;
    text-transform: uppercase;
    transition-duration: 0.28s;
    transition-property: box-shadow, transform, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    box-shadow: 0 4px 8px -4px rgba(94, 86, 105, 0.42) !important;
    background: #f5f5f5;

    &:hover {
      box-shadow: 0 6px 18px -8px rgba(94, 86, 105, 0.56) !important;
    }
  }

  .v-btn.primary--text {
    background-color: rgb(243, 76, 87) !important;
    border-bottom-color: rgb(243, 76, 87) !important;
    box-shadow: 0 4px 8px -4px rgba(94, 86, 105, 0.42) !important;

    .v-btn__content {
      color: white !important;
    }

    &:hover {
      box-shadow: 0 6px 18px -8px rgba(94, 86, 105, 0.56) !important;
    }
  }
}

.theme--light.v-btn.v-btn--has-bg.v-btn--is-elevated:not(.info):not(.primary):not(.no-hover):not(.toggle-task-btn.incomplete):hover,
.v-btn--icon:hover,
.v-dialog .grey--text:hover {
  background: rgba(235, 87, 87, 0.2) !important;
}
</style>
<script>
// eslint-disable-next-line object-curly-newline
import { computed, onMounted } from "@vue/composition-api";
// eslint-disable-next-line import/no-unresolved
import useAppConfig from "@core/@app-config/useAppConfig";
import { useLayout } from "@core/layouts/composable/useLayout";
import { useRouter } from "@core/utils";
import { useUser } from "./composables/user/user";

// Layouts
import LayoutBlank from "@/layouts/variants/blank/LayoutBlank.vue";
import LayoutContentHorizontalNav from "@/layouts/variants/content/horizontal-nav/LayoutContentHorizontalNav.vue";
import LayoutCustom from "@/layouts/variants/content/LayoutCustom.vue";
import LayoutContentVerticalNav from "@/layouts/variants/content/vertical-nav/LayoutContentVerticalNav.vue";

// Dynamic vh
import useDynamicVh from "@core/utils/useDynamicVh";
import { usePusher } from "./composables/pusher";

import router from "@/router";

export default {
  components: {
    LayoutContentVerticalNav,
    LayoutContentHorizontalNav,
    LayoutBlank,
    LayoutCustom,
  },
  setup() {
    const { route } = useRouter();
    const { updateAuthCreds } = usePusher();
    const { state: userState, togglePreviewMode, toggleIsSettingUpPreview } = useUser();
    const { appContentLayoutNav, appSkinVariant, appRouteTransition } = useAppConfig();

    const { handleBreakpointLayoutSwitch } = useLayout();
    handleBreakpointLayoutSwitch();

    const resolveLayoutVariant = computed(() => {
      if (route.value.meta.layout === "blank") return "layout-blank";
      if (route.value.meta.layout === "content")
        return `layout-content-${appContentLayoutNav.value}-nav`;
      if (route.value.meta.layout === "custom") return "layout-custom";
      return null;
    });

    onMounted(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessMode = searchParams.get("accessMode");

      if (accessMode && accessMode == "preview") setupPreviewMode();
    });

    function setupPreviewMode() {
      toggleIsSettingUpPreview(true);
      togglePreviewMode(true);

      window.addEventListener("message", (event) => {
        if (event.origin == process.env.VUE_APP_ADMIN_DASHBOARD_URL) {
          const previewCreds = event.data;
          sessionStorage.setItem("accessToken", previewCreds.accessToken);
          sessionStorage.setItem("userData", JSON.stringify(previewCreds.userData));
          updateAuthCreds();
          router.push({ name: "dashboard" });
          toggleIsSettingUpPreview(false);
        }
      });
    }

    useDynamicVh();

    return {
      userState,
      resolveLayoutVariant,
      appSkinVariant,
      appRouteTransition,
    };
  },
};
</script>
