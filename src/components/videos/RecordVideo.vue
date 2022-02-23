<template>
  <v-card>
    <v-card-title>Record video</v-card-title>

    <v-card-text class="d-flex flex-row">
      <video class="feedback-video black" ref="feedbackVideo" src="null"></video>
    </v-card-text>

    <v-card-actions class="d-flex flex-row flex-wrap">
      <v-btn class="my-2" @click="toggleRecord">
        {{ state.isRecording ? "Stop" : "Start" }} Recording
      </v-btn>
      <v-btn class="my-2" @click="clear" :disabled="state.isRecording"> Clear Recording </v-btn>
      <v-btn class="my-2" @click="upload">Upload</v-btn>
      <v-btn class="my-2">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "@axios";
import { onMounted, reactive, ref } from "@vue/composition-api";

export default {
  name: "RecordVideo",
  setup() {
    const feedbackVideo = ref(null);

    const state = reactive({
      isRecording: false,
    });

    var vidStream = null,
      audioStream = null,
      combinedStream = null,
      recorder = null,
      chunks = [],
      finalBlob = null,
      recordedVideo = null;

    async function setupStream() {
      try {
        vidStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            sampleRate: 44100,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }

    async function setupFeedback() {
      feedbackVideo.value.srcObject = vidStream;
      feedbackVideo.value.play();
    }

    async function toggleRecord() {
      if (state.isRecording) stopRecording();
      else await startRecording();

      state.isRecording = !state.isRecording;
    }

    async function startRecording() {
      try {
        await setupStream();
        await setupFeedback();

        combinedStream = new MediaStream([...vidStream.getTracks(), ...audioStream.getTracks()]);
        recorder = new MediaRecorder(combinedStream);

        recorder.ondataavailable = (event) => chunks.push(event.data);
        recorder.onstop = handleStop;

        recorder.start(1000);
      } catch (err) {}
    }

    function stopRecording() {
      recorder.stop();
    }

    function handleStop(event) {
      finalBlob = new Blob(chunks, { type: "video/mp4" });
      recordedVideo = URL.createObjectURL(finalBlob);
      chunks = [];

      feedbackVideo.value.src = recordedVideo;
      feedbackVideo.value.load();
      feedbackVideo.value.onloadeddata = () => {
        console.log("Video loaded");
        feedbackVideo.value.play();
      };

      vidStream.getTracks().forEach((track) => track.stop());
      audioStream.getTracks().forEach((track) => track.stop());
    }

    function clear() {
      finalBlob = null;
      recordedVideo = null;
      console.log(finalBlob, recordedVideo);
    }

    async function upload() {
      if (!finalBlob) return;
      console.log("uploading");

      try {
        var data = new FormData();
        data.append("file", finalBlob, "video.mp4");
        var response = await axios.post("/media", data);
        console.log(response);
      } catch (err) {
        console.log(err.response);
      }
    }

    return {
      state,

      clear,
      upload,
      feedbackVideo,
      toggleRecord,
    };
  },
};
</script>

<style>
.feedback-video {
  margin: auto;
  height: 400px;
  max-width: 100%;
  max-height: 400px;
}
</style>
