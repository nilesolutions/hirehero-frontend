<template>
  <div>
    <div class="d-flex flex-row align-center mb-6">
      <h2>Videos</h2>

      <div class="ml-auto">
        <v-btn
          @click="toggleRecordDialog(!state.isRecordDialogOpen)"
          color="primary"
          :outlined="state.isRecordDialogOpen"
          :disabled="isCtrlDisabled"
        >
          Record
        </v-btn>

        <v-btn
          class="ml-2"
          color="primary"
          @click="toggleUploadDialog(true)"
          :disabled="isCtrlDisabled"
        >
          Upload
        </v-btn>
      </div>
    </div>

    <record-video v-if="state.isRecordDialogOpen"></record-video>
    <upload-video></upload-video>
    <v-card>
      <v-card-text v-if="!state.videos.length"> No videos available... <br /> </v-card-text>
    </v-card>
  </div>
</template>

<script>
import RecordVideo from "@/components/videos/RecordVideo.vue";
import UploadVideo from "@/components/videos/UploadVideoDialog.vue";
import { useVideos } from "@/composables/videos";

export default {
  name: "Videos",
  components: { RecordVideo, UploadVideo },
  setup() {
    const { state, toggleRecordDialog, isCtrlDisabled, toggleUploadDialog } = useVideos();
    console.log(UploadVideo);
    return {
      state,
      toggleRecordDialog,
      toggleUploadDialog,
      isCtrlDisabled,
    };
  },
};
</script>

<style></style>
