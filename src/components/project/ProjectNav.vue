<template>
  <div class="my-2 d-flex flex-row align-center">
    <router-link class="mr-4" to="/projects">
      <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
    </router-link>
    <h2>{{ projectName }}</h2>

    <div class="ml-auto">
      <v-btn color="primary" @click="isCreateDiagOpen = true">
        Add Task <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </div>

    <create-task-dialog
      :isOpen="isCreateDiagOpen"
      @close="isCreateDiagOpen = false"
    ></create-task-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mdiChevronLeft, mdiPlus } from "@mdi/js";
import CreateTaskDialog from "@/components/project/CreateTaskDialog.vue";

export default {
  name: "AddTasks",
  // Use options API to extract from route
  // old Router ver & Vue 2 dont make it easy using composition
  data() {
    return {
      projectName: this.$router.currentRoute.params.projectName,
    };
  },
  components: {
    CreateTaskDialog,
  },
  setup() {
    const isCreateDiagOpen = ref(false);
    return {
      isCreateDiagOpen,

      icons: {
        mdiChevronLeft,
        mdiPlus,
      },
    };
  },
};
</script>

<style></style>
