<template>
  <div class="videos-container d-flex flex-row flex-wrap">
    <v-card class="video-card mb-2 mr-2" v-for="video in state.videos" :key="video.id">
      <video
        @click="playVideo(video.url)"
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
      >
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </v-card>

    <v-dialog v-model="clickedVideoSrc" @click:outside="clickedVideoSrc = false">
      <v-card>
        <video :src="clickedVideoSrc" controls></video>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@axios";
import { onMounted, ref } from "@vue/composition-api";
import { mdiDelete } from "@mdi/js";
import { useVideos } from "@/composables/videos";
import { useUser } from "@/composables/user";

export default {
  name: "VideosGrid",
  setup() {
    const userType = useUser().userType();
    const { state, deleteVideo } = useVideos();
    const clickedVideoSrc = ref("");

    async function del(videoId) {
      try {
        await axios.delete(`/media/${videoId}`);
        deleteVideo(videoId);
      } catch (err) {
        console.log(err.response);
      }
    }

    function playVideo(src) {
      clickedVideoSrc.value = src;
      console.log(clickedVideoSrc.value);
    }

    return {
      state,
      userType,
      del,
      playVideo,
      clickedVideoSrc,

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
</style>
