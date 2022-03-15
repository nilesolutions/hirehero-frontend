<template>
  <div class="dashboard__content">
    <div class="d-flex flex-row align-center mb-6">
      <h2 class="cursive-font black--text">Videos</h2>

      <div class="ml-auto">
        <v-btn
          @click="toggleRecordDialog(!state.isRecordDialogOpen)"
          color="primary"
          tile
          :outlined="state.isRecordDialogOpen"
          :disabled="isCtrlDisabled"
        >
          Record
        </v-btn>

        <v-btn
          class="ml-2"
          color="primary"
          tile
          @click="toggleUploadDialog(true)"
          :disabled="isCtrlDisabled"
        >
          Upload
        </v-btn>
      </div>
    </div>

    <record-video v-if="state.isRecordDialogOpen"></record-video>
    <upload-video></upload-video>

    <v-card v-if="!state.videos.length">
      <v-card-text> No videos available... <br /> </v-card-text>
    </v-card>
    <videos-grid v-else></videos-grid>
  </div>
</template>

<script>
import axios from "@axios";
import { onMounted } from "@vue/composition-api";
import { mdiDelete } from "@mdi/js";
import VideosGrid from "@/components/videos/VideosGrid.vue";
import RecordVideo from "@/components/videos/RecordVideo.vue";
import UploadVideo from "@/components/videos/UploadVideoDialog.vue";
import { useVideos } from "@/composables/videos";
import { useUser } from "@/composables/user";

export default {
  name: "Videos",
  components: { RecordVideo, UploadVideo, VideosGrid },
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

    const userType = useUser().userType();

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

<style></style>
