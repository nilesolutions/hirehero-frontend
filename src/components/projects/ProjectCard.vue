<template>
  <v-card class="mb-2" @click="goToProject">
    <v-card-title>
      {{ project.name }}
    </v-card-title>
    <v-card-text>Created at : {{ creationDate }}</v-card-text>

    <v-card-actions>
      <v-btn @click.stop="isDeleteOpen = true" class="ml-auto" icon color="warning" outlined>
        <v-icon>X</v-icon>
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="isDeleteOpen" max-width="500">
      <v-card class="text-center">
        <v-card-text
          >Are your sure you want to delete this project?
          <br />
          This action can not be undone. All tasks within this project will be deleted too.
        </v-card-text>

        <v-card-actions class="text-center justify-center">
          <v-btn
            @click="deleteProject"
            :loading="isLoading"
            :disabled="isLoading"
            color="warning"
            outlined
            >Delete</v-btn
          >
          <v-btn :disabled="isLoading" @click="isDeleteOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import axios from "@axios";

export default {
  name: "ProjectCard",
  props: {
    project: Object,
  },
  setup(props, { emit }) {
    const isDeleteOpen = ref(false);
    const isLoading = ref(false);

    const creationDate = computed(() => {
      return new Date(props.project.created_at).toDateString();
    });

    function goToProject() {
      this.$router.push(`projects/${props.project.id}`);
    }

    async function deleteProject() {
      try {
        isLoading.value = true;
        await axios.delete(`/projects/${props.project.id}`);
        emit("projectDeleted", props.project.id);
        isDeleteOpen.value = false;
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isDeleteOpen,
      isLoading,
      creationDate,
      deleteProject,
      goToProject,
    };
  },
};
</script>

<style></style>
