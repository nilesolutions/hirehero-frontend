<template>
  <div class="d-flex flex-column col-12 col-md-8">
    <v-card class="chat-wrapper">
      <messages-log></messages-log>
      <send-message></send-message>
    </v-card>
  </div>
</template>

<script>
import MessagesLog from "@/components/inbox/MessagesLog.vue";
import SendMessage from "@/components/inbox/SendMessage.vue";

export default {
  name: "InboxMessages",
  components: {
    MessagesLog,
    SendMessage,
  },
};
</script>

<style></style>
