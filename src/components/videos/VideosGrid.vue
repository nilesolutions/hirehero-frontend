<template>
  <div>
    <h5 class="mb-3">Your Videos</h5>
    <div class="videos-container d-flex flex-row flex-wrap">
      <video-thumbnail v-for="video in state.videos.myVideos" :key="video.id" :video="video">
      </video-thumbnail>

      <p v-show="!state.videos.myVideos.length">No videos</p>
    </div>

    <h5 class="mb-3">Your {{ userType == "client" ? "Virtual Assitant" : "Client" }} Videos</h5>
    <div class="videos-container d-flex flex-row flex-wrap">
      <video-thumbnail v-for="video in state.videos.associateVideos" :key="video.id" :video="video">
      </video-thumbnail>

      <p v-show="!state.videos.associateVideos.length">No videos</p>
    </div>

    <v-dialog v-model="isViewingVideo" @click:outside="setClickedVidUrl('')">
      <v-card class="video-player-container p-2 d-flex flex-column align-center">
        <video class="m-2 video-player" :src="state.clickedVideoUrl" controls></video>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VideoThumbnail from "@/components/videos/VideoThumbnail.vue";

import { computed } from "@vue/composition-api";
import { useVideos } from "@/composables/videos/videos";

import { mdiDelete } from "@mdi/js";
import { useUser } from "@/composables/user/user";

export default {
  name: "VideosGrid",
  components: { VideoThumbnail },
  setup() {
    const { state, setClickedVidUrl } = useVideos();
    const { userType } = useUser();

    const isViewingVideo = computed(() => {
      if (state.clickedVideoUrl) return true;
      return false;
    });

    return {
      state,
      isViewingVideo,
      setClickedVidUrl,

      userType,

      icons: {
        mdiDelete,
      },
    };
  },
};
</script>

<style>
.video-player {
  align-self: center;
  max-width: 100%;
}
</style>
