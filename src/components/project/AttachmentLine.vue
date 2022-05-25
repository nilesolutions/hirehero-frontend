<template>
  <v-list-item>
    <v-list-item-content>
      <a
        v-if="attachment.name.includes('png') || attachment.name.includes('jpg')"
        :href="state.imgUrl"
        target="_blank"
      >
        <img class="att-img" :src="state.imgUrl" alt="" />
      </a>

      <small v-else class="black--text">{{ attachment.name }}</small>

      <!--<small class="black--text">{{ attachment.name }}</small>-->
    </v-list-item-content>
    <!-- <div class="preview-attachment">
      <img v-bind:src="attachment" />
    </div> -->
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
      <v-btn :loading="state.isDeleting" @click="del" x-small icon>
        <v-icon>{{ icons.mdiDeleteOutline }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { useRouter } from "@/composables/router";
import { useAttachments } from "@/composables/tasks/attachments";
import { useTasks } from "@/composables/tasks/tasks";
import { useUser } from "@/composables/user/user";
import axios from "@axios";
import { mdiDeleteOutline, mdiDownload } from "@mdi/js";
import { reactive } from "@vue/composition-api";
import axiosDefault from "axios";
import { saveAs } from "file-saver";

export default {
  name: "AttachmentLine",
  async created() {
    const { activeTask } = useTasks();
    const attachmentId = this.attachment.id;
    const projectId = useRouter().routeParams().id;
    const parentTaskId = activeTask.value.id;

    const attachmentUrl = `/projects/${projectId}/tasks/${parentTaskId}/attachments/${attachmentId}`;

    var { data } = await axios.get(attachmentUrl);
    this.state.imgUrl = data?.download_url;
  },
  props: { attachment: Object, parentTask: Object },
  setup(props, _) {
    const state = reactive({
      isDownloading: false,
      isDeleting: false,
      imgUrl: "",
    });
    const { userType } = useUser();
    const { activeTask } = useTasks();
    const { deleteAttachment } = useAttachments();

    const attachmentId = props.attachment.id;
    const projectId = useRouter().routeParams().id;
    const parentTaskId = activeTask.value.id;
    const attachmentUrl = `/projects/${projectId}/tasks/${parentTaskId}/attachments/${attachmentId}`;

    async function downloadAttachment(attachment) {
      try {
        state.isDownloading = true;
        var { data } = await axios.get(attachmentUrl);
        var { data: fileBlob } = await axiosDefault.get(data.download_url, {
          responseType: "blob",
        });
        saveAs(fileBlob, attachment.name);
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isDownloading = false;
      }
    }

    async function del() {
      try {
        state.isDeleting = true;
        await axios.delete(attachmentUrl);
        deleteAttachment(attachmentId);
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
      del,

      icons: {
        mdiDeleteOutline,
        mdiDownload,
      },
    };
  },
};
</script>

<style>
.att-img {
  max-width: 120px;
}
</style>
