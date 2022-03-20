<template>
  <v-dialog max-width="1000" v-model="isTaskDetailsOpen" @click:outside="setActiveTaskId('')">
    <v-card>
      <v-card-title class="d-flex flex-row align-center">
        <span>{{ task.name }}</span>
        <v-btn class="ml-4" x-small depressed :color="colorFromPriority()">{{
          task.priority
        }}</v-btn>
        <v-btn class="ml-auto" icon @click="toggleStatus" :loading="state.isLoading">
          <v-icon :color="task.completed ? 'primary' : 'grey'">
            {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text> </v-card-text>

      <div class="d-flex flex-row flex-wrap">
        <task-details :task="task"></task-details>
        <task-attachments :parentTask="task"></task-attachments>
        <task-actions v-if="userType == 'client'" :task="task"></task-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@axios";
import { useUser } from "@/composables/user";
import { useTasks } from "@/composables/tasks";
import { useRouter } from "@/composables/router";
import { reactive } from "@vue/composition-api";
import TaskDetails from "@/components/project/TaskDetails.vue";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import TaskActions from "@/components/project/TaskActions.vue";
import { mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";

export default {
  name: "TaskDetailsPopup",
  components: {
    TaskDetails,
    TaskAttachments,
    TaskActions,
  },
  setup() {
    const { setActiveTaskId, activeTask, isTaskDetailsOpen, updateTask } = useTasks();
    const state = reactive({
      isLoading: false,
    });

    const userType = useUser().userType();
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
      userType,
      toggleStatus,
      setActiveTaskId,
      task: activeTask,
      isTaskDetailsOpen,
      colorFromPriority,

      icons: {
        mdiCheckboxMarked,
        mdiCheckboxBlank,
      },
    };
  },
};
</script>

<style></style>
