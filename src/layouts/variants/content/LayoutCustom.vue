<template>
  <v-app>
    <navbar></navbar>

    <div class="dashboard--layout">
      <navigation></navigation>
      <slot v-if="!state.isLoading"></slot>
      <div v-else class="p-2">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "@axios";
import Navbar from "@/components/layout/navbar/Navbar.vue";
import Navigation from "@/components/layout/navigation/Navigation.vue";
import { reactive, onMounted, onUnmounted } from "@vue/composition-api";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import { videoCallEvents, notificationEvents } from "@/composables/event-listeners";
import { useNotifications } from "@/composables/notifications";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
  },
  setup() {
    const userId = useUser().userData().id;
    const state = reactive({
      isLoading: true,
    });
    const { setNotification } = useNotifications();
    const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels } = usePusher();

    const videoCallChannel = `presence-video-call-${userId}`;
    const notificationsChannel = `private-notifications-${userId}`;

    async function initApp() {
      try {
        const { data: notifications } = await axios.get("/conversations/notifications");
        console.log("Notifications ", notifications);
        setNotification(notifications);
        subscribeToChannel(videoCallChannel, videoCallEvents);
        subscribeToChannel(notificationsChannel, notificationEvents);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    onMounted(() => initApp());
    onUnmounted(() => {
      unsubscribeFromChannel(videoCallChannel);
      unsubscribeFromChannel(notificationsChannel);
    });

    return {
      state,
    };
  },
};
</script>

<style lang="scss">
.dashboard--layout {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.dashboard__content {
  max-height: 100%;
  padding: 2rem;
  flex-grow: 1;
}
</style>
