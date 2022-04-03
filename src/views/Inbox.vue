<template>
  <div class="dashboard__content">
    <h2 class="d-flex flex-row align-center black--text mb-2">
      <span class="cursive-font">Inbox</span>
    </h2>
    <div v-show="!state.isLoading && !activeConversation"></div>
    <div class="d-flex flex-row flex-wrap" v-if="!state.isLoading">
      <inbox-messages></inbox-messages>
      <online-users></online-users>
    </div>
    <div v-else>
      <v-progress-circular></v-progress-circular>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiCamera } from "@mdi/js";
import OnlineUsers from "@/components/inbox/OnlineUsers.vue";
import InboxMessages from "@/components/inbox/InboxMessages.vue";
import StartVideoCall from "@/components/inbox/StartVideoCall.vue";
import { useMessages } from "@/composables/messages";
import { onMounted, onUnmounted, reactive } from "@vue/composition-api";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import {
  conversationEvents,
  videoCallPresenceEvents,
  videoCallEvents,
} from "@/composables/event-listeners";
import { useNotifications } from "@/composables/notifications";

export default {
  name: "Inbox",
  components: {
    OnlineUsers,
    InboxMessages,
    StartVideoCall,
  },
  setup() {
    const { setNotification } = useNotifications();
    const { setConversation, setAssociatedUser, activeConversation, associatedUser } =
      useMessages();
    const { subscribeToChannel, unsubscribeFromChannel } = usePusher();

    const state = reactive({
      isLoading: true,
    });

    const userType = useUser().userType();
    const userId = useUser().userData().id;

    onMounted(() => initInbox());
    onUnmounted(() => clearNotifications());

    async function initInbox() {
      try {
        state.isLoading = true;
        const { data: fetchedConversation } = await axios.get("/conversations");
        const { data: fetchedAssocUser } = await axios.get("/users/associate");

        setConversation(fetchedConversation);
        setAssociatedUser(fetchedAssocUser);

        if (userType == "va" && !activeConversation) {
          subscribeToChannel(`priavte-conversation-${userId}`, conversationEvents);
        }
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    async function clearNotifications() {
      try {
        axios.delete("/conversations/notifications");
        setNotification({
          unreadCount: 0,
          earliestUnread: null,
        });
      } catch (err) {}
    }

    onUnmounted(() => {
      unsubscribeFromChannel(`priavte-conversation-${userId}`);
      unsubscribeFromChannel(`presence-video-call-${associatedUser.value.id}`);
    });

    return {
      state,
      activeConversation,

      icons: {
        mdiCamera,
      },
    };
  },
};
</script>

<style></style>
