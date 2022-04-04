<template>
  <div class="d-flex flex-column col-12 col-md-4">
    <v-card>
      <v-card-title>
        <h5>Online Chat Users</h5>
      </v-card-title>

      <v-card-text
        class="d-flex flex-row align-center"
        v-for="user in msgsState.onlineUsers"
        :key="user.id"
      >
        <v-avatar size="30" color="primary">
          <span class="white--text">{{ user.name[0].toUpperCase() }}</span>
        </v-avatar>
        <span class="black--text ml-1">{{ user.name }} {{ user.id == userId ? "(You)" : "" }}</span>

        <v-badge class="ml-auto" color="#30d988" inline dot left>
          <span style="color: #30d988"> Online </span>
        </v-badge>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useMessages } from "@/composables/messages";
import { useUser } from "@/composables/user";

export default {
  name: "OnlineUsers",
  setup() {
    const { state: msgsState } = useMessages();
    const { userId } = useUser();

    return {
      msgsState,
      userId,
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
