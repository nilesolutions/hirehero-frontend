<template>
  <div>
    <!-- Different layout depending on user type -->
    <div v-if="userType == 'client'">
      <h5>Your videos</h5>
      <div v-if="myVideos.length" class="videos-container d-flex flex-row flex-wrap">
        <video-thumbnail v-for="video in myVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!myVideos.length">No videos</p>

      <h5>Your Virtual Assistant(s) videos</h5>
      <div v-if="associateVideos.length" class="videos-container d-flex flex-row flex-wrap">
        <video-thumbnail v-for="video in associateVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!associateVideos.length">No videos</p>
    </div>
    <div v-else>
      <h5>Your client's videos</h5>
      <div v-if="associateVideos.length" class="videos-container d-flex flex-row flex-wrap">
        <video-thumbnail v-for="video in associateVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!associateVideos.length">No videos</p>

      <h5>Your videos</h5>
      <div v-if="myVideos.length" class="videos-container d-flex flex-row flex-wrap">
        <video-thumbnail v-for="video in myVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!myVideos.length">No videos</p>
    </div>

    <v-dialog
      v-model="isViewingVideo"
      @click:outside="setClickedVidUrl('')"
      class="main-video-container"
    >
      <v-card class="video-player-container p-2 d-flex flex-column">
        <v-card-title class="d-flex flex-row">
          <span class="text-capitalize">{{ activeVideoTitle }}</span>

          <v-btn class="ml-auto my-hover-btn" icon @click="setClickedVidUrl('')">
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
    const { state, setClickedVidUrl, activeVideo, myVideos, associateVideos } = useVideos();
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

      myVideos,
      associateVideos,

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
.v-dialog {
  /* overflow: hidden; */
  max-height: 100vh;
  padding: 20px 0;
  height: 100%;
  box-shadow: none !important;
}

.video-player-container {
  height: 100%;
}

.v-dialog > .v-card > .v-card__title {
  max-height: 75px;
}

.video-player {
  align-self: center;
  max-width: 100%;
  width: auto;
  max-height: calc(100% - 73px);
}
</style>
