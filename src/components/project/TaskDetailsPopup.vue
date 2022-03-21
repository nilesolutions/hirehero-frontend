<template>
  <v-dialog max-width="1000" v-model="isTaskDetailsOpen" @click:outside="setActiveTaskId('')">
    <v-card>
      <v-fade-transition v-if="!isEditingTask" hide-on-leave>
        <div v-if="!isEditingTask" class="d-flex flex-row flex-wrap">
          <task-header></task-header>
          <task-details></task-details>
          <task-attachments></task-attachments>
          <task-actions v-if="userType == 'client'" :task="task"></task-actions>
        </div>
      </v-fade-transition>
      <v-fade-transition v-else hide-on-leave>
        <div>
          <edit-task></edit-task>
        </div>
      </v-fade-transition>
    </v-card>
  </v-dialog>
</template>

<script>
import { useUser } from "@/composables/user";
import { useTasks } from "@/composables/tasks";
import { reactive } from "@vue/composition-api";
import TaskDetails from "@/components/project/TaskDetails.vue";
import TaskHeader from "@/components/project/TaskHeader.vue";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import TaskActions from "@/components/project/TaskActions.vue";
import EditTask from "@/components/project/EditTask.vue";
import { mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";

export default {
  name: "TaskDetailsPopup",
  components: {
    TaskHeader,
    TaskDetails,
    TaskAttachments,
    TaskActions,
    EditTask,
  },
  setup() {
    const { setActiveTaskId, activeTask, isTaskDetailsOpen, isEditingTask } = useTasks();
    const state = reactive({
      isEditing: false,
    });

    const userType = useUser().userType();

    return {
      state,
      userType,
      isEditingTask,
      isTaskDetailsOpen,
      setActiveTaskId,
      task: activeTask,

      icons: {
        mdiCheckboxMarked,
        mdiCheckboxBlank,
      },
    };
  },
};
</script>

<style></style>
