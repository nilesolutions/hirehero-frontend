<template>
  <div
    v-if="!attachments.length & !state.isLoading"
    class="d-flex flex-column col-12"
  >
    <v-card-text>No attachments</v-card-text>
  </div>
  <div
    v-else-if="state.isLoading"
    class="mx-auto"
  >
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>
  <div
    v-else
    class="d-flex flex-column col-12"
  >
    <v-card-actions>
      Attachments
      <v-btn
        class="ml-auto"
        x-small
        icon
        @click="state.showAttachments = !state.showAttachments"
      >
        <v-icon>{{ state.showAttachments ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="state.showAttachments">
        <attachment-line
          v-for="attachment in attachments"
          :key="attachment.id"
          :attachment="attachment"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import axios from '@axios'
import { mdiChevronUp, mdiChevronDown, mdiPlus } from '@mdi/js'
import { onMounted, reactive } from '@vue/composition-api'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'
import { useAttachments } from '@/composables/tasks/attachments'

import AttachmentLine from '@/components/project/AttachmentLine.vue'

export default {
  name: 'TaskAttachments',
  components: { AttachmentLine },
  setup() {
    const { setAttachments, attachments } = useAttachments()

    const { activeTask } = useTasks()
    const projectId = useRouter().routeParams().id

    const state = reactive({
      isLoading: false,
      showAttachments: true,
    })

    onMounted(() => fetchAttachments())

    async function fetchAttachments() {
      try {
        state.isLoading = true
        if (attachments.value.length) return

        const { data: fetchedAttachments } = await axios.get(
          `/projects/${projectId}/tasks/${activeTask.value.id}/attachments`,
        )
        setAttachments(fetchedAttachments)
      } catch (err) {
        console.log(err)
      } finally {
        state.isLoading = false
      }
    }

    return {
      state,
      attachments,

      icons: {
        mdiChevronUp,
        mdiChevronDown,
        mdiPlus,
      },
    }
  },
}
</script>

<style></style>
