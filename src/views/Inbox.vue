<template>
  <div class="dashboard__content">
    <h2 class="d-flex flex-row align-center black--text mb-2">
      <span class="cursive-font">Inbox</span>
    </h2>
    <div v-show="!state.isLoading && !activeConversation"></div>
    <div class="d-flex flex-row flex-wrap" v-if="!state.isLoading">
      <!-- <start-video-call></start-video-call> -->

      <inbox-messages></inbox-messages>
      <inbox-groups></inbox-groups>
    </div>
    <div v-else>
      <v-progress-circular></v-progress-circular>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiCamera } from "@mdi/js";
import InboxGroups from "@/components/inbox/OnlineUsers.vue";
import InboxMessages from "@/components/inbox/InboxMessages.vue";
import StartVideoCall from "@/components/inbox/StartVideoCall.vue";
import { useMessages } from "@/composables/messages";
import { onMounted, reactive } from "@vue/composition-api";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";
import { conversationEvents } from "@/components/inbox/event-listeners";

export default {
  name: "Inbox",
  components: {
    InboxGroups,
    InboxMessages,
    StartVideoCall,
  },
  setup() {
    const { setConversation, setAssociatedUser, activeConversation } = useMessages();
    const { subscribeToChannel } = usePusher();
    const state = reactive({
      isLoading: true,
    });

    const userType = useUser().userType();
    const userId = useUser().userData().id;

    onMounted(() => initInbox());

    async function initInbox() {
      try {
        state.isLoading = true;
        const { data: activeConversation } = await axios.get("/conversations");
        const { data: associatedUser } = await axios.get("/users/associate");

        if (userType == "va" && !Object.keys(activeConversation).length)
          subscribeToChannel(`priavte-conversation-${userId}`, conversationEvents);

        setConversation(activeConversation);
        setAssociatedUser(associatedUser);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

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
