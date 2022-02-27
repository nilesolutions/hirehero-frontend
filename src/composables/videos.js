import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  videos: [],
  isUploading: false,
  isRecording: false,
  isRecordDialogOpen: true,
  isUploadDialogOpen: true,
  recordedVidUrl: "",
});

const setVideos = (entries) => {
  videos.value = entries;
};

const addVideo = (task) => {
  videos.value = [task, ...videos.value];
};

const deleteVideo = (taskId) => {
  videos.value = videos.value.filter((t) => t.id != taskId);
};

const toggleUpload = (val) => (state.isUploading = val);
const toggleRecording = (val) => (state.isRecording = val);
const toggleRecordDialog = (val) => (state.isRecordDialogOpen = val);
const toggleUploadDialog = (val) => (state.isUploadDialogOpen = val);
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
    isCtrlDisabled,

    setVidUrl,
  };
}
