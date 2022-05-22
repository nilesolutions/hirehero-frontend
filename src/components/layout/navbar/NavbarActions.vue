<template>
  <div class="navbar__actions" v-show="breakpoint != 'sm'">
    <router-link to="/inbox">
      <v-badge overlap :content="notificationsCount" :value="notificationsCount">
        <v-tooltip bottom color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="inbox-btn" icon outlined elevation="2" v-bind="attrs" v-on="on">
              <v-icon color="primray">{{ icons.mdiMessageOutline }}</v-icon>
            </v-btn>
          </template>
          <span class="tooltip-font">Inbox</span>
        </v-tooltip>
      </v-badge>
    </router-link>
  </div>
</template>

<script>
import { useNotifications } from "@/composables/chat/notifications";
import { useNavigation } from "@/composables/navigation";
import { useRouter } from "@/composables/router";
import { mdiMessageOutline } from "@mdi/js";
import { computed } from "@vue/composition-api";

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
      icons: { mdiMessageOutline },
    };
  },
};
</script>

<style>
.inbox-btn {
  border-color: #293962;
}

.inbox-btn svg,
.inbox-btn {
  color: #293962;
}

.navbar__actions {
  margin-left: auto;
}

.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  opacity: 0;
  transition: all 0.3s linear;
  width: auto;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 15px;
  border-radius: 6px;
  font-size: 12px;
  position: absolute;
  z-index: 1;
  bottom: -30px;
}

.tooltip .tooltiptext::before {
  content: "";
  border: 6px solid transparent;
  border-bottom: 6px solid #000;
  display: block;
  position: absolute;
  top: -12px;
}

.tooltip .tooltiptext::before,
.tooltip .tooltiptext {
  left: 50%;
  transform: translateX(-50%);
}

.tooltip:hover .tooltiptext {
  opacity: 1;
}
</style>
