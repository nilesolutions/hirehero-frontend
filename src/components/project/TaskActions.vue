<template>
  <v-card-actions class="d-flex col-12 flex-wrap task-action-mobile">
    <v-file-input
      ref="filePicker"
      v-model="state.files"
      :rules="attachmentsValidation"
      class="pt-0 mt-0 d-none"
      multiple
      hide-input
      @change="uploadAttachments"
    />

    <div class="attach-box">

      <div class="attach-inner-box">
        <v-btn
          class="mb-2"
          :loading="state.isUploading"
          @click="openFilePicker"
        >
          <v-icon>{{ icons.mdiAttachment }}</v-icon>
          <span class="ml-2">Attach</span>
        </v-btn>
        <small class="ml-2"> Attachment size limit is {{ uploadSizeLimit }}MB </small>
      </div>

      <div class="attach-inner-box-2">

        <v-btn
          class="mb-2 button-padding"
          @click="toggleEdit(true)"
        >
          <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
          <span class="ml-2 ">Edit Task</span>
        </v-btn>

        <v-btn
          class="mb-2 task-att button-padding"
          :loading="state.isDeleting"
          @click="del"
        >
          <v-icon>{{ icons.mdiDelete }} </v-icon>
          <span class="ml-2">Delete Task</span>
        </v-btn>
      </div>

    </div>

    <br>
    <!-- <small class="ml-2"> Attachment size limit is {{ uploadSizeLimit }}MB </small> -->
    <small v-show="state.error"> {{ state.error }} </small>
  </v-card-actions>
</template>

<script>
import axios from '@axios'

import { reactive, computed, ref } from '@vue/composition-api'
import {
  mdiDownload, mdiDelete, mdiTooltipEdit, mdiAttachment,
} from '@mdi/js'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'
import { useAttachments } from '@/composables/tasks/attachments'

import { validateFileSizes } from '@/helpers'

export default {
  name: 'TaskActions',
  props: { task: Object },
  setup(props) {
    const state = reactive({
      error: '',
      sizeError: false,
      isLoading: false,
      isUploading: false,
      isDeleting: false,
      files: [],
    })

    const filePicker = ref(null)

    const { toggleEdit, deleteTask, setActiveTaskId } = useTasks()
    const { addAttachment } = useAttachments()

    const uploadSizeLimit = 100

    const taskId = props.task.id
    const projectId = useRouter().routeParams().id
    const taskUrl = `projects/${projectId}/tasks/${taskId}`

    const attachmentsUrl = `${taskUrl}/attachments`
    const attachmentsValidation = [files => validateFileSizes(files, uploadSizeLimit)]

    function openFilePicker() {
      const pickerElem = filePicker.value.$el
      const button = pickerElem.querySelector('button')

      button.click()
    }

    const canUploadAttachment = computed(() => {
      if (!state.files.length) return false

      const filesAboveLimit = state.files.some(
        attachment => attachment.size > uploadSizeLimit * 1000 * 1000,
      )
      if (filesAboveLimit) {
        state.sizeError = true
        return false
      }

      return true
    })

    async function uploadAttachments() {
      try {
        if (!canUploadAttachment.value) return
        state.isUploading = true

        const form = new FormData()
        for (const file of state.files) form.append('attachments', file)

        const { data: createdAttachment } = await axios.post(attachmentsUrl, form)
        console.log(createdAttachment)
        addAttachment(createdAttachment)
      } catch (err) {
        state.files = []
        state.error = 'Error while uploading attachment'
      } finally {
        state.isUploading = false
      }
    }

    async function del() {
      const confirm = await this.$confirm('Are you sure you want to delete this task?<br> All the data inside will be deleted.', {
        title: 'Warning',
        buttonFalseText: 'Cancel',
        buttonTrueText: 'Delete Task',
      })
      if (!confirm) return
      state.isDeleting = true
      try {
        await axios.delete(`/projects/${projectId}/tasks/${taskId}`)
        setActiveTaskId('')
        deleteTask(taskId)
      } catch (err) {
        console.log(err)
      } finally {
        state.isDeleting = false
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
    }
  },
}
</script>

<style>
.attach-box{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.attach-inner-box{
  display: flex;
  flex-direction: column;
}
.attach-inner-box-2{
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

@media(max-width:767px){
  .attach-box{
  display: flex;
  flex-direction: column;
  width: 100%;
}
.attach-inner-box-2{
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
   gap: 0.3rem;
}
.attach-inner-box{
  width: 100%;
  display: flex;
  flex-direction: column;
}

.button-padding{
  width: 48%;
  padding: 0 0.5rem !important;
}

  .task-action-mobile{
    justify-content: center ;
  }

  .task-att{
    margin-top: 5px;
  }
}
</style>
