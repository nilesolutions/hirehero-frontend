<template>
  <div class="d-flex flex-column col-12 col-md-4">
    <v-card>
      <v-card-title>
        <h5>Online Users</h5>
      </v-card-title>

      <v-card-text
        class="d-flex flex-row align-center"
        v-for="user in msgsState.onlineUsers"
        :key="user.id"
      >
        <v-avatar size="30" color="primary">
          <span class="white--text">{{ user.name[0].toUpperCase() }}</span>
        </v-avatar>
        <span class="black--text ml-1">{{ user.name }} ({{ user.type }})</span>

        <v-badge class="ml-auto" color="#30d988" inline dot left>
          <span style="color: #30d988"> Online </span>
        </v-badge>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiPlus } from "@mdi/js";
import { onUnmounted, reactive } from "@vue/composition-api";
import { onMounted } from "@vue/composition-api";
import { useMessages } from "@/composables/messages";
import { usePusher } from "@/composables/pusher";
import { groupEvents } from "@/components/inbox/event-listeners";
import { useUser } from "@/composables/user";

export default {
  name: "InboxGroups",
  setup() {
    const { state: msgsState, setChatGroups, setActiveGroupId, activeGroup } = useMessages();
    const pusher = usePusher();
    const state = reactive({
      isLoading: false,
      isCreateOpen: false,
      conversationName: "",
    });

    const userId = useUser().userData().id;
    const groupCreationChannel = `private-invite-${userId}`;

    // onMounted(() => {
    //   fetchChatGroups();
    //   pusher.updateAuthCreds();
    //   pusher.subscribeToChannel(groupCreationChannel, groupEvents);
    // });

    //onUnmounted(() => pusher.unsubscribeFromChannel(groupCreationChannel));

    async function fetchChatGroups() {
      try {
        const { data } = await axios.get("/messages/groups");
        setChatGroups(data);
      } catch (err) {
        console.log(err);
      }
    }

    async function startChat() {
      try {
        if (!state.conversationName) return;
        state.isLoading = true;
        const response = await axios.post("/messages/invite", {
          group_name: state.conversationName,
        });
        console.log(response);
        state.isCreateOpen = false;
        state.conversationName = "";
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      msgsState,
      startChat,
      fetchChatGroups,
      setActiveGroupId,
      activeGroup,

      icons: {
        mdiPlus,
      },
    };
  },
};
</script>

<style lang="scss">
.conversation-card {
  cursor: pointer;
}

.active-conversation {
  background-color: var(--v-primary-base);
  color: #fff !important;
}
</style>
