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
          class="ml-2 video-upload"
          color="info"
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
    <videos-grid></videos-grid>
  </div>
</template>

<script>
import RecordVideo from "@/components/videos/RecordVideo.vue";
import UploadVideo from "@/components/videos/UploadVideoDialog.vue";
import VideosGrid from "@/components/videos/VideosGrid.vue";
import { useUser } from "@/composables/user/user";
import { useVideos } from "@/composables/videos/videos";
import axios from "@axios";
import { mdiDelete } from "@mdi/js";
import { onMounted } from "@vue/composition-api";

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

    const { userType } = useUser();

    onMounted(() => initVideos());

    async function initVideos() {
      try {
        toggleLoading(true);
        var response = await axios.get("/media");
        console.log(response);
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
.video-upload {
  background: #017efa;
}
</style>
