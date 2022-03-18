<template>
  <v-dialog @click:outside="closeDialog">
    <v-card> 123 </v-card>
  </v-dialog>
</template>

<script>
import axios from "@axios";
import { ref, onMounted } from "@vue/composition-api";

export default {
  name: "ScreenshotsPopup",
  props: ["activityId"],
  setup(props, { emit }) {
    console.log("Mounted popup", props);

    const closeDialog = () => emit("close");

    onMounted(() => {
      console.log("Real mounted");
    });

    return {
      closeDialog,
    };
  },
};
</script>

<style></style>
