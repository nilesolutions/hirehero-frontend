<template>
  <!-- If url contains client secret, show the appropriate message before loading app -->
  <!-- Message will contain status about the most recent payment/card update -->
  <div v-if="state.hasSubNotification">
    <v-app>
      <subscription-notification-message
        @close="closeSubNotification"
      ></subscription-notification-message
    ></v-app>
  </div>
  <v-app v-else>
    <navbar></navbar>
    <v-alert
      v-if="state.isInfoVisible && infoMsg && !state.isLoading"
      color="primary"
      class="mb-0"
      rounded="0"
      type="info"
      dismissible
    >
      {{ infoMsg }}
    </v-alert>
    <v-alert v-if="userState.isPreviewMode" color="primary" class="mb-0" rounded="0" type="info">
      You are currently previewing the website as {{ userName }}. <br />
      Any changes done will be saved.
    </v-alert>

    <div class="dashboard--layout">
      <video-call-prompt></video-call-prompt>
      <video-call></video-call>

      <navigation></navigation>

      <div v-if="state.isLoading" class="ml-auto mr-auto mt-6">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </div>
      <subscription-paywall v-else-if="showSubPaywall"></subscription-paywall>
      <slot v-else> </slot>
    </div>
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/navbar/Navbar.vue";
import VideoCall from "@/components/videocall/VideoCall.vue";
import Navigation from "@/components/layout/navigation/Navigation.vue";
import VideoCallPrompt from "@/components/videocall/VideoCallPrompt.vue";
import SubscriptionPaywall from "@/components/subscriptions/SubscriptionPaywall.vue";
import SubscriptionNotificationMessage from "@/components/subscriptions/SubscriptionNotificationMessage.vue";

import { useRouter } from "@/@core/utils";
import { usePusher } from "@/composables/pusher";
import { useMessages } from "@/composables/chat/messages";
import { useSubscription } from "@/composables/user/subscription";
import { useNotifications } from "@/composables/chat/notifications";
import { useUser } from "@/composables/user/user";
import {
  notificationEvents,
  subscriptionEvents,
  videoCallEvents,
  videoCallPresenceEvents,
} from "@/composables/event-listeners";

import axios from "@axios";
import { mdiClose } from "@mdi/js";
import { computed, onMounted, onUnmounted, reactive } from "@vue/composition-api";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
    VideoCall,
    VideoCallPrompt,
    SubscriptionNotificationMessage,
    SubscriptionPaywall,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      isInfoVisible: true,
      hasSubNotification: true,
    });

    const { setSubInfo, isSubscribed } = useSubscription();
    const { state: userState, userName, userType, setUserData } = useUser();
    const { setNotification } = useNotifications();
    const { setAssociatedUser, associatedUser } = useMessages();
    const { subscribeToChannel, unsubscribeFromChannel } = usePusher();
    const { route } = useRouter();

    var videoCallChannel = `presence-video-call-`;
    var notificationsChannel = `private-notifications-`;
    var privateUserChannel = `private-user-`;

    async function initApp() {
      try {
        state.isLoading = true;
        const [user, associate, notifications, sub] = await Promise.all([
          axios.get("/users/me"),
          axios.get("/users/associate"),
          axios.get("/conversations/notifications"),
          axios.get("/subscriptions/"),
        ]);

        setUserData(user.data);
        setAssociatedUser(associate.data);
        setNotification(notifications.data);
        setSubInfo(sub.data);

        videoCallChannel += user.data.id;
        privateUserChannel += user.data.id;
        notificationsChannel += user.data.id;

        subscribeToChannel(videoCallChannel, videoCallEvents);
        subscribeToChannel(privateUserChannel, subscriptionEvents);
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

    onMounted(() => {
      const searchParams = new URLSearchParams(window.location.search);

      if (
        !searchParams.get("payment_intent_client_secret") &&
        !searchParams.get("setup_intent_client_secret")
      )
        closeSubNotification();
    });

    function closeSubNotification() {
      state.hasSubNotification = false;
      initApp();
    }

    onUnmounted(() => {
      unsubscribeFromChannel(videoCallChannel);
      unsubscribeFromChannel(privateUserChannel);
      unsubscribeFromChannel(notificationsChannel);
    });

    const showSubPaywall = computed(() => {
      if (userType.value == "va") return false;

      if (!isSubscribed.value && route.value.name != "settings") return true;
      return false;
    });

    const infoMsg = computed(() => {
      var msg = [];

      if (!associatedUser.value) {
        if (userType.value == "client") msg.push("No VA Assigned");
        else msg.push("No Client Assigned");
      }
      if (!isSubscribed.value && userType.value == "client")
        msg.push("You are not subscribed to a plan");

      if (msg.length) return msg.join(" | ");
      return "";
    });

    return {
      state,
      infoMsg,
      showSubPaywall,
      closeSubNotification,
      userName,
      userState,

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
  background-color: #f34c57;
}

@media (max-width: 768px) {
  .dashboard__content {
    padding: 0.5rem 1rem;
  }
}
</style>
