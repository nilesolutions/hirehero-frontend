<template>
  <div class="d-flex flex-column col-4">
    <v-card>
      <v-card-title>
        <span>Conversations</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="state.isCreateOpen = true" icon>
          <v-icon>{{ icons.mdiPlus }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text
        @click="setActiveGroupId(group.id)"
        v-for="group in msgsState.chatGroups"
        :key="group.id"
        class="pt-2 conversation-card"
        :class="msgsState.activeGroupId == group.id ? 'active-conversation' : ''"
      >
        {{ group.name }}
      </v-card-text>

      <v-dialog max-width="500" v-model="state.isCreateOpen">
        <v-card class="d-flex flex-column align-center">
          <v-card-title>Start A Conversation</v-card-title>
          <v-text-field v-model="state.conversationName" placeholder="Name" outlined>
          </v-text-field>
          <v-card-actions>
            <v-btn :loading="state.isLoading" @click="startChat" color="primary">Start</v-btn>
            <v-btn :disabled="state.isLoading" @click="state.isCreateOpen = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

    onMounted(() => {
      fetchChatGroups();
      pusher.updateAuthCreds();
      pusher.subscribeToChannel(groupCreationChannel, groupEvents);
      pusher.debugActiveChannels("From Inbox Groups");
    });

    onUnmounted(() => pusher.unsubscribeFromChannel(groupCreationChannel));

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
