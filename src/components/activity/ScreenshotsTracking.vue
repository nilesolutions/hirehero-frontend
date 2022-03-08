<template>
  <div>B</div>
</template>

<script>
import axios from "@axios";
import { onMounted } from "@vue/composition-api";
export default {
  name: "ScreenshotsTracking",
  setup() {
    onMounted(() => console.log("Mounted scshots"));

    async function initScreenshots() {
      try {
      } catch (err) {
        console.log(err);
      }
    }
  },
};
</script>

<style></style>
