<template>
  <v-card-text class="d-flex flex-row align-center pt-3">
    <div>
      <v-badge :color="vidCallState.isPeerOnline ? '#30D988' : '#ababab'" dot bottom avatar>
        <v-avatar rounded color="primary">
          <img :src="peerProfilePic" alt="" />
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
      <v-btn
        small
        class="white--text cursive-font no-hover"
        :color="vidCallState.isPeerOnline ? '#30D988' : '#ababab'"
      >
        {{ vidCallState.isPeerOnline ? "Online" : "Offline" }}
      </v-btn>

      <v-btn :disabled="!canStartCall" @click="initCall" small class="ml-2" elevation="2" icon>
        <div class="tooltip">
          <div class="tooltiptext">Call</div>
        <v-icon>{{ icons.mdiPhoneOutline }}</v-icon>
        </div>
      </v-btn>
    </div>
  </v-card-text>
</template>

<script>
import { useMessages } from "@/composables/chat/messages";
import { mdiPhoneOutline } from "@mdi/js";
import { reactive, computed } from "@vue/composition-api";
import { useVideoCall } from "@/composables/chat/videocall";
import { resolveProfilePic } from "@/helpers";

export default {
  name: "MessagesLogHeader",
  setup() {
    const { state: vidCallState, initCall } = useVideoCall();
    const { state: msgsState } = useMessages();

    const canStartCall = computed(() => {
      if (vidCallState.isInCall || !vidCallState.isPeerOnline || vidCallState.isBeingCalled)
        return false;
      return true;
    });

    const state = reactive({});

    return {
      state,
      msgsState,
      vidCallState,
      canStartCall,
      initCall,

      peerProfilePic: resolveProfilePic(msgsState.associatedUser),

      icons: {
        mdiPhoneOutline,
      },
    };
  },
};
</script>

<style></style>
