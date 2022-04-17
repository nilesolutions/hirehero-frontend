<template>
  <v-dialog @click:outside="closeDialog" v-model="state.isUploadDialogOpen" max-width="500">
    <v-card class="d-flex flex-column align-center">
      <v-card-title>Upload a video</v-card-title>

      <v-text-field v-model="title" outlined placeholder="Title"></v-text-field>

      <v-file-input
        v-model="file"
        accept="video/*"
        label="Video"
        outlined
        show-size=""
        clearable
        :hide-input="false"
        placeholder="Choose video"
      ></v-file-input>

      <v-card-actions>
        <v-btn
          @click="upload"
          :disabled="state.isUploading"
          :loading="state.isUploading"
          color="primary"
        >
          Upload
        </v-btn>
        <v-btn @click="toggleUploadDialog(false)" :disabled="state.isUploading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "@vue/composition-api";
import axios from "@axios";
import { useVideos } from "@/composables/videos/videos";

export default {
  name: "UploadVideo",
  setup() {
    const { state, toggleUploadDialog, toggleUpload, addVideo } = useVideos();
    const file = ref(null);
    const title = ref("");

    const closeDialog = () => {
      if (!state.isUploading) toggleUploadDialog(false);
    };

    async function upload() {
      if (!file.value) return;

      try {
        toggleUpload(true);
        const form = new FormData();
        form.append("file", file.value);
        form.append("title", title.value);
        var response = await axios.post("/media", form);
        addVideo(response.data);
        file.value = null;
        toggleUploadDialog(false);
      } catch (err) {
        console.log(err);
      } finally {
        toggleUpload(false);
      }
    }

    return {
      state,
      toggleUploadDialog,
      closeDialog,
      upload,
      file,
      title,
    };
  },
};
</script>

<style></style>
