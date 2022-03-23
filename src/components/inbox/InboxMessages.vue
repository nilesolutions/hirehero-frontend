<template>
  <div class="d-flex flex-column col-8">
    <v-card v-if="!activeGroup">
      <v-card-text>Choose a group to start</v-card-text>
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

export default {
  name: "InboxMessages",
  components: {
    MessagesLog,
    SendMessage,
  },
  setup() {
    const { activeGroup, pusher } = useMessages();
    const state = reactive({
      isLoading: false,
      msgText: "",
      realTimeCon: null,
    });

    function subscribeToChannel(groupId) {
      state.realTimeCon = pusher.value.subscribe(groupId);
      for (var event of msgEvents) {
        state.realTimeCon.bind(event.name, event.handler);
      }
      console.log("real time channel", state.realTimeCon);
    }

    function unsubscribeFromChannel(groupId) {
      state.realTimeCon.unbind_all();
      pusher.value.unsubscribe(groupId);
      state.realTimeCon = null;
    }

    watch(activeGroup, (newGroup, oldGroup) => {
      console.log("Group changed", newGroup, oldGroup);
      if (!newGroup) {
        console.log("changed to empty channel");
        return;
      }
      if (oldGroup?.id) {
        console.log("removing old subscription", state.realTimeCon);
        unsubscribeFromChannel(oldGroup.id);
      }
      subscribeToChannel(newGroup.id);
    });

    return {
      state,
      activeGroup,
    };
  },
};
</script>

<style></style>
