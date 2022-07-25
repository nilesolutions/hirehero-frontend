<template>
  <div>
    <!-- Different layout depending on user type -->
    <div v-if="userType == 'client'">
      <h4 class="sub-heading">Your Videos</h4>
      <div v-if="myVideos.length" class="videos-container d-flex video-mobile flex-row flex-wrap">
        <video-thumbnail v-for="video in myVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!myVideos.length">No videos</p>

      <h4 class="sub-heading">Your Virtual Assistant(s) Videos</h4>
      <div
        v-if="associateVideos.length"
        class="videos-container d-flex flex-row video-mobile flex-wrap"
      >
        <video-thumbnail v-for="video in associateVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!associateVideos.length">No Videos</p>
    </div>
    <div v-else>
      <h4 class="sub-heading">Your Client's Videos</h4>
      <div
        v-if="associateVideos.length"
        class="videos-container d-flex video-mobile flex-row flex-wrap"
      >
        <video-thumbnail v-for="video in associateVideos" :key="video.id" :video="video">
        </video-thumbnail>
      </div>
      <p v-else="!associateVideos.length">No Videos</p>

      <h4 class="sub-heading">Your Videos</h4>
      <div v-if="myVideos.length" class="videos-container d-flex video-mobile flex-row flex-wrap">
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
.sub-heading{
  font-size: 18px;
  margin-bottom: 10px;
}

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

@media (max-width: 767px) {
  .v-application div.video-mobile {
    flex-direction: column !important;
  }

  .v-application div.video-mobile .video-thumbnail {
    width: 100%;
  }

  .video-player-container {
    height: auto;
    /* top:50%;
    transform: translateY(-50%) */
  }
}
</style>
