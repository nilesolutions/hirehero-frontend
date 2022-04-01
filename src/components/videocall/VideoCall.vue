<template>
  <div class="video-call">
    <v-dialog v-model="vidCallState.isInCall" persistent fullscreen>
      <v-card>
        <v-card-title class="d-flex flex-row align-center">
          <span>Call</span>
          <v-btn class="ml-auto" icon @click="handleCallTermination">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>

        <div class="d-flex flex-row">
          <video class="col-6 video-preview" ref="localVideoPreview" autoplay></video>
          <video class="col-6 video-preview" ref="remoteVideoPreview" autoplay></video>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiClose } from "@mdi/js";
import { useVideoCall } from "@/composables/videocall";
export default {
  name: "VideoCall",
  setup() {
    const {
      localVideoPreview,
      remoteVideoPreview,
      handleCallTermination,
      answerCall,
      state: vidCallState,
    } = useVideoCall();

    return {
      handleCallTermination,
      vidCallState,
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

.video-preview {
  /* height: 200px;
  width: 200px; */
}
</style>
