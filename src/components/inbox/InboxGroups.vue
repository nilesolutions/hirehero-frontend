<template>
  <div class="d-flex flex-column col-4">
    <v-card>
      <v-btn @click="startChat">Start conversatiom</v-btn>
      <v-btn @click="setActiveGroupId('')">Clear</v-btn>
      <v-card-title>Conversations</v-card-title>

      <v-card-text
        @click="setActiveGroupId(conversation.id)"
        v-for="conversation in state.chatGroups"
        :key="conversation.id"
      >
        {{ conversation.name }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { onMounted } from "@vue/composition-api";
import { useMessages } from "@/composables/messages";

export default {
  name: "InboxGroups",
  setup() {
    const { state, setChatGroups, setActiveGroupId } = useMessages();

    onMounted(() => fetchChatGroups());

    async function fetchChatGroups() {
      try {
        const { data } = await axios.get("/messages/groups");
        console.log("Groups are", data);
        setChatGroups(data);
      } catch (err) {
        console.log(err);
      }
    }

    async function startChat() {
      try {
        const response = await axios.post("/message/invite");
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    return {
      state,
      startChat,
      fetchChatGroups,
      setActiveGroupId,
    };
  },
};
</script>

<style></style>
