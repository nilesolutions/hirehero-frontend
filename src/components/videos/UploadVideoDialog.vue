<template>
  <v-dialog
    @click:outside="closeDialog"
    v-model="videosState.isUploadDialogOpen"
    persistent
    max-width="500"
  >
    <v-card class="d-flex flex-column align-center">
      <v-card-title>Upload a video</v-card-title>

      <v-text-field v-model="state.title" outlined placeholder="Title"></v-text-field>

      <label for="">Choose video</label>
      <v-file-input
        v-model="state.file"
        accept="video/*"
        label="Video"
        show-size=""
        clearable
        :hide-input="false"
      ></v-file-input>

      <v-card-actions>
        <v-btn
          @click="upload"
          :disabled="videosState.isUploading"
          :loading="videosState.isUploading"
          color="primary"
        >
          Upload
        </v-btn>
        <v-btn @click="toggleUploadDialog(false)" :disabled="videosState.isUploading">Cancel</v-btn>
      </v-card-actions>

      <v-progress-linear
        v-show="videosState.isUploading"
        :value="state.uploadProgress"
      ></v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, reactive } from "@vue/composition-api";
import axios from "@axios";
import { useVideos } from "@/composables/videos/videos";

export default {
  name: "UploadVideo",
  setup() {
    const { state: videosState, toggleUploadDialog, toggleUpload, addVideo } = useVideos();

    const state = reactive({
      file: null,
      title: "",
      uploadProgress: 0,
    });

    const closeDialog = () => {
      if (!videosState.isUploading) toggleUploadDialog(false);
    };

    async function upload() {
      if (!state.file) return;

      try {
        toggleUpload(true);
        state.uploadProgress = 0;

        const form = new FormData();
        form.append("file", state.file);
        form.append("title", state.title);
        var response = await axios.post("/media", form, {
          onUploadProgress: (event) => {
            state.uploadProgress = Math.round((event.loaded / event.total) * 100);
          },
        });
        addVideo(response.data);
        state.file = null;
        state.title = "";

        toggleUploadDialog(false);
      } catch (err) {
        console.log(err);
      } finally {
        toggleUpload(false);
      }
    }

    return {
      state,
      videosState,

      toggleUploadDialog,
      closeDialog,
      upload,
    };
  },
};
</script>

<style></style>
