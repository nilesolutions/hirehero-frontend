<template>
  <div class="video-call">
    <v-dialog v-model="callState.isInCall" persistent fullscreen>
      <v-card>
        <v-card-title class="d-flex flex-row align-center">
          <span>Call</span>
          <v-btn class="ml-auto" icon @click="endCall">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
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
    const { endCall, state: callState } = useVideoCall();

    return {
      endCall,
      callState,
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
