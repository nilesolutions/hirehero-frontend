<template>
  <div class="videos-container d-flex flex-row flex-wrap">
    <v-card class="video-card mb-2 mr-2" v-for="video in state.videos" :key="video.id">
      <video
        @click="clickedVideoSrc = video.url"
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

      <v-card-text class="mt-2 black--text">{{ video.title || "No Title" }}</v-card-text>
    </v-card>

    <v-dialog v-model="isViewingVideo" @click:outside="clickedVideoSrc = ''">
      <v-card class="video-player-container p-2 d-flex flex-column align-center">
        <video class="m-2 video-player" :src="clickedVideoSrc" controls></video>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@axios";
import { ref, computed } from "@vue/composition-api";
import { mdiDelete } from "@mdi/js";
import { useVideos } from "@/composables/videos";
import { useUser } from "@/composables/user";

export default {
  name: "VideosGrid",
  setup() {
    const userType = useUser().userType();
    const { state, deleteVideo } = useVideos();
    const clickedVideoSrc = ref("");

    const isViewingVideo = computed(() => {
      if (clickedVideoSrc.value) return true;
      return false;
    });

    async function del(videoId) {
      try {
        await axios.delete(`/media/${videoId}`);
        deleteVideo(videoId);
      } catch (err) {
        console.log(err.response);
      }
    }

    return {
      state,
      userType,
      del,
      clickedVideoSrc,
      isViewingVideo,

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

.video-player {
  align-self: center;
  max-width: 100%;
}
</style>
