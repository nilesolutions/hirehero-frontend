<template>
  <div>
    <v-divider></v-divider>
    <v-card-actions>
      Attachments
      <v-btn @click="showAttachments = !showAttachments" x-small icon class="ml-auto">
        <v-icon>{{ showAttachments ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
      </v-btn></v-card-actions
    >

    <v-expand-transition>
      <div v-show="showAttachments">
        <attachment-line
          v-for="attachment in attachments"
          :key="attachment.id"
          :attachment="attachment"
          :parentTask="parentTask"
        ></attachment-line>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import AttachmentLine from "@/components/project/AttachmentLine.vue";
export default {
  name: "TaskAttachments",
  props: { attachments: Array, parentTask: String },
  components: { AttachmentLine },
  setup() {
    const showAttachments = ref(false);

    return {
      showAttachments,

      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    };
  },
};
</script>

<style></style>
