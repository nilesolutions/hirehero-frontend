<template>
  <div class="navbar__actions" v-show="breakpoint != 'sm'">
    <router-link to="/inbox">
      <v-badge overlap :content="notificationsCount" :value="notificationsCount">
        <v-btn icon outlined elevation="2">
          <v-icon color="primray">{{ icons.mdiBellOutline }}</v-icon>
        </v-btn>
      </v-badge>
    </router-link>
  </div>
</template>

<script>
import { mdiBellOutline } from "@mdi/js";
import { computed } from "@vue/composition-api";
import { useNotifications } from "@/composables/chat/notifications";
import { useRouter } from "@/composables/router";
import { useNavigation } from "@/composables/navigation";

export default {
  name: "NavbarActions",
  setup() {
    const { breakpoint } = useNavigation();
    const { state: notificationsState } = useNotifications();
    const { currRouteName } = useRouter();

    const notificationsCount = computed(() => {
      if (!notificationsState.notification.unreadCount) return 0;
      if (currRouteName.value == "inbox") return 0;
      return notificationsState.notification.unreadCount;
    });

    return {
      notificationsCount,
      breakpoint,
      icons: { mdiBellOutline },
    };
  },
};
</script>

<style>
.navbar__actions {
  margin-left: auto;
}
</style>
