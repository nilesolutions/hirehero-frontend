<template>
  <div class="d-flex col-12">
    <v-card-title class="d-flex flex-row align-center">
      <span>{{ task.name }}</span>
      <v-btn class="ml-4" x-small depressed :color="colorFromPriority()">{{ task.priority }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="ml-auto" icon @click="toggleStatus" :loading="state.isLoading">
        <v-icon :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>
    </v-card-title>
  </div>
</template>

<script>
import axios from "@axios";
import { useUser } from "@/composables/user";
import { useTasks } from "@/composables/tasks";
import { useRouter } from "@/composables/router";
import { reactive } from "@vue/composition-api";
import { mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";

export default {
  name: "TaskHeader",
  setup() {
    const { activeTask, updateTask } = useTasks();
    const state = reactive({
      isLoading: false,
    });

    const projectId = useRouter().routeParams().id;
    const taskId = activeTask.value.id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const colorFromPriority = () => {
      if (activeTask.value.priority == "high") return "#EB5757";
      if (activeTask.value.priority == "mid") return "#FFC207";
      return "#30D988";
    };

    async function toggleStatus() {
      try {
        state.isLoading = true;
        var response = await axios.patch(taskUrl, {
          completed: !activeTask.value.completed,
        });
        updateTask(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      colorFromPriority,
      task: activeTask,
      toggleStatus,
      icons: {
        mdiCheckboxMarked,
        mdiCheckboxBlank,
      },
    };
  },
};
</script>

<style></style>
