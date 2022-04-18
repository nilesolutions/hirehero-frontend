<template>
  <v-card class="video-card mb-2 mr-2">
    <video
      @click="setClickedVidUrl(video.url)"
      class="video-thumbnail"
      :src="video.url"
      preload="meta"
    ></video>

    <v-btn
      v-if="userType == 'client'"
      @click="del(video.id)"
      absolute
      top
      right
      x-small
      fab
      color="warning"
      :loading="state.isDeleting"
    >
      <v-icon>{{ icons.mdiDelete }}</v-icon>
    </v-btn>

    <v-card-text class="mt-2 black--text">{{ video.title || "No Title" }}</v-card-text>
  </v-card>
</template>

<script>
import axios from "@axios";
import { reactive } from "@vue/composition-api";
import { mdiDelete } from "@mdi/js";
import { useVideos } from "@/composables/videos/videos";
import { useUser } from "@/composables/user/user";

export default {
  name: "VideoThumbnail",
  props: { video: Object },
  setup() {
    const { userType } = useUser();
    const { deleteVideo, setClickedVidUrl } = useVideos();

    const state = reactive({
      isDeleting: false,
    });

    async function del(videoId) {
      const confirm = await this.$confirm("Delete video", { title: "Warning" });
      if (!confirm) return;
      try {
        state.isDeleting = true;
        await axios.delete(`/media/${videoId}`);
        deleteVideo(videoId);
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isDeleting = false;
      }
    }

    return {
      state,
      userType,
      del,
      setClickedVidUrl,

      icons: {
        mdiDelete,
      },
    };
  },
};
</script>

<style>
.video-card {
  cursor: pointer;
}

.video-thumbnail {
  width: 210px;
  height: 118px;
}

.video-player-container {
  width: fit-content;
  max-width: 90%;
  margin: auto;
}
</style>
