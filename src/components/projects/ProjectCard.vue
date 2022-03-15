<template>
  <div class="col-12 col-sm-6 col-lg-4">
    <v-card class="mb-2" @click="goToProject">
      <v-card-title class="font-weight-black black--text">
        {{ project.name }}
      </v-card-title>

      <v-card-actions>
        <small class="black--text font-weight-medium">{{ creationDate }}</small>

        <div v-if="userType == 'client'" class="actions ml-auto">
          <v-btn @click.stop="isDeleteOpen = true" class="ml-auto" icon color="warning" outlined>
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </div>
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
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import { useUser } from "@/composables/user";
import axios from "@axios";
import { mdiDelete } from "@mdi/js";

export default {
  name: "ProjectCard",
  props: {
    project: Object,
  },
  setup(props, { emit }) {
    const isDeleteOpen = ref(false);
    const isLoading = ref(false);
    const userType = useUser().userType();

    const creationDate = computed(() => {
      return new Date(props.project.created_at).toLocaleString();
    });

    function goToProject() {
      this.$router.push({
        name: "project",
        params: { id: props.project.id, projectName: props.project.name },
      });
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
      userType,

      icons: {
        mdiDelete,
      },
    };
  },
};
</script>

<style></style>
