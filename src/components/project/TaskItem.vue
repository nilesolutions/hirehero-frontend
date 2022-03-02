<template>
  <v-card class="mb-2">
    <v-card-title>
      {{ task.name }}
      <v-btn class="ml-auto" icon @click="toggleStatus" :loading="isLoading">
        <v-icon :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn x-small color="" small disabled>{{ task.priority }}</v-btn>
    </v-card-text>

    <v-card-text v-show="task.notes">
      {{ task.notes }}
    </v-card-text>

    <v-card-text>
      {{ task.due_on }}
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "@axios";
import { ref } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import { mdiDeleteOutline, mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";

export default {
  name: "TaskItem",
  props: { task: Object },
  setup(props) {
    const { updateTask } = useTasks();
    const isLoading = ref(false);
    const params = useRouter().routeParams();

    async function toggleStatus() {
      try {
        isLoading.value = true;
        const url = `projects/${params.id}/tasks/${props.task.id}`;
        var response = await axios.patch(url, {
          completed: !props.task.completed,
        });
        updateTask(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      toggleStatus,
      isLoading,

      icons: {
        mdiDeleteOutline,
        mdiCheckboxMarked,
        mdiCheckboxBlank,
      },
    };
  },
};
</script>

<style></style>
