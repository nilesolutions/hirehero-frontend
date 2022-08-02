<template>
  <div class="d-flex flex-column col-12 col-md-8 padding-0 box-height">
    <v-card class="chat-wrapper ">
      <messages-log showHeader=true height="500px" OverFlowScroll=true></messages-log>
      <SendMessage :attachment="true" :recording="true"></SendMessage>
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

<style scoped>

.padding-0{
  padding: 0;
}
</style>
