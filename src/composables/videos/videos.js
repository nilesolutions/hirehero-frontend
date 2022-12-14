/* eslint-disable no-return-assign */
import {
  computed, reactive, readonly, set,
} from '@vue/composition-api'

const state = reactive({
  videos: {
    myVideos: [],
    associateVideos: [],
  },
  isUploading: false,
  isRecording: false,
  isRecordDialogOpen: false,
  isUploadDialogOpen: false,
  isLoadingVideos: false,
  recordedVidUrl: '',
  clickedVideoUrl: '',
})

const setVideos = entries => {
  state.videos = entries
}

const addVideo = video => {
  state.videos.myVideos = [video, ...state.videos.myVideos]
}

const updateVideo = newVideo => {
  const idx = state.videos.myVideos.findIndex(vid => vid.id === newVideo.id)
  set(state.videos.myVideos, idx, newVideo)
}

const deleteVideo = videoId => {
  state.videos.myVideos = state.videos.myVideos.filter(t => t.id !== videoId)
}

const activeVideo = computed(() => {
  const allVideos = [...state.videos.myVideos, ...state.videos.associateVideos]
  return allVideos.find(video => video.url === state.clickedVideoUrl)
})

const toggleUpload = val => (state.isUploading = val)
const toggleRecording = val => (state.isRecording = val)
const toggleRecordDialog = val => (state.isRecordDialogOpen = val)
const toggleUploadDialog = val => (state.isUploadDialogOpen = val)
const toggleLoading = val => (state.isLoadingVideos = val)
const isCtrlDisabled = computed(() => state.isRecording || state.isUploading)
const setVidUrl = val => (state.recordedVidUrl = val)
const setClickedVidUrl = val => (state.clickedVideoUrl = val)

const myVideos = computed(() => {
  if (state.videos.myVideos) return state.videos.myVideos
  return []
})

const associateVideos = computed(() => {
  if (state.videos.associateVideos) return state.videos.associateVideos
  return []
})

// eslint-disable-next-line import/prefer-default-export
export function useVideos() {
  return {
    state: readonly(state),
    setVideos,
    addVideo,
    updateVideo,
    deleteVideo,

    toggleUpload,
    toggleRecordDialog,
    toggleUploadDialog,
    toggleRecording,
    toggleLoading,
    isCtrlDisabled,

    setVidUrl,
    setClickedVidUrl,
    activeVideo,

    myVideos,
    associateVideos,
  }
}
