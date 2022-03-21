<template>
  <v-card-actions class="d-flex col-12">
    <v-btn :loading="state.isUploading" icon>
      <v-file-input
        @change="uploadAttachments"
        class="pt-0 mt-0"
        v-model="state.files"
        multiple
        hide-input
      ></v-file-input>
    </v-btn>

    <v-btn @click="toggleEdit(true)" icon>
      <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>{{ icons.mdiDelete }} </v-icon>
    </v-btn>
  </v-card-actions>
</template>

<script>
import axios from "@axios";
import { reactive } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import { mdiDownload, mdiDelete, mdiTooltipEdit } from "@mdi/js";

export default {
  name: "TaskActions",
  props: { task: Object },
  setup(props) {
    const state = reactive({
      isLoading: false,
      isUploading: false,
      isDeleting: false,
      files: [],
    });

    const { updateTaskAttachments, toggleEdit } = useTasks();

    const taskId = props.task.id;
    const projectId = useRouter().routeParams().id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const attachmentsUrl = taskUrl + "/attachments";

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
      toggleEdit,
      uploadAttachments,

      icons: {
        mdiDownload,
        mdiDelete,
        mdiTooltipEdit,
      },
    };
  },
};
</script>

<style></style>
