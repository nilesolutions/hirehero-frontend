<template>
  <div class="dashboard__content">
    <div class="d-flex flex-row align-center mb-6">
      <h2 class="cursive-font black--text">
        Videos
      </h2>

      <div class="ml-auto">
        <v-tooltip
          bottom
          color="error"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="primary"
              tile
              :outlined="state.isRecordDialogOpen"
              :disabled="isCtrlDisabled"
              @click="toggleRecordDialog(!state.isRecordDialogOpen)"
            >
              Record
            </v-btn>
          </template>
          <span class="tooltip-font">Click to record a new video</span>
        </v-tooltip>

        <v-tooltip
          bottom
          color="info"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="ml-2 video-upload"
              color="info"
              tile
              :disabled="isCtrlDisabled"
              @click="toggleUploadDialog(true)"
            >
              Upload
            </v-btn>
          </template>
          <span class="tooltip-font">Click to upload a video</span>
        </v-tooltip>

      </div>
    </div>

    <record-video v-if="state.isRecordDialogOpen" />
    <upload-video />
    <videos-grid />
  </div>
</template>

<script>
import axios from '@axios'
import { mdiDelete } from '@mdi/js'
import { onMounted } from '@vue/composition-api'
import RecordVideo from '@/components/videos/RecordVideo.vue'
import UploadVideo from '@/components/videos/UploadVideoDialog.vue'
import VideosGrid from '@/components/videos/VideosGrid.vue'
import { useUser } from '@/composables/user/user'
import { useVideos } from '@/composables/videos/videos'

export default {
  name: 'Videos',
  components: { RecordVideo, UploadVideo, VideosGrid },
  setup() {
    const {
      state,
      setVideos,
      deleteVideo,
      toggleRecordDialog,
      isCtrlDisabled,
      toggleLoading,
      toggleUploadDialog,
    } = useVideos()

    const { userType } = useUser()

    onMounted(() => initVideos())

    async function initVideos() {
      try {
        toggleLoading(true)
        const response = await axios.get('/media')
        // console.log(response)
        setVideos(response.data)
      } catch (err) {
        // console.log(err)
      } finally {
        toggleLoading(false)
      }
    }

    async function del(videoId) {
      try {
        await axios.delete(`/media/${videoId}`)
        deleteVideo(videoId)
      } catch (err) {
        // console.log(err.response)
      }
    }
    return {
      userType,
      state,
      toggleRecordDialog,
      toggleUploadDialog,
      isCtrlDisabled,
      del,

      icons: {
        mdiDelete,
      },
    }
  },
}
</script>

<style>
.video-upload {
  background: #017efa;
}
</style>
