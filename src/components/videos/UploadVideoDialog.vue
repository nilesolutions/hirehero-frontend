<template>
  <v-dialog
    v-model="videosState.isUploadDialogOpen"
    persistent
    max-width="500"
    @click:outside="closeDialog"
  >
    <v-card class="d-flex flex-column align-center">
      <v-card-title>Upload A Video</v-card-title>

      <v-text-field
        v-model="state.title"
        outlined
        placeholder="Video Title"
        dense
        class="video-title"
      />

      <v-card-text>
        <v-file-input
          v-model="state.file"
          accept="video/*"
          label="Choose video file"
          placeholder="Click here to choose video"
          show-size=""
          outlined
          clearable
          dense
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          :disabled="videosState.isUploading || canUpload"
          :loading="videosState.isUploading"
          color="primary"
          @click="upload"
        >
          Upload
        </v-btn>
        <v-btn
          :disabled="videosState.isUploading"
          @click="toggleUploadDialog(false)"
        >
          Cancel
        </v-btn>
      </v-card-actions>

      <v-progress-linear
        v-show="videosState.isUploading"
        :value="state.uploadProgress"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { reactive, computed } from '@vue/composition-api'
import axios from '@axios'
import { useVideos } from '@/composables/videos/videos'

export default {
  name: 'UploadVideo',
  setup() {
    const {
      state: videosState, toggleUploadDialog, toggleUpload, addVideo,
    } = useVideos()

    const state = reactive({
      file: null,
      title: '',
      uploadProgress: 0,
    })

    const closeDialog = () => {
      if (!videosState.isUploading) toggleUploadDialog(false)
    }

    const canUpload = computed(() => {
      if (state.file) return false
      return true
    })

    async function upload() {
      if (!state.file) return

      try {
        toggleUpload(true)
        state.uploadProgress = 0

        const form = new FormData()
        form.append('file', state.file)
        form.append('title', state.title)
        const response = await axios.post('/media', form, {
          onUploadProgress: event => {
            state.uploadProgress = Math.round((event.loaded / event.total) * 100)
          },
        })
        addVideo(response.data)
        state.file = null
        state.title = ''

        toggleUploadDialog(false)
      } catch (err) {
        console.log(err)
      } finally {
        toggleUpload(false)
      }
    }

    return {
      state,
      videosState,
      canUpload,

      toggleUploadDialog,
      closeDialog,
      upload,
    }
  },
}
</script>

<style scoped>
.video-title{
  width: 100% !important;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
