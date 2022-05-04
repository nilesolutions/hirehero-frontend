<template>
  <v-card class="video-card mb-2 mr-2">
    <video
      @click="setClickedVidUrl(video.url)"
      class="video-thumbnail"
      :src="video.url"
      preload="meta"
    ></video>

    <v-btn
      v-if="userId == video.user_id"
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
    <v-card-text class="d-flex flex-column align-start">
      <v-btn class="mb-2" x-small elevation="2" @click="copyUrl">
        Copy URL
        <v-icon class="ml-2" x-small>{{ icons.mdiContentCopy }}</v-icon>
      </v-btn>

      <v-btn class="mb-2" x-small elevation="2" @click="openInTab">
        Open in new tab
        <v-icon class="ml-2" x-small>{{ icons.mdiOpenInNew }}</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "@axios";

import { mdiDelete, mdiContentCopy, mdiOpenInNew } from "@mdi/js";

import { reactive } from "@vue/composition-api";
import { useVideos } from "@/composables/videos/videos";
import { useUser } from "@/composables/user/user";

export default {
  name: "VideoThumbnail",
  props: { video: Object },
  setup({ video }) {
    const { userType, userId } = useUser();
    const { deleteVideo, setClickedVidUrl } = useVideos();

    const state = reactive({
      isDeleting: false,
    });

    function openInTab() {
      window.open(video.url, "_blank");
    }

    function copyUrl() {
      navigator.clipboard
        .writeText(video.url)
        .then(() => {
          alert("Copied to clipboard");
        })
        .catch(() => {
          alert("Failed to copy");
        });
    }

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
      userId,

      del,
      setClickedVidUrl,
      openInTab,
      copyUrl,

      icons: {
        mdiDelete,
        mdiContentCopy,
        mdiOpenInNew,
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
