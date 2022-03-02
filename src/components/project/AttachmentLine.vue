<template>
  <v-list-item>
    <v-list-item-content>{{ attachment.name }}</v-list-item-content>
    <v-list-item-action>
      <v-btn x-small icon :loading="isDownloading" @click="downloadAttachment(attachment)">
        <v-icon>{{ icons.mdiDownload }}</v-icon>
      </v-btn>
    </v-list-item-action>
    <v-list-item-action>
      <v-btn x-small icon>
        <v-icon>{{ icons.mdiDeleteOutline }}</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import defaultAxios from "axios";
import { saveAs } from "file-saver";
import { ref } from "@vue/composition-api";
import { mdiDeleteOutline, mdiDownload } from "@mdi/js";
export default {
  name: "AttachmentLine",
  props: { attachment: Object },
  setup() {
    const isDownloading = ref(false);

    async function downloadAttachment(attachment) {
      try {
        isDownloading.value = true;
        const response = await defaultAxios.get(attachment.download_url, { responseType: "blob" });
        console.log(response);
        const blob = new Blob([response.data]);
        saveAs(blob, attachment.name);
      } catch (err) {
        console.log(err.response);
      } finally {
        isDownloading.value = false;
      }
    }

    return {
      isDownloading,
      downloadAttachment,
      icons: { mdiDeleteOutline, mdiDownload },
    };
  },
};
</script>

<style></style>
