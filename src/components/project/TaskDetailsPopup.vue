<template>
  <v-dialog max-width="750" v-model="isTaskDetailsOpen" @click:outside="setActiveTaskId('')">
    <v-card>
      <v-fade-transition v-if="!isEditingTask" hide-on-leave>
        <div v-if="!isEditingTask" class="d-flex flex-row flex-wrap">
          <task-header></task-header>
          <task-details></task-details>
          <task-attachments></task-attachments>
          <task-comments></task-comments>
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
import EditTask from "@/components/project/EditTask.vue";
import TaskHeader from "@/components/project/TaskHeader.vue";
import TaskActions from "@/components/project/TaskActions.vue";
import TaskDetails from "@/components/project/TaskDetails.vue";
import TaskComments from "@/components/project/TaskComments.vue";
import TaskAttachments from "@/components/project/TaskAttachments.vue";

import { useAttachments } from "@/composables/tasks/attachments";
import { useUser } from "@/composables/user/user";
import { useTasks } from "@/composables/tasks/tasks";

import { reactive, onUnmounted } from "@vue/composition-api";
import { mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";
import { useComments } from "@/composables/tasks/commnets";

export default {
  name: "TaskDetailsPopup",
  components: {
    TaskHeader,
    TaskDetails,
    TaskActions,
    TaskComments,
    TaskAttachments,
    EditTask,
  },
  setup() {
    const { setActiveTaskId, activeTask, isTaskDetailsOpen, isEditingTask } = useTasks();
    const state = reactive({
      isEditing: false,
    });

    const { userType } = useUser();
    const { setAttachments } = useAttachments();
    const { setComments } = useComments();

    onUnmounted(() => {
      setAttachments([]);
      setComments([]);
    });

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
