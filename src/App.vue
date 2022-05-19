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

<script>
// eslint-disable-next-line object-curly-newline
import { computed, onMounted, onUnmounted } from "@vue/composition-api";
// eslint-disable-next-line import/no-unresolved
import useAppConfig from "@core/@app-config/useAppConfig";
import { useRouter } from "@core/utils";
import { useLayout } from "@core/layouts/composable/useLayout";
import { useUser } from "./composables/user/user";

// Layouts
import LayoutContentVerticalNav from "@/layouts/variants/content/vertical-nav/LayoutContentVerticalNav.vue";
import LayoutContentHorizontalNav from "@/layouts/variants/content/horizontal-nav/LayoutContentHorizontalNav.vue";
import LayoutBlank from "@/layouts/variants/blank/LayoutBlank.vue";
import LayoutCustom from "@/layouts/variants/content/LayoutCustom.vue";

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
        console.log("Recieved event", event);
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
