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

    <div class="videos-container d-flex flex-row flex-wrap">
      <v-card class="mb-2 mr-2" v-for="video in state.videos" :key="video.id">
        <video class="training-video" :src="video.url" preload="meta"></video>

        <v-btn
          v-if="userType == 'client'"
          @click="del(video.id)"
          absolute
          top
          right
          small
          outlined
          fab
          color="warning"
        >
          <v-icon>{{ icons.mdiDelete }}</v-icon>
        </v-btn>
      </v-card>
    </div>

    <v-card>
      <v-card-text v-if="!state.videos.length"> No videos available... <br /> </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { onMounted } from "@vue/composition-api";
import { mdiDelete } from "@mdi/js";
import RecordVideo from "@/components/videos/RecordVideo.vue";
import UploadVideo from "@/components/videos/UploadVideoDialog.vue";
import { useVideos } from "@/composables/videos";
import { useUser } from "@/composables/user";

export default {
  name: "Videos",
  components: { RecordVideo, UploadVideo },
  setup() {
    const {
      state,
      setVideos,
      deleteVideo,
      toggleRecordDialog,
      isCtrlDisabled,
      toggleLoading,
      toggleUploadDialog,
    } = useVideos();

    const { userType } = useUser();

    onMounted(() => initVideos());

    async function initVideos() {
      try {
        toggleLoading(true);
        var response = await axios.get("/media");
        setVideos(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        toggleLoading(false);
      }
    }

    async function del(videoId) {
      try {
        await axios.delete(`/media/${videoId}`);
        deleteVideo(videoId);
      } catch (err) {
        console.log(err.response);
      }
    }
    return {
      userType,
      state,
      toggleRecordDialog,
      toggleUploadDialog,
      isCtrlDisabled,
      del,

      icons: {
        mdiDelete,
      },
    };
  },
};
</script>

<style>
.training-video {
  width: 210px;
  height: 118px;
}
</style>
