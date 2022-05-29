<template>
  <v-card-actions class="d-flex col-12 flex-wrap">
    <v-file-input
      ref="filePicker"
      @change="uploadAttachments"
      :rules="attachmentsValidation"
      class="pt-0 mt-0 d-none"
      v-model="state.files"
      multiple
      hide-input
    ></v-file-input>

    <v-btn class="mb-2" :loading="state.isUploading" @click="openFilePicker">
      <v-icon>{{ icons.mdiAttachment }}</v-icon>
      <span class="ml-2">Attach</span>
    </v-btn>

    <v-btn class="mb-2" @click="toggleEdit(true)">
      <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
      <span class="ml-2">Edit Task</span>
    </v-btn>

    <v-btn class="mb-2" @click="del" :loading="state.isDeleting">
      <v-icon>{{ icons.mdiDelete }} </v-icon>
      <span class="ml-2">Delete Task</span>
    </v-btn>

    <br />
    <small class="ml-2"> Attachment size limit is {{ uploadSizeLimit }}MB </small>
    <small v-show="state.error"> {{ state.error }} </small>
  </v-card-actions>
</template>

<script>
import axios from "@axios";

import { reactive, computed, ref } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks/tasks";
import { useAttachments } from "@/composables/tasks/attachments";

import { validateFileSizes } from "@/helpers";
import { mdiDownload, mdiDelete, mdiTooltipEdit, mdiAttachment } from "@mdi/js";

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

    const filePicker = ref(null);

    const { toggleEdit, deleteTask, setActiveTaskId } = useTasks();
    const { addAttachment } = useAttachments();

    const uploadSizeLimit = 100;

    const taskId = props.task.id;
    const projectId = useRouter().routeParams().id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const attachmentsUrl = taskUrl + "/attachments";
    const attachmentsValidation = [(files) => validateFileSizes(files, uploadSizeLimit)];

    function openFilePicker() {
      const pickerElem = filePicker.value.$el;
      const button = pickerElem.querySelector("button");

      button.click();
    }

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

    async function del() {
      const confirm = await this.$confirm("Are you sure you want to delete this task?<br> All the data inside will be deleted.", {
        title: "Warning",
        buttonFalseText: "Cancel",
        buttonTrueText: "Delete Task"
      });
      if (!confirm) return;
      state.isDeleting = true;
      try {
        await axios.delete(`/projects/${projectId}/tasks/${taskId}`);
        setActiveTaskId("");
        deleteTask(taskId);
      } catch (err) {
        console.log(err);
      } finally {
        state.isDeleting = false;
      }
    }

    return {
      state,

      toggleEdit,
      filePicker,
      openFilePicker,

      uploadAttachments,
      del,

      attachmentsValidation,
      uploadSizeLimit,

      icons: {
        mdiDownload,
        mdiDelete,
        mdiTooltipEdit,
        mdiAttachment,
      },
    };
  },
};
</script>

<style></style>
