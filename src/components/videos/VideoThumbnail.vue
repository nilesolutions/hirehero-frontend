<template>
  <v-card class="video-card mb-5 mt-3 m-right p-relative">
    <video
      @click="setClickedVidUrl(video.url)"
      class="video-thumbnail"
      :src="video.url"
      preload="meta"
    ></video>

    <v-tooltip bottom color="error">
      <template v-slot:activator="{ on, attrs }">
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
          v-bind="attrs"
          v-on="on"
        >
          <v-icon style="color: white">{{ icons.mdiDelete }}</v-icon>
        </v-btn>
      </template>

      <span class="tooltip-font ">Delete</span>
    </v-tooltip>

    <v-card-text class="mt-2 black--text d-flex flex-row align-right text-capitalize">
      <span class="d-block text-capitalize">{{ video.title || "No Title" }}</span>
      <v-tooltip bottom color="error">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-auto"
            icon
            small
            @click="state.isEditingTitle = true"
            v-if="userId == video.user_id"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>{{ icons.mdiPencilOutline }}</v-icon>
          </v-btn>
        </template>
        <span class="tooltip-font">Edit Title</span>
      </v-tooltip>
    </v-card-text>

    <v-card-text class="d-flex flex-column align-start">
      <v-btn class="mb-2" x-small elevation="2" @click="copyUrl">
        Copy Link
        <v-icon class="ml-2" x-small>{{ icons.mdiContentCopy }}</v-icon>
      </v-btn>
    </v-card-text>

    <v-dialog v-model="state.isEditingTitle" width="fit-content" persistent>
      <v-card class="d-flex flex-column align-center">
        <v-card-text>
          <v-text-field
            v-model="state.updatedTitle"
            dense
            outlined
            placeholder="Update video title"
            hide-details=""
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="update"
            :loading="state.isSubmitting"
            :disabled="!canUpdate || state.isSubmitting"
            color="primary"
            >Update
          </v-btn>
          <v-btn @click="closeUpdateDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { useUser } from "@/composables/user/user";
import { useVideos } from "@/composables/videos/videos";
import axios from "@axios";
import { mdiContentCopy, mdiDelete, mdiOpenInNew, mdiPencilOutline } from "@mdi/js";
import { computed, reactive } from "@vue/composition-api";

export default {
  name: "VideoThumbnail",
  props: { video: Object },
  setup({ video }) {
    const { userType, userId } = useUser();
    const { updateVideo, deleteVideo, setClickedVidUrl } = useVideos();

    const state = reactive({
      isDeleting: false,
      isEditingTitle: false,
      isSubmitting: false,
      updatedTitle: "",
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

    function closeUpdateDialog() {
      state.isEditingTitle = false;
      state.updatedTitle = "";
    }

    const canUpdate = computed(() => {
      if (!state.updatedTitle.length) return false;
      return true;
    });

    async function update() {
      const videoId = video.id;
      try {
        state.isSubmitting = true;
        const { data: video } = await axios.patch(`/media/${videoId}`, {
          title: state.updatedTitle,
        });
        updateVideo(video);
      } catch (err) {
        await this.$confirm("Error while updating video, Please try again later.", {
          buttonFalseText: "",
          buttonTrueText: "Confirm",
        });
      } finally {
        state.isSubmitting = false;
        state.isEditingTitle = false;
      }
    }

    async function del(videoId) {
      const confirm = await this.$confirm("Delete video ?", { title: "Warning" });
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

      closeUpdateDialog,
      canUpdate,
      update,

      icons: {
        mdiDelete,
        mdiContentCopy,
        mdiOpenInNew,
        mdiPencilOutline,
      },
    };
  },
};
</script>

<style>

.video-card {
  cursor: pointer;
}
.p-relative{
  position: relative !important;
}

.video-thumbnail {
  max-width: 300px ;
  height: 150px ;
  max-height: 185px;
}

.video-player-container {
  width: fit-content;
  max-width: 90%;
  margin: auto;
}

.v-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.theme--light.v-btn::before,
button.theme--light.v-btn:hover::before {
  opacity: 0.08 !important;
}

.m-right{
    margin-right: 20px;
  }
.v-btn--fab.v-size--x-small.v-btn--absolute.v-btn--top{
  top: 16px !important;
}
.v-card__text.mt-2.black--text.d-flex.flex-row.align-center.text-capitalize{
  overflow: hidden;
  word-break: break-all !important;
  max-width: 325px !important;
}
.video-card.mb-5.mt-3.m-right.p-relative.v-card.v-sheet.theme--light{
max-width: 325px !important;
}

.v-dialog > .v-card > .v-card__title{
  max-height: 100px !important;
}
.d-block.text-capitalize{
  word-break: break-all !important;
}
.v-card.title.d-flex.flex-row{
  padding: 0 !important;
}
.text-capitalize {
  padding: 5px 2px !important;
  padding-right: 20px !important;
}
.ml-auto.my-hover-btn.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--default{
  position: absolute !important;
  right: 5px;
}
.v-card__text.mt-2.black--text.d-flex.flex-row.align-right.text-capitalize{
  padding-left: 20px !important;
  padding-right: 20px !important;
}
@media (max-width:768px) {
  .m-right{
    margin-right: 0px !important;
  }
  .video-thumbnail {
  max-width: 500px !important;
  height: 200px !important;
  max-height: 300px;
  top: 0 !important;
  bottom: 0 !important;
  left:  0 !important;
  right: 0 !important;
}
.video-card.mb-5.mt-3.m-right.p-relative.v-card.v-sheet.theme--light{
max-width: 415px !important;
}
}
</style>
