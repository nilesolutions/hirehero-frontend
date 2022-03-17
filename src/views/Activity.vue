<template>
  <div class="dashboard__content content d-flex flex-column">
    <h2 class="cursive-font black--text mb-2">Activity</h2>

    <v-tabs v-model="activeTab" background-color="transparent" fixed-tabs>
      <v-tab class="cursive-font">Tracked Time</v-tab>
      <v-tab class="cursive-font">Screenshots</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item class="py-4 px-4">
        <time-tracking></time-tracking>
      </v-tab-item>
      <v-tab-item class="py-4 px-4">
        <screenshots-tracking></screenshots-tracking>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import TimeTracking from "@/components/activity/TimeTracking.vue";
import ScreenshotsTracking from "@/components/activity/ScreenshotsTracking.vue";

export default {
  name: "Activity",
  components: {
    TimeTracking,
    ScreenshotsTracking,
  },
  setup() {
    const activeTab = ref(null);

    return {
      activeTab,
    };
  },
};
</script>

<style></style>
