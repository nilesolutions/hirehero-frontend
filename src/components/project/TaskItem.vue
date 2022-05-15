<template>
  <v-card class="mb-4" @click="setActiveTaskId(task.id)">
    <v-card-text>
      <v-btn
        small
        depressed
        :color="colorFromPriority()"
        class="task-priority"
        :class="task.priority"
      >
        {{ task.priority }}</v-btn
      >
    </v-card-text>
    <v-card-text class="d-flex flex-row align-center">
      <div>{{ task.name }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
import TaskActions from "@/components/project/TaskActions.vue";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import TaskDetails from "@/components/project/TaskDetails.vue";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks/tasks";
import { useUser } from "@/composables/user/user";
import axios from "@axios";
import {
  mdiCheckboxBlank,
  mdiCheckboxMarked,
  mdiDelete,
  mdiDeleteOutline,
  mdiDownload,
  mdiTooltipEdit,
} from "@mdi/js";
import { reactive } from "@vue/composition-api";

export default {
  name: "TaskItem",
  props: { task: Object },
  components: { TaskAttachments, TaskActions, TaskDetails, TaskActions },
  setup(props) {
    const state = reactive({
      isLoading: false,
      isUploading: false,
      files: [],
    });

    const { userType } = useUser();

    const taskId = props.task.id;
    const { setActiveTaskId, updateTask } = useTasks();
    const projectId = useRouter().routeParams().id;

    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const colorFromPriority = () => {
      if (props.task.priority == "High") return "#EB5757";
      if (props.task.priority == "Medium") return "#FFC207";
      return "#30D988";
    };

    async function toggleStatus() {
      try {
        state.isLoading = true;
        var response = await axios.patch(taskUrl, {
          completed: !props.task.completed,
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
      colorFromPriority,

      setActiveTaskId,

      icons: {
        mdiDeleteOutline,
        mdiCheckboxMarked,
        mdiCheckboxBlank,
        mdiDownload,
        mdiDelete,
        mdiTooltipEdit,
      },
    };
  },
};
</script>

<style lang="scss">
.task-priority.High {
  color: #fff;
}
</style>
