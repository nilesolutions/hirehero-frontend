<template>
  <div>
    <v-card-title>Messages</v-card-title>

    <div class="messages-wrapper">
      <ul class="messages-list" ref="msgsList">
        <p v-show="!msgsState.messages.length">No messages yet</p>
        <chat-message v-for="msg in msgsState.messages" :key="msg.id" :msgData="msg"></chat-message>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "@axios";
import ChatMessage from "@/components/inbox/ChatMessage.vue";
import { watch, onMounted, reactive, ref, nextTick } from "@vue/composition-api";
import { useMessages } from "@/composables/messages";

export default {
  name: "MessagesLog",
  components: { ChatMessage },
  setup() {
    const { activeGroup, setMessages, state: msgsState } = useMessages();
    const msgsList = ref(null);
    const state = reactive({
      isLoading: false,
      msgText: "",
      realTimeCon: null,
    });

    function scrollToBottom() {
      msgsList.value.scrollTop = msgsList.value.scrollHeight;
    }

    async function fetchMessages(groupId) {
      try {
        state.isLoading = true;
        const { data } = await axios.get(`messages/${groupId}`);
        setMessages(data);
        nextTick(() => scrollToBottom());
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    onMounted(() => fetchMessages(activeGroup.value.id));
    watch(activeGroup, (newGroup, oldGroup) => {
      fetchMessages(newGroup.id);
    });

    return {
      state,
      msgsState,
      msgsList,
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
  padding: 1rem;
  margin: 0px;
  height: 100%;
  overflow-y: scroll;
}
</style>
