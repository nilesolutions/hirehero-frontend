<template>
  <div class="col-12 col-md-6"></div>
</template>

<script>
import axios from "@axios";
import { onMounted, reactive } from "@vue/composition-api";

export default {
  name: "AssociateInfo",
  setup() {
    const state = reactive({
      isLoading: true,
      associateInfo: {},
    });

    onMounted(() => fetchAssociateInfo());

    async function fetchAssociateInfo() {
      try {
        console.log("Fetchin");
        const { data: associateInfo } = await axios.get("/users/associate");
        console.log(associateInfo);
      } catch (err) {
        console.log();
      }
    }
  },
};
</script>

<style></style>
