<template>
  <v-list-item>
    <v-list-item-content>{{ attachment.name }}</v-list-item-content>
    <v-list-item-action>
      <v-btn
        x-small
        icon
        :disabled="state.isDeleting"
        :loading="state.isDownloading"
        @click="downloadAttachment(attachment)"
      >
        <v-icon>{{ icons.mdiDownload }}</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action v-show="userType == 'client'">
      <v-btn :loading="state.isDeleting" @click="deleteAttachment" x-small icon>
        <v-icon>{{ icons.mdiDeleteOutline }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import axios from "@axios";
import { saveAs } from "file-saver";
import { reactive } from "@vue/composition-api";
import { useUser } from "@/composables/user";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import { mdiDeleteOutline, mdiDownload } from "@mdi/js";

export default {
  name: "AttachmentLine",
  props: { attachment: Object, parentTask: Object },
  setup(props, _) {
    const state = reactive({
      isDownloading: false,
      isDeleting: false,
    });
    const { userType } = useUser();
    const { deleteTaskAttachment } = useTasks();

    const attachmentId = props.attachment.id;
    const projectId = useRouter().routeParams().id;
    const parentTaskId = props.parentTask.id;
    const attachmentUrl = `/projects/${projectId}/tasks/${parentTaskId}/attachments/${attachmentId}`;

    async function downloadAttachment(attachment) {
      try {
        state.isDownloading = true;
        var { data: downloadedAttachment } = await axios.get(attachmentUrl);
        const blob = new Blob([downloadedAttachment]);
        saveAs(blob, attachment.name);
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isDownloading = false;
      }
    }

    async function deleteAttachment() {
      try {
        state.isDeleting = true;
        await axios.delete(attachmentUrl);
        deleteTaskAttachment(attachmentId, parentTaskId);
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isDeleting = false;
      }
    }

    return {
      state,
      userType,
      downloadAttachment,
      deleteAttachment,
      icons: { mdiDeleteOutline, mdiDownload },
    };
  },
};
</script>

<style></style>
