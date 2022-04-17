<template>
  <v-card-actions class="d-flex col-12">
    <v-btn :loading="state.isUploading">
      <v-file-input
        @change="uploadAttachments"
        :rules="attachmentsValidation"
        class="pt-0 mt-0"
        v-model="state.files"
        multiple
        hide-input
      ></v-file-input>
      <span class="ml-2">Attach</span>
    </v-btn>

    <v-btn @click="toggleEdit(true)">
      <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
      <span class="ml-2">Edit</span>
    </v-btn>

    <v-btn>
      <v-icon>{{ icons.mdiDelete }} </v-icon>
      <span class="ml-2">Delete</span>
    </v-btn>

    <small v-show="state.sizeError"> Attachment size limit is {{ uploadSizeLimit }}MB </small>
    <small v-show="state.error"> {{ state.error }} </small>
  </v-card-actions>
</template>

<script>
import axios from "@axios";
import { validateFileSizes } from "@/helpers";
import { reactive, computed } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks/tasks";
import { mdiDownload, mdiDelete, mdiTooltipEdit } from "@mdi/js";
import { useAttachments } from "@/composables/tasks/attachments";

export default {
  name: "TaskActions",
  props: { task: Object },
  setup(props) {
    const state = reactive({
      error: "",
      sizeError: false,
      isLoading: false,
      isUploading: false,
      isDeleting: false,
      files: [],
    });

    const { toggleEdit } = useTasks();
    const { addAttachment } = useAttachments();

    const uploadSizeLimit = 100;

    const taskId = props.task.id;
    const projectId = useRouter().routeParams().id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const attachmentsUrl = taskUrl + "/attachments";
    const attachmentsValidation = [(files) => validateFileSizes(files, uploadSizeLimit)];

    const canUploadAttachment = computed(() => {
      if (!state.files.length) return false;

      const filesAboveLimit = state.files.some(
        (attachment) => attachment.size > uploadSizeLimit * 1000 * 1000
      );
      if (filesAboveLimit) {
        state.sizeError = true;
        return false;
      }

      return true;
    });

    async function uploadAttachments() {
      try {
        if (!canUploadAttachment.value) return;
        state.isUploading = true;

        const form = new FormData();
        for (var file of state.files) form.append("attachments", file);

        const { data: createdAttachment } = await axios.post(attachmentsUrl, form);
        console.log(createdAttachment);
        addAttachment(createdAttachment);
      } catch (err) {
        state.files = [];
        state.error = "Error while uploading attachment";
      } finally {
        state.isUploading = false;
      }
    }

    return {
      state,
      toggleEdit,
      uploadAttachments,

      attachmentsValidation,
      uploadSizeLimit,

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
