<template>
  <div class="d-flex col-12">
    <v-card-text class="d-flex flex-row flex-wrap align-center">
      <h2 class="d-block">{{ task.name }}</h2>
      <v-btn class="ml-4" x-small depressed :color="colorFromPriority()">{{ task.priority }}</v-btn>

      <v-btn class="ml-4" small @click="toggleStatus" :loading="state.isLoading">
        Mark as {{ task.completed ? "Uncomplete" : "Complete" }}
        <v-icon class="ml-2" small :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>

      <v-btn class="ml-auto" icon @click="setActiveTaskId('')" :disabled="state.isLoading">
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card-text>
  </div>
</template>

<script>
import axios from "@axios";
import { useTasks } from "@/composables/tasks/tasks";
import { useRouter } from "@/composables/router";
import { reactive } from "@vue/composition-api";
import { mdiCheckboxMarked, mdiCheckboxBlank, mdiClose } from "@mdi/js";

export default {
  name: "TaskHeader",
  setup() {
    const { activeTask, updateTask, setActiveTaskId } = useTasks();
    const state = reactive({
      isLoading: false,
    });

    const projectId = useRouter().routeParams().id;
    const taskId = activeTask.value.id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const colorFromPriority = () => {
      if (activeTask.value.priority == "High") return "#EB5757";
      if (activeTask.value.priority == "Medium") return "#FFC207";
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
      setActiveTaskId,

      icons: {
        mdiCheckboxMarked,
        mdiCheckboxBlank,
        mdiClose,
      },
    };
  },
};
</script>

<style></style>
