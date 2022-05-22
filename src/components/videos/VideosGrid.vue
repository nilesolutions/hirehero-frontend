<template>
  <div>
    <h5 class="mb-3">
      Your {{ userType == "client" ? "Virtual Assistant's" : "Client's" }} Videos
    </h5>
    <div class="videos-container d-flex flex-row flex-wrap">
      <video-thumbnail v-for="video in state.videos.associateVideos" :key="video.id" :video="video">
      </video-thumbnail>

      <p v-show="!state.videos.associateVideos.length">No videos</p>

      <h5 class="mb-3">Your Videos</h5>
      <div class="videos-container d-flex flex-row flex-wrap">
        <video-thumbnail v-for="video in state.videos.myVideos" :key="video.id" :video="video">
        </video-thumbnail>

        <p v-show="!state.videos.myVideos.length">No videos</p>
      </div>
    </div>

    <v-dialog v-model="isViewingVideo" @click:outside="setClickedVidUrl('')">
      <v-card class="video-player-container p-2 d-flex flex-column">
        <v-card-title class="d-flex flex-row">
          <span>{{ activeVideoTitle }}</span>

          <v-btn class="ml-auto" icon @click="setClickedVidUrl('')">
            <v-icon>{{ icons.mdiClose }}</v-icon>
          </v-btn>
        </v-card-title>
        <video class="m-2 video-player" :src="state.clickedVideoUrl" controls></video>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VideoThumbnail from "@/components/videos/VideoThumbnail.vue";
import { useUser } from "@/composables/user/user";
import { useVideos } from "@/composables/videos/videos";
import { mdiClose, mdiDelete } from "@mdi/js";
import { computed } from "@vue/composition-api";

export default {
  name: "VideosGrid",
  components: { VideoThumbnail },
  setup() {
    const { state, setClickedVidUrl, activeVideo } = useVideos();
    const { userType } = useUser();

    const isViewingVideo = computed(() => {
      if (state.clickedVideoUrl) return true;
      return false;
    });

    const activeVideoTitle = computed(() => {
      if (!activeVideo.value) return "";
      if (!activeVideo.value.title) return "No Title";

      return activeVideo.value.title;
    });

    return {
      state,

      activeVideoTitle,
      isViewingVideo,
      setClickedVidUrl,

      userType,

      icons: {
        mdiDelete,
        mdiClose,
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
