<template>
  <div class="video-call">
    <v-dialog v-model="callState.isInCall" persistent fullscreen>
      <v-card>
        <v-card-title class="d-flex flex-row align-center">
          <span>Call</span>
          <v-btn class="ml-auto" icon @click="handleCallTermination">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>

        <div v-show="callState.isBeingCalled">
          Call from {{ callState.incomingCallRequest.name }}
          <v-btn @click="answerCall">Answer</v-btn>
          <v-btn @click="handleCallTermination">Reject</v-btn>
        </div>

        <div class="d-flex flex-row">
          <video src="" class="col-6 video-preview" ref="localVideoPreview" autoplay></video>
          <video src="" class="col-6 video-preview" ref="remoteVideoPreview" autoplay></video>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";
import { useVideoCall } from "@/composables/chat/videocall";
export default {
  name: "VideoCall",
  setup() {
    const {
      localVideoPreview,
      remoteVideoPreview,
      handleCallTermination,
      answerCall,
      state: callState,
    } = useVideoCall();

    return {
      handleCallTermination,
      callState,
      answerCall,
      localVideoPreview,
      remoteVideoPreview,
      icons: {
        mdiClose,
      },
    };
  },
};
</script>

<style>
.video-call {
  position: absolute;
  left: 0;
  background-color: #fff;
  top: 0;
}

</style>
