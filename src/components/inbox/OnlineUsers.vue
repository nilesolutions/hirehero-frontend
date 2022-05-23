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
        <v-avatar size="30">
          <img :src="resolveProfilePic(user)" alt="" />
        </v-avatar>
        <span class="black--text ml-1">{{ user.name }} {{ userIdentityText(user) }}</span>

        <v-badge class="ml-auto" color="#30d988" inline dot left>
          <span style="color: #30d988"> Online </span>
        </v-badge>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useMessages } from "@/composables/chat/messages";
import { useUser } from "@/composables/user/user";
import { resolveProfilePic } from "@/helpers";

export default {
  name: "OnlineUsers",
  setup() {
    const { state: msgsState } = useMessages();
    const { userId } = useUser();

    function userIdentityText(user) {
      if (user.id == userId.value) return "(You)";
      if (user.type == "admin") return "(Admin)";
      if (user.type == "va") return "(Virtual Assistant)";
      if (user.type == "client") return "(Client)";
    }

    return {
      msgsState,
      userId,
      resolveProfilePic,
      userIdentityText,
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
