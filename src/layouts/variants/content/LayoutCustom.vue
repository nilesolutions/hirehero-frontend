<template>
  <v-app>
    <navbar></navbar>

    <div class="dashboard--layout">
      <video-call-prompt></video-call-prompt>
      <video-call></video-call>

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
import VideoCall from "@/components/videocall/VideoCall.vue";
import VideoCallPrompt from "@/components/videocall/VideoCallPrompt.vue";

import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import { useNotifications } from "@/composables/notifications";
import { useMessages } from "@/composables/messages";

import { reactive, onMounted, onUnmounted } from "@vue/composition-api";
import {
  videoCallEvents,
  videoCallPresenceEvents,
  notificationEvents,
} from "@/composables/event-listeners";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
    VideoCall,
    VideoCallPrompt,
  },
  setup() {
    //const userId = useUser().userData().id;
    const state = reactive({
      isLoading: true,
    });

    const { setUserData } = useUser();
    const { setNotification } = useNotifications();
    const { setAssociatedUser, associatedUser } = useMessages();
    const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels } = usePusher();

    var videoCallChannel = `presence-video-call-`;
    var notificationsChannel = `private-notifications-`;

    async function initApp() {
      try {
        const { data: userData } = await axios.get("/users/me");
        const { data: fetchedAssocUser } = await axios.get("/users/associate");
        const { data: notifications } = await axios.get("/conversations/notifications");

        setUserData(userData);
        setAssociatedUser(fetchedAssocUser);
        setNotification(notifications);

        videoCallChannel += userData.id;
        notificationsChannel += userData.id;

        subscribeToChannel(videoCallChannel, videoCallEvents);
        subscribeToChannel(notificationsChannel, notificationEvents);

        if (associatedUser) {
          subscribeToChannel(`presence-video-call-${associatedUser.value.id}`, [
            ...videoCallPresenceEvents,
            ...videoCallEvents,
          ]);
        }
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
