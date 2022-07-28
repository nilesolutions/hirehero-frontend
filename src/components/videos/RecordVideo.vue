<template>
  <v-card class="my-3">
    <v-card-title>Record video</v-card-title>

    <v-card-text>
      <v-text-field
        v-model="title"
        outlined
        label="Video Title"
        placeholder="Title"
      />
    </v-card-text>

    <v-card-text class="d-flex flex-row">
      <video
        ref="feedbackPlayer"
        class="feedback-video black"
        src="null"
        :controls="state.recordedVidUrl ? true : false"
      />
    </v-card-text>

    <v-card-actions class="d-flex flex-row flex-wrap">
      <!-- Start / Pause Recording -->
      <v-btn
        class="my-2"
        :disabled="state.isUploading"
        @click="toggleRecord"
      >
        <v-icon
          class="mr-2"
          color="#b53737"
        >
          {{ state.isRecording ? icons.mdiPause : icons.mdiRecord }}
        </v-icon>
        {{ recordBtnText }}
      </v-btn>

      <!-- Clear record -->
      <v-btn
        v-if="state.recordedVidUrl"
        class="my-2"
        :disabled="state.isRecording"
        @click="clear"
      >
        <v-icon class="mr-2">
          {{ icons.mdiCancel }}
        </v-icon>
        Clear
      </v-btn>

      <!-- Upload recorded video -->
      <v-btn
        v-if="state.recordedVidUrl"
        class="my-2"
        :disabled="isCtrlDisabled"
        :loading="state.isUploading"
        @click="upload"
      >
        <v-icon class="mr-2">
          {{ icons.mdiCloudUpload }}
        </v-icon>
        Upload
      </v-btn>

      <!-- Close dialog and clear recorded video -->
      <v-btn
        class="my-2"
        :disabled="isCtrlDisabled"
        @click="toggleRecordDialog(false)"
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from '@axios'
import { onBeforeUnmount, ref, computed } from '@vue/composition-api'
import {
  mdiRecord, mdiPause, mdiCancel, mdiCloudUpload,
} from '@mdi/js'
import { useVideos } from '@/composables/videos/videos'

export default {
  name: 'RecordVideo',
  setup() {
    const {
      state,
      toggleRecording,
      setVidUrl,
      toggleRecordDialog,
      toggleUpload,
      isCtrlDisabled,
      addVideo,
    } = useVideos()

    const feedbackPlayer = ref(null)
    const title = ref('')

    let vidStream = null
    let audioStream = null
    let combinedStream = null
    let recorder = null
    let chunks = []
    let finalBlob = null

    const recordBtnText = computed(() => {
      if (state.isRecording) return 'Stop'
      if (!state.isRecording && state.recordedVidUrl) return 'Resume'
      return 'Record'
    })

    onBeforeUnmount(() => clear())

    async function setupRecording() {
      try {
        vidStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })

        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            sampleRate: 44100,
          },
        })

        feedbackPlayer.value.src = null
        feedbackPlayer.value.srcObject = null
        feedbackPlayer.value.srcObject = vidStream
        feedbackPlayer.value.play()
      } catch (err) {
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop())
          audioStream = null
        }
        if (vidStream) {
          vidStream.getTracks().forEach(track => track.stop())
          vidStream = null
        }
        alert('Please Check Audio & Video Permissions')
        throw err
      }
    }

    async function toggleRecord() {
      try {
        if (state.isRecording) stopRecording()
        else await startRecording()

        toggleRecording(!state.isRecording)
      } catch (err) {
        throw err
      }
    }

    async function startRecording() {
      try {
        await setupRecording()

        combinedStream = new MediaStream([...vidStream.getTracks(), ...audioStream.getTracks()])
        recorder = new MediaRecorder(combinedStream)

        recorder.ondataavailable = event => chunks.push(event.data)
        recorder.onstop = handleStop

        recorder.start(1000)
      } catch (err) {
        throw err
      }
    }

    function stopRecording() {
      recorder.stop()
    }

    function handleStop() {
      finalBlob = new Blob(chunks, { type: 'video/mp4' })

      URL.revokeObjectURL(state.recordedVidUrl)
      setVidUrl(URL.createObjectURL(finalBlob))

      vidStream.getTracks().forEach(track => track.stop())
      audioStream.getTracks().forEach(track => track.stop())

      feedbackPlayer.value.src = null
      feedbackPlayer.value.srcObject = null
      feedbackPlayer.value.src = state.recordedVidUrl
      feedbackPlayer.value.load()
    }

    function clear() {
      chunks = []
      finalBlob = null
      URL.revokeObjectURL(state.recordedVidUrl)
      setVidUrl('')
      feedbackPlayer.value.src = null
    }

    async function upload() {
      if (!finalBlob) return
      toggleUpload(true)

      try {
        const data = new FormData()
        data.append('file', finalBlob, 'video.mp4')
        data.append('title', title.value)
        const response = await axios.post('/media', data)
        addVideo(response.data)
        toggleRecordDialog(false)
      } catch (err) {
        console.log(err.response)
      } finally {
        toggleUpload(false)
      }
    }

    return {
      state,
      title,

      clear,
      upload,
      feedbackPlayer,
      toggleRecord,
      recordBtnText,
      toggleRecordDialog,
      isCtrlDisabled,

      icons: {
        mdiRecord,
        mdiPause,
        mdiCancel,
        mdiCloudUpload,
      },
    }
  },
}
</script>

<style>
.feedback-video {
  margin: auto;
  height: 400px;
  max-width: 100%;
  max-height: 400px;
}
</style>
