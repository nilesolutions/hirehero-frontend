<template>
  <v-card-text class="d-flex flex-column">
    <form
      class="d-flex flex-row align-center"
      @submit.prevent="sendMsg"
    >
      <v-text-field
        v-model="state.msgText"
        class="mr-2"
        hide-details=""
        outlined
        dense
        placeholder="Type Here"
      />
      <v-tooltip
        bottom
        color="error"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :color="canSend ? 'primary' : ''"
            :loading="state.isSending"
            icon
            v-bind="attrs"
            class="send-msg-btn"
            @click="sendMsg"
            v-on="on"
          >
            <v-icon>{{ icons.mdiSend }}</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-font">Send Message</span>
      </v-tooltip>
    </form>

    <!-- d-flex mt-3 chat-att -->
    <div class="box">

      <div class="d-flex flex-row align-center audio-recorder chat-buttons">
        <v-btn
          v-show="!state.previewUrl"
          small
          class="mr-2"
          @click="toggleRecording"
        >
          <v-icon :color="state.isRecording ? '#F60000' : ''">
            {{ state.isRecording ? icons.mdiStop : icons.mdiMicrophone }}
          </v-icon>
          {{ state.isRecording ? "Stop recording" : "Record note" }}
        </v-btn>

        <audio
          v-show="state.previewUrl"
          ref="recordingPreview"
          controls
          src=""
        />

        <v-btn
          v-show="state.previewUrl"
          class="ml-2 me-2"
          small
          @click="clearRecording"
        >
          <v-icon>{{ icons.mdiDelete }}</v-icon>
          Delete Voice Note
        </v-btn>
      </div>

      <div class="mt-0 d-flex align-center">
        <v-btn
          v-show="!state.files.length"
          small
          class="mr-2"
          @click="openFilePicker"
        >
          <v-icon> {{ icons.mdiFile }} </v-icon>
          Add attachments
        </v-btn>

        <v-file-input
          ref="filePicker"
          v-model="state.files"
          :rules="attachmentsValidation"
          dense
          outlined
          label="Add attachments to message"
          :class="state.files.length ? 'd-flex' : 'd-none'"
          clearable
          small-chips
          show-size=""
          multiple
        />
      </div>
    </div>
  </v-card-text>
</template>

<script>
import axios from '@axios'
import {
  mdiDelete, mdiFile, mdiMicrophone, mdiSend, mdiStop,
} from '@mdi/js'
import {
  computed, onUnmounted, reactive, ref,
} from '@vue/composition-api'
import { validateFileSizes } from '@/helpers'
import { useMessages } from '@/composables/chat/messages'

export default {
  name: 'SendMessage',
  setup() {
    const { activeConversation } = useMessages()
    const state = reactive({
      sizeError: false,
      msgText: '',
      previewUrl: '',
      isSending: false,
      isRecording: false,
      finalBlob: null,
      files: [],
    })

    const recordingPreview = ref(null)
    const filePicker = ref(null)

    const uploadSizeLimit = 50
    const attachmentsValidation = [files => validateFileSizes(files, uploadSizeLimit)]

    function openFilePicker() {
      const pickerElem = filePicker.value.$el
      const button = pickerElem.querySelector('button')

      button.click()
    }

    const canSend = computed(() => {
      if (state.isRecording) return false

      // const filesAboveLimit = state.files.some((file) => file.size > uploadSizeLimit * 1000 * 1000);
      // if (filesAboveLimit) return false;

      if (state.msgText || state.files.length || state.finalBlob) return true

      return false
    })

    let audioStream = null
    let mediaRecorder = null
    let audioChunks = []

    async function startRecording() {
      try {
        audioChunks = []
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            sampleRate: 44100,
          },
        })

        mediaRecorder = new MediaRecorder(audioStream)

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = handleStop
        mediaRecorder.start()
        state.isRecording = true
      } catch (err) {
        console.log(err)
      }
    }

    function stopRecording() {
      mediaRecorder.stop()
    }

    function handleStop() {
      audioStream.getTracks().forEach(track => {
        track.stop()
      })
      state.finalBlob = new Blob(audioChunks, { type: 'audio/webm' })
      state.previewUrl = URL.createObjectURL(state.finalBlob)
      recordingPreview.value.src = state.previewUrl
    }

    function toggleRecording() {
      if (state.isRecording) stopRecording()
      else startRecording()
      state.isRecording = !state.isRecording
    }

    function clearRecording() {
      state.previewUrl = ''
      audioChunks = []
      state.finalBlob = null
    }

    const hideFileDetails = computed(() => {
      if (!state.files.length) return true
      return false
    })

    async function sendMsg() {
      try {
        if (!canSend.value) return
        state.isSending = true

        const form = new FormData()
        form.append('conversationId', activeConversation.value.id)
        form.append('message', state.msgText)
        for (const file of state.files) form.append('attachments', file)
        if (state.finalBlob) form.append('attachments', state.finalBlob, `${Date.now()}.mp3`)

        const response = await axios.post('conversations/messages', form)
        state.msgText = ''
        state.finalBlob = null
        state.previewUrl = ''
        state.files = []
        console.log(response)
      } catch (err) {
        console.log(err)
      } finally {
        state.isSending = false
      }
    }

    onUnmounted(() => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    })

    return {
      state,
      // uploadSizeLimit,

      sendMsg,
      canSend,

      filePicker,
      hideFileDetails,
      attachmentsValidation,
      openFilePicker,

      recordingPreview,
      toggleRecording,
      clearRecording,

      icons: {
        mdiSend,
        mdiDelete,
        mdiMicrophone,
        mdiStop,
        mdiFile,
      },
    }
  },
}
</script>

<style>
.send-msg-btn:hover {
  color: #ff4c51 !important;
}
.box{
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: baseline;
    gap: 25px;
  }
  .box > div{
     margin-top: 15px;
  }
  .box > div > button{
    width: 100% !important;
    margin-top: 15px;
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
@media (max-width: 767px) {
  .chat-att {
    flex-direction: row !important;
    align-items: center;
  }

  .chat-att button {
   margin-top: 5px !important;
    padding: 20px 10px !important;
  }
  .chat-buttons > div{
    width: 100%;
  }
  .box{
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .box > div{
    width: 100% !important;
  }
  .box > div > button{
    width: 100% !important;
    margin-top: 15px;
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }

  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--dense.theme--light.v-text-field.v-text-field--is-booted.v-text-field--enclosed.v-text-field--outlined.v-file-input.d-flex{
    margin-top: 25px;
  }
}
</style>
