<template>
  <v-app>
    <navbar></navbar>
    <div class="info-bar" v-if="state.isInfoVisible && infoMsg">
      {{ infoMsg }}
      <v-btn class="ml-auto" x-small icon @click="state.isInfoVisible = false">
        <v-icon x-small color="white">
          {{ icons.mdiClose }}
        </v-icon>
      </v-btn>
    </div>

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
import Navbar from "@/components/layout/navbar/Navbar.vue";
import Navigation from "@/components/layout/navigation/Navigation.vue";
import VideoCall from "@/components/videocall/VideoCall.vue";
import VideoCallPrompt from "@/components/videocall/VideoCallPrompt.vue";

import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import { useNotifications } from "@/composables/notifications";
import { useMessages } from "@/composables/messages";
import { useSubscription } from "@/composables/subscription";
import {
  videoCallEvents,
  videoCallPresenceEvents,
  notificationEvents,
} from "@/composables/event-listeners";

import axios from "@axios";
import { mdiClose } from "@mdi/js";
import { reactive, onMounted, onUnmounted, computed } from "@vue/composition-api";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
    VideoCall,
    VideoCallPrompt,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      isInfoVisible: true,
    });

    const { setActivePlan, isSubscribed } = useSubscription();
    const { userType, setUserData } = useUser();
    const { setNotification } = useNotifications();
    const { setAssociatedUser, associatedUser } = useMessages();
    const { subscribeToChannel, unsubscribeFromChannel } = usePusher();

    var videoCallChannel = `presence-video-call-`;
    var notificationsChannel = `private-notifications-`;

    async function initApp() {
      try {
        const { data: userData } = await axios.get("/users/me");
        const { data: fetchedAssocUser } = await axios.get("/users/associate");
        const { data: notifications } = await axios.get("/conversations/notifications");
        const { data: activePlan } = await axios.get("/subscriptions/");

        setUserData(userData);
        setAssociatedUser(fetchedAssocUser);
        setNotification(notifications);
        setActivePlan(activePlan);

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

    const infoMsg = computed(() => {
      var msg = [];

      if (!associatedUser.value) {
        if (userType.value == "client") msg.push("No VA Assigned");
        else msg.push("No Client Assigned");
      }
      if (!isSubscribed.value) msg.push("You are not subscribed to a plan");

      if (msg.length) return msg.join(" | ");
      return "";
    });

    return {
      state,
      infoMsg,

      icons: {
        mdiClose,
      },
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

.info-bar {
  display: flex;
  flex-direction: row;
  padding: 0.5rem 2rem;
  border-bottom: 1px solid;
  color: white;
  background-color: #4895d8bb;
}
</style>
