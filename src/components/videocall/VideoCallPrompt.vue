<template>
  <v-dialog
    v-model="vidCallState.isBeingCalled"
    width="fit-content"
    persistent
    class="video-call-prompt"
  >
    <v-card elevation="4">
      <v-card-text>
        Incoming Video Call From {{ vidCallState.incomingCallRequest.name }}
      </v-card-text>
      <v-card-actions>
        <v-btn @click="answerCall">Accept</v-btn>
        <v-btn @click="endCall">Reject</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useVideoCall } from "@/composables/videocall";
export default {
  name: "VideoCallPrompt",
  setup() {
    const { state: vidCallState, answerCall, endCall } = useVideoCall();

    return {
      vidCallState,
      answerCall,
      endCall,
    };
  },
};
</script>

<style>
.video-call-prompt {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 50;
}
</style>
