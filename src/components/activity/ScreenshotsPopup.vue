<template>
  <v-dialog v-model="isDetailsOpen" @click:outside="setClickedActivityId('')">
    <v-card :loading="isLoading">
      <v-card-title>Activity Details</v-card-title>
      <div v-for="detail in activityDetails" :key="detail.id">
        <v-card-title>Activity Level</v-card-title>
        <v-card-text> {{ detail.activityLevel }} </v-card-text>

        <v-card-title>Open Apps / Websites</v-card-title>
        <v-card-text>
          {{ detail.applications.map((app) => app.applicationName).join(",") }}
        </v-card-text>

        <v-card-title>Screenshot</v-card-title>
        <v-card-text> <img :src="detail.url" alt="" /> </v-card-text>
        <v-divider></v-divider>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@axios";
import { useActivity } from "@/composables/activity";
import { ref, onMounted } from "@vue/composition-api";

export default {
  name: "ScreenshotsPopup",
  setup() {
    const { setClickedActivityId, isDetailsOpen, state } = useActivity();
    const activityDetails = ref([]);
    const isLoading = ref(false);

    onMounted(() => fetchActivityDetails());

    async function fetchActivityDetails() {
      try {
        isLoading.value = true;
        const { data } = await axios.get("/tracker/screenshots", {
          params: { activityId: state.clickedActivityId },
        });
        activityDetails.value = data;
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isLoading,
      isDetailsOpen,
      activityDetails,
      setClickedActivityId,
    };
  },
};
</script>

<style></style>
