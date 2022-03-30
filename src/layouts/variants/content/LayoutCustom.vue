<template>
  <v-app>
    <navbar></navbar>

    <div class="dashboard--layout">
      <navigation></navigation>
      <slot></slot>
    </div>
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/navbar/Navbar.vue";
import Navigation from "@/components/layout/navigation/Navigation.vue";
import { onMounted, onUnmounted } from "@vue/composition-api";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import { videoCallEvents, notificationEvents } from "@/components/inbox/event-listeners";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
  },
  setup() {
    const userId = useUser().userData().id;
    const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels } = usePusher();

    const videoCallChannel = `presence-video-call-${userId}`;
    const notificationsChannel = `private-notifications-${userId}`;

    onMounted(() => {
      subscribeToChannel(videoCallChannel, videoCallEvents);
      subscribeToChannel(notificationsChannel, notificationEvents);
      debugActiveChannels("From Layout");
    });

    onUnmounted(() => {
      unsubscribeFromChannel(videoCallChannel);
      unsubscribeFromChannel(notificationsChannel);
    });
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
