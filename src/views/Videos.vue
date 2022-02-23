<template>
  <div>
    <div class="d-flex flex-row align-center mb-6">
      <h2>Videos</h2>

      <div class="ml-auto">
        <v-btn @click="state.isRecordOpen = !state.isRecordOpen" color="primary"> Record </v-btn>

        <v-btn @click="isCreateDialogOpen = true" class="ml-2" color="primary"> Upload </v-btn>
      </div>
    </div>

    <record-video v-if="state.isRecordOpen"></record-video>
  </div>
</template>

<script>
import RecordVideo from "@/components/videos/RecordVideo.vue";
import { ref, reactive } from "@vue/composition-api";

export default {
  name: "Videos",
  components: { RecordVideo },
  setup() {
    const state = reactive({
      isRecordOpen: true,
    });

    return {
      state,
    };
  },
};
</script>

<style></style>
