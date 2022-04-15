import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  videos: [],
  isUploading: false,
  isRecording: false,
  isRecordDialogOpen: false,
  isUploadDialogOpen: false,
  isLoadingVideos: false,
  recordedVidUrl: "",
});

const setVideos = (entries) => {
  state.videos = entries;
};

const addVideo = (video) => {
  state.videos = [video, ...state.videos];
};

const deleteVideo = (videoId) => {
  state.videos = state.videos.filter((t) => t.id != videoId);
};

const toggleUpload = (val) => (state.isUploading = val);
const toggleRecording = (val) => (state.isRecording = val);
const toggleRecordDialog = (val) => (state.isRecordDialogOpen = val);
const toggleUploadDialog = (val) => (state.isUploadDialogOpen = val);
const toggleLoading = (val) => (state.isLoadingVideos = val);
const isCtrlDisabled = computed(() => state.isRecording || state.isUploading);
const setVidUrl = (val) => (state.recordedVidUrl = val);

export function useVideos() {
  return {
    state: readonly(state),
    setVideos,
    addVideo,
    deleteVideo,

    toggleUpload,
    toggleRecordDialog,
    toggleUploadDialog,
    toggleRecording,
    toggleLoading,
    isCtrlDisabled,

    setVidUrl,
  };
}
