<template>
  <div v-if="attachments.length" class="d-flex flex-column col-12 col-md-6">
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
  <div class="d-flex flex-column col-12 col-md-6" v-else>
    <v-card-text>No attachments</v-card-text>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import { mdiChevronUp, mdiChevronDown, mdiPlus } from "@mdi/js";
import AttachmentLine from "@/components/project/AttachmentLine.vue";
import { useTasks } from "@/composables/tasks";
export default {
  name: "TaskAttachments",
  components: { AttachmentLine },
  setup(props, _) {
    const showAttachments = ref(true);
    const parentTask = useTasks().activeTask.value;
    const attachments = computed(() => parentTask.attachments);

    return {
      parentTask,
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
