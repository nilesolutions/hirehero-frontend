<template>
  <v-dialog v-model="isDetailsOpen" @click:outside="setClickedActivityId('')">
    <v-card :loading="isLoading">
      <v-card-title class="cursive-font text-center">
        <span class="d-block text-center"> Details </span>
        <v-btn @click="setClickedActivityId('')" class="ml-auto" icon>
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <div v-for="detail in activityDetails" :key="detail.id">
        <v-card-title>Activity Level: {{ detail.activityLevel }} </v-card-title>

        <v-card-title>Open Apps / Websites</v-card-title>
        <v-card-text>
          {{ detail.applications.map((app) => app.applicationName).join(" | ") }}
        </v-card-text>

        <v-card-title>Screenshot</v-card-title>
        <v-card-text class="screenshot-wrapper">
          <a :href="detail.url" target="_blank">
            <img :src="detail.thumbUrl" alt="" />
          </a>
          <small class="d-block">
            Captured at {{ new Date(detail.taken * 1000).toLocaleString() }}
          </small>
        </v-card-text>
        <v-divider></v-divider>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@axios";
import { useActivity } from "@/composables/activity/activity";
import { ref, onMounted } from "@vue/composition-api";
import { mdiClose } from "@mdi/js";

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
        console.log(data);
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

      icons: { mdiClose },
    };
  },
};
</script>

<style lang="scss">
.screenshot-wrapper {
  max-width: 500px;

  img {
    max-width: 100%;
    object-fit: cover;
  }
}
</style>
