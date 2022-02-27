<template>
  <v-dialog @click:outside="closeDialog" v-model="state.isUploadDialogOpen" max-width="500">
    <v-card class="d-flex flex-column align-center">
      <v-card-title>Upload a video</v-card-title>

      <v-file-input accept="video/*" label="File"></v-file-input>

      <v-card-actions>
        <v-btn :disabled="state.isUploading" :loading="state.isUploading" color="primary">
          Upload
        </v-btn>
        <v-btn @click="toggleUploadDialog(false)" :disabled="state.isUploading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useVideos } from "@/composables/videos";

export default {
  name: "UploadVideo",
  setup() {
    const { state, toggleUploadDialog, toggleUpload } = useVideos();
    const file = ref(null);
    console.log("Mounted");

    const closeDialog = () => {
      if (!state.isUploading) toggleUploadDialog(false);
    };

    async function upload() {
      try {
        toggleUpload(true);
        const form = new FormData();
        form.append("file");
      } catch (err) {
      } finally {
        toggleUpload(false);
      }
    }

    return {
      state,
      toggleUploadDialog,
      closeDialog,
    };
  },
};
</script>

<style></style>
