<template>
  <v-card class="mb-4">
    <v-card-title>
      {{ task.name }}
      <v-btn class="ml-auto" icon @click="toggleStatus" :loading="state.isLoading">
        <v-icon :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <task-details :task="task"></task-details>
    <task-attachments v-show="task.attachments.length" :parentTask="task"></task-attachments>

    <v-card-actions v-show="userType == 'client'">
      <!-- Upload attachments -->
      <v-btn :loading="state.isUploading" x-small icon>
        <v-file-input
          @change="uploadAttachments"
          class="pt-0 mt-0"
          v-model="state.files"
          multiple
          hide-input
        ></v-file-input>
      </v-btn>

      <!-- Edit task -->
      <v-btn icon x-small>
        <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
      </v-btn>

      <!-- Delete -->
      <v-btn icon x-small>
        <v-icon>{{ icons.mdiDelete }} </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "@axios";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import TaskDetails from "@/components/project/TaskDetails.vue";
import { reactive } from "@vue/composition-api";
import { useUser } from "@/composables/user";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import {
  mdiDeleteOutline,
  mdiCheckboxMarked,
  mdiCheckboxBlank,
  mdiDownload,
  mdiDelete,
  mdiTooltipEdit,
} from "@mdi/js";

export default {
  name: "TaskItem",
  props: { task: Object },
  components: { TaskAttachments, TaskDetails },
  setup(props) {
    const state = reactive({
      isLoading: false,
      isUploading: false,
      files: [],
    });

    const userType = useUser().userType();

    const taskId = props.task.id;
    const { updateTask, updateTaskAttachments } = useTasks();
    const projectId = useRouter().routeParams().id;

    const taskUrl = `projects/${projectId}/tasks/${taskId}`;
    const attachmentsUrl = taskUrl + "/attachments";

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

    async function uploadAttachments() {
      try {
        if (!state.files.length) return;
        state.isUploading = true;
        const form = new FormData();
        for (var file of state.files) form.append("attachments", file);
        const response = await axios.post(attachmentsUrl, form);
        updateTaskAttachments(response.data, taskId);
      } catch (err) {
        console.log();
      } finally {
        state.isUploading = false;
      }
    }

    return {
      state,
      userType,
      toggleStatus,
      uploadAttachments,

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

<style lang="scss"></style>
