<template>
  <div>
    <div class="d-flex flex-row align-center mb-6">
      <h2>Projects</h2>
      <v-btn @click="isCreateDialogOpen = true" class="ml-auto" color="primary"> Add </v-btn>
    </div>
    <v-card class="mb-6 d">
      <v-card-text class="align-self-center">No projects created</v-card-text>
    </v-card>

    <create-project-dialog
      @close="isCreateDialogOpen = false"
      :isOpen="isCreateDialogOpen"
    ></create-project-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog.vue";

export default {
  name: "Projects",
  components: {
    CreateProjectDialog,
  },
  setup() {
    const isCreateDialogOpen = ref(false);

    return {
      isCreateDialogOpen,
    };
  },
};
</script>

<style></style>
