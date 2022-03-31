<template>
  <div class="navbar__actions">
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
import { useNotifications } from "@/composables/notifications";
import { useRouter } from "@/composables/router";

export default {
  name: "NavbarActions",
  setup() {
    const { state: notificationsState } = useNotifications();
    const { currRouteName } = useRouter();

    const notificationsCount = computed(() => {
      if (!notificationsState.notification.unreadCount) return 0;
      if (currRouteName.value == "inbox") return 0;
      return notificationsState.notification.unreadCount;
    });

    return {
      notificationsCount,
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
