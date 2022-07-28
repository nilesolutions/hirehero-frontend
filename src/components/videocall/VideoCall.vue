<template>
  <div class="video-call">
    <v-dialog
      v-model="vidCallState.isInCall"
      persistent
      fullscreen
    >
      <v-card>
        <v-card-title class="d-flex flex-row align-center">
          <span>Call</span>
          <v-btn
            class="ml-auto"
            icon
            @click="handleCallTermination('Call Closed')"
          >
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>

        <div class="d-flex flex-row">
          <video
            ref="localVideoPreview"
            class="col-6 video-preview"
            muted
            autoplay
          />
          <video
            ref="remoteVideoPreview"
            class="col-6 video-preview"
            autoplay
          />
        </div>

        <v-card-actions class="d-flex flex-row justify-center">
          <v-btn
            icon
            color="primary"
            large
            outlined
            @click="muteMic"
          >
            <v-icon>
              {{ vidCallState.isMicEnabled ? icons.mdiMicrophone : icons.mdiMicrophoneOff }}
            </v-icon>
          </v-btn>

          <v-btn
            icon
            color="primary"
            large
            outlined
            @click="disableCam"
          >
            <v-icon>
              {{ vidCallState.isCamEnabled ? icons.mdiCamera : icons.mdiCameraOff }}
            </v-icon>
          </v-btn>

          <v-btn
            rounded
            icon
            outlined
            color="warning"
            @click="handleCallTermination('Call Closed')"
          >
            <v-icon>{{ icons.mdiPhoneHangup }}</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  mdiClose,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiCamera,
  mdiCameraOff,
  mdiPhoneHangup,
} from '@mdi/js'
import { useUser } from '@/composables/user/user'
import { useVideoCall } from '@/composables/chat/videocall'
import { useMessages } from '@/composables/chat/messages'

export default {
  name: 'VideoCall',
  setup() {
    const {
      localVideoPreview,
      remoteVideoPreview,
      handleCallTermination,
      disableCam,
      muteMic,
      state: vidCallState,
    } = useVideoCall()

    const { userName } = useUser()
    const { associatedUser } = useMessages()

    return {
      handleCallTermination,
      vidCallState,

      muteMic,
      disableCam,

      localVideoPreview,
      remoteVideoPreview,

      userName,
      associatedUser,

      icons: {
        mdiClose,
        mdiMicrophone,
        mdiMicrophoneOff,
        mdiCamera,
        mdiCameraOff,
        mdiPhoneHangup,
      },
    }
  },
}
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
  border-radius: 6px;
}
</style>
