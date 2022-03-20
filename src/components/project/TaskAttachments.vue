<template>
  <div class="d-flex flex-column col-12 col-md-6">
    <v-card-actions>
      Attachments
      <v-btn class="ml-auto" @click="showAttachments = !showAttachments" x-small icon>
        <v-icon>{{ showAttachments ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
      </v-btn>
    </v-card-actions>

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
import { ref, computed } from "@vue/composition-api";
import { mdiChevronUp, mdiChevronDown, mdiPlus } from "@mdi/js";
import AttachmentLine from "@/components/project/AttachmentLine.vue";
export default {
  name: "TaskAttachments",
  props: { parentTask: Object },
  components: { AttachmentLine },
  setup(props, _) {
    const showAttachments = ref(true);
    const attachments = computed(() => props.parentTask.attachments);

    return {
      attachments,
      showAttachments,

      icons: {
        mdiChevronUp,
        mdiChevronDown,
        mdiPlus,
      },
    };
  },
};
</script>

<style></style>
