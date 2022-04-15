<template>
  <div class="dashboard__content">
    <h2 class="d-flex flex-row align-center black--text mb-2">
      <span class="cursive-font">Inbox</span>
    </h2>
    <div class="d-flex flex-row flex-wrap" v-if="!state.isLoading && associatedUser">
      <inbox-messages></inbox-messages>
      <online-users></online-users>
    </div>
    <div v-else-if="state.isLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>No {{ userType == "client" ? "VA" : "Client" }} assigned yet</div>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiCamera } from "@mdi/js";
import { onMounted, onUnmounted, reactive } from "@vue/composition-api";

import OnlineUsers from "@/components/inbox/OnlineUsers.vue";
import InboxMessages from "@/components/inbox/InboxMessages.vue";
import StartVideoCall from "@/components/inbox/StartVideoCall.vue";

import { useMessages } from "@/composables/chat/messages";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user/user";
import { useNotifications } from "@/composables/chat/notifications";
import { conversationEvents } from "@/composables/event-listeners";

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

    const { userType, userId } = useUser();

    onMounted(() => initInbox());
    onUnmounted(() => clearNotifications());

    async function initInbox() {
      try {
        state.isLoading = true;
        const { data: fetchedConversation } = await axios.get("/conversations");
        const { data: fetchedAssocUser } = await axios.get("/users/associate");

        setConversation(fetchedConversation);
        setAssociatedUser(fetchedAssocUser);

        // if (userType.value == "va" && !activeConversation) {
        //   subscribeToChannel(`priavte-conversation-${userId.value}`, conversationEvents);
        // }
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
      unsubscribeFromChannel(`priavte-conversation-${userId.value}`);
      unsubscribeFromChannel(`presence-video-call-${associatedUser.value.id}`);
    });

    return {
      state,
      activeConversation,

      associatedUser,
      userType,

      icons: {
        mdiCamera,
      },
    };
  },
};
</script>

<style></style>
