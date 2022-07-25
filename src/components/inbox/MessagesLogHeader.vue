<template>
  <v-card-text class="d-flex flex-row align-center pt-3">
    <div>
      <v-badge :color="vidCallState.isPeerOnline ? '#30D988' : '#ababab'" dot bottom avatar>
        <v-avatar rounded>
          <img :src="peerProfilePic" alt="" />
        </v-avatar>
      </v-badge>
    </div>

    <div class="ml-2">
      <span class="d-block cursive-font black--text">
        {{ msgsState.associatedUser.username }}

      </span>
    </div>

    <div class="ml-auto chat-header-container">
      <v-btn
        small
        class="white--text cursive-font no-hover offline-btn"
        :color="vidCallState.isPeerOnline ? '#30D988' : '#ababab'"
      >
        {{ vidCallState.isPeerOnline ? "Online" : "Offline" }}
      </v-btn>
      <v-tooltip bottom color="error">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="canStartCall ? initCall() : null"
            small
            class="ml-2"
            icon
            :class="{ disabled: !canStartCall }"
            depressed
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>{{ icons.mdiPhoneOutline }}</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-font">{{ canStartCall ? "Call Now" : "Call Unavailable" }}</span>
      </v-tooltip>
    </div>
  </v-card-text>
</template>

<script>
import { useMessages } from "@/composables/chat/messages";
import { useVideoCall } from "@/composables/chat/videocall";
import { resolveProfilePic } from "@/helpers";
import { mdiPhoneOutline } from "@mdi/js";
import { computed, reactive } from "@vue/composition-api";

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

<style lang="scss" scoped>
div.chat-header-container .v-btn.offline-btn,
div.chat-header-container .v-btn.offline-btn:hover {
  box-shadow: none !important;
}

.disabled {
  cursor: default;
  background: none !important;

  &:before {
    background-color: transparent !important;
  }
  &:hover {
    background: none !important;
  }
}
</style>
