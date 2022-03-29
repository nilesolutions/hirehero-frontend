<template>
  <v-card-text class="d-flex flex-column">
    <form @submit.prevent="sendMsg" class="d-flex flex-row align-center">
      <v-text-field
        class="mr-2"
        v-model="state.msgText"
        hide-details=""
        outlined
        dense
        placeholder="Type"
      ></v-text-field>
      <v-btn :color="canSend ? 'primary' : ''" @click="sendMsg" icon>
        <v-icon>{{ icons.mdiSend }}</v-icon>
      </v-btn>
    </form>

    <div class="d-flex flex-row align-center justify-center mt-3">
      <div class="d-flex flex-row align-center audio-recorder">
        <v-btn @click="toggleRecording" icon small class="mr-2">
          <v-icon :color="state.isRecording ? '#F60000' : ''">
            {{ state.isRecording ? icons.mdiStop : icons.mdiMicrophone }}
          </v-icon>
        </v-btn>
        <audio v-show="state.previewUrl" ref="recordingPreview" controls src=""></audio>
        <v-btn v-show="state.previewUrl" @click="clearRecording" icon>
          <v-icon>{{ icons.mdiDelete }}</v-icon>
        </v-btn>
      </div>

      <v-file-input
        v-model="state.files"
        class="pt-0 mt-0"
        clearable
        small-chips
        show-size=""
        :hide-input="hideFileDetails"
        multiple
      >
      </v-file-input>
    </div>
  </v-card-text>
</template>

<script>
import axios from "@axios";
import { mdiSend, mdiMicrophone, mdiStop, mdiDelete } from "@mdi/js";
import { computed, ref, reactive, onUnmounted } from "@vue/composition-api";
import { useMessages } from "@/composables/messages";

export default {
  name: "SendMessage",
  setup() {
    const { activeConversation } = useMessages();
    const state = reactive({
      msgText: "",
      previewUrl: "",
      isRecording: false,
      finalBlob: null,
      files: [],
    });
    const recordingPreview = ref(null);
    const canSend = computed(() => {
      if (state.isRecording) return false;
      if (state.msgText || state.files.length || state.finalBlob) return true;
      return false;
    });

    var audioStream = null,
      mediaRecorder = null,
      audioChunks = [];

    async function startRecording() {
      try {
        audioChunks = [];
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            sampleRate: 44100,
          },
        });

        mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = handleStop;
        mediaRecorder.start();
        state.isRecording = true;
      } catch (err) {
        console.log(err);
      }
    }

    function stopRecording() {
      mediaRecorder.stop();
    }

    function handleStop() {
      audioStream.getTracks().forEach(function (track) {
        track.stop();
      });
      state.finalBlob = new Blob(audioChunks, { type: "audio/webm" });
      state.previewUrl = URL.createObjectURL(state.finalBlob);
      recordingPreview.value.src = state.previewUrl;
    }

    function toggleRecording() {
      if (state.isRecording) stopRecording();
      else startRecording();
      state.isRecording = !state.isRecording;
    }

    function clearRecording() {
      state.previewUrl = "";
      audioChunks = [];
      state.finalBlob = null;
    }

    const hideFileDetails = computed(() => {
      if (!state.files.length) return true;
      return false;
    });

    async function sendMsg() {
      try {
        if (!canSend.value) return;

        const form = new FormData();
        form.append("conversationId", activeConversation.value.id);
        form.append("message", state.msgText);
        for (var file of state.files) form.append("attachments", file);
        if (state.finalBlob) form.append("attachments", state.finalBlob, `${Date.now()}.mp3`);

        const response = await axios.post("conversations/messages", form);
        state.msgText = "";
        state.finalBlob = null;
        state.files = [];
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    onUnmounted(() => {
      if (audioStream)
        audioStream.getTracks().forEach(function (track) {
          track.stop();
        });
    });

    return {
      state,
      sendMsg,
      canSend,
      hideFileDetails,
      recordingPreview,
      toggleRecording,
      clearRecording,

      icons: {
        mdiSend,
        mdiDelete,
        mdiMicrophone,
        mdiStop,
      },
    };
  },
};
</script>

<style></style>
