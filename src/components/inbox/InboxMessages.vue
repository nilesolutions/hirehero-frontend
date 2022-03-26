<template>
  <div class="d-flex flex-column col-8">
    <v-card v-if="!activeGroup">
      <v-card-text>Click a conversation to start</v-card-text>
    </v-card>

    <v-card class="chat-wrapper" v-else>
      <messages-log></messages-log>
      <send-message></send-message>
    </v-card>
  </div>
</template>

<script>
import { reactive, watch } from "@vue/composition-api";
import MessagesLog from "@/components/inbox/MessagesLog.vue";
import SendMessage from "@/components/inbox/SendMessage.vue";
import { useMessages } from "@/composables/messages";
import { msgEvents } from "./event-listeners";
import { usePusher } from "@/composables/pusher";

export default {
  name: "InboxMessages",
  components: {
    MessagesLog,
    SendMessage,
  },
  setup() {
    const { activeGroup } = useMessages();
    const { subscribeToChannel, unsubscribeFromChannel, debugActiveChannels } = usePusher();
    const state = reactive({
      isLoading: false,
      msgText: "",
      realTimeCon: null,
    });

    watch(activeGroup, (newGroup, oldGroup) => {
      unsubscribeFromChannel(oldGroup?.id);
      subscribeToChannel(newGroup?.id, msgEvents);
      debugActiveChannels();
    });

    return {
      state,
      activeGroup,
    };
  },
};
</script>

<style></style>
