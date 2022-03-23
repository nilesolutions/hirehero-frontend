<template>
  <v-card-text class="d-flex flex-column">
    <div class="d-flex flex-row align-center">
      <v-text-field
        class="mr-2"
        v-model="state.msgText"
        hide-details=""
        outlined
        dense
        placeholder="Type"
      ></v-text-field>
      <v-btn @click="sendMsg" icon>
        <v-icon>{{ icons.mdiSend }}</v-icon>
      </v-btn>
    </div>

    <div class="d-flex flex-row align-center justify-center mt-3">
      <div class="d-flex flex-row align-center audio-recorder">
        <v-btn @click="toggleRecording" icon small class="mr-2">
          <v-icon>{{ icons.mdiMicrophone }}</v-icon>
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
    const { activeGroup } = useMessages();
    const state = reactive({
      msgText: "",
      previewUrl: "",
      isRecording: false,
      files: [],
    });
    const recordingPreview = ref(null);

    var audioStream = null,
      mediaRecorder = null,
      audioBlobs = [];

    async function startRecording() {
      try {
        audioBlobs = [];
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            sampleRate: 44100,
          },
        });

        mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = function (event) {
          console.log("Recieved audio blob");
          audioBlobs.push(event.data);
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
      state.previewUrl = URL.createObjectURL(new Blob(audioBlobs, { type: "audio/webm" }));
      recordingPreview.value.src = state.previewUrl;
    }

    function toggleRecording() {
      if (state.isRecording) stopRecording();
      else startRecording();
      state.isRecording = !state.isRecording;
    }

    function clearRecording() {
      state.previewUrl = "";
      audioBlobs = [];
    }

    const hideFileDetails = computed(() => {
      if (!state.files.length) return true;
      return false;
    });

    async function sendMsg() {
      try {
        if (!state.msgText) return;
        console.log("sending msg");
        const response = await axios.post("/messages", {
          group: activeGroup.value.id,
          message: state.msgText,
        });
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
