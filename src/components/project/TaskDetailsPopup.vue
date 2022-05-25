<template>
  <v-dialog max-width="750" v-model="isTaskDetailsOpen" @click:outside="setActiveTaskId('')">
    <v-card>
      <v-fade-transition v-if="!isEditingTask" hide-on-leave>
        <div v-if="!isEditingTask" class="d-flex flex-row flex-wrap">
          <task-header></task-header>
          <task-details></task-details>
          <task-attachments></task-attachments>
          <task-actions v-if="userType == 'client'" :task="task"></task-actions>
          <task-comments></task-comments>
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
import TaskActions from "@/components/project/TaskActions.vue";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import TaskComments from "@/components/project/TaskComments.vue";
import TaskDetails from "@/components/project/TaskDetails.vue";
import TaskHeader from "@/components/project/TaskHeader.vue";
import { useAttachments } from "@/composables/tasks/attachments";
import { useComments } from "@/composables/tasks/commnets";
import { useTasks } from "@/composables/tasks/tasks";
import { useUser } from "@/composables/user/user";
import { mdiCheckboxBlank, mdiCheckboxMarked } from "@mdi/js";
import { onUnmounted, reactive } from "@vue/composition-api";

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

<style>
.v-dialog::-webkit-scrollbar {
  display: none;
}

.v-dialog {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
