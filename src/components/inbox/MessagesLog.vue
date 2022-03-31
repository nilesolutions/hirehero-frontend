<template>
  <div>
    <v-card-text class="d-flex flex-row align-center pt-3">
      <div>
        <v-badge :color="vidCallState.isPeerOnline ? '#30D988' : '#ababab'" dot bottom avatar>
          <v-avatar rounded color="primary">
            <span class="white--text">
              {{ msgsState.associatedUser.username[0].toUpperCase() }}
            </span>
          </v-avatar>
        </v-badge>
      </div>

      <div class="ml-2">
        <span class="d-block cursive-font black--text">
          {{ msgsState.associatedUser.username }}
        </span>
        <span class="d-block">{{ msgsState.associatedUser.email }}</span>
      </div>

      <div class="ml-auto">
        <v-btn elevation="2" icon>
          <v-icon>{{ icons.mdiPhoneOutline }}</v-icon>
        </v-btn>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <div class="messages-wrapper">
      <ul class="messages-list" ref="msgsList">
        <p class="py-4 px-4" v-show="!msgsState.messages.length">No messages yet</p>
        <chat-message v-for="msg in msgsState.messages" :key="msg.id" :msgData="msg"></chat-message>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import ChatMessage from "@/components/inbox/ChatMessage.vue";
import { usePusher } from "@/composables/pusher";
import { msgEvents } from "@/composables/event-listeners";
import { useMessages } from "@/composables/messages";
import { mdiPhoneOutline } from "@mdi/js";
import { onMounted, reactive, ref, nextTick, onUnmounted } from "@vue/composition-api";
import { useVideoCall } from "@/composables/videocall";

export default {
  name: "MessagesLog",
  components: { ChatMessage },
  setup() {
    const { state: vidCallState } = useVideoCall();
    const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels } = usePusher();
    const { activeConversation, setMessages, state: msgsState } = useMessages();

    const msgsList = ref(null);

    const state = reactive({
      isLoading: false,
      msgText: "",
      realTimeCon: null,
    });

    function scrollToBottom() {
      msgsList.value.scrollTop = msgsList.value.scrollHeight;
    }

    async function fetchMessages(conversationId) {
      try {
        state.isLoading = true;
        const { data: messages } = await axios.get(`conversations/${conversationId}`);
        setMessages(messages);
        nextTick(() => scrollToBottom());
        subscribeToChannel(`presence-${conversationId}`, msgEvents);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    onMounted(() => fetchMessages(activeConversation.value.id));
    onUnmounted(() => unsubscribeFromChannel(`presence-${activeConversation.value.id}`));

    return {
      state,
      msgsState,
      msgsList,

      vidCallState,

      icons: {
        mdiPhoneOutline,
      },
    };
  },
};
</script>

<style lang="scss">
.messages-wrapper {
  height: 500px;
}

.messages-list {
  list-style: none;
  padding: 0px !important;
  margin: 0px;
  height: 100%;
  overflow-y: scroll;
}
</style>
