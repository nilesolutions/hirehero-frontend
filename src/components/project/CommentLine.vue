<template>
  <v-card-text class="task__comment pt-2 pb-1">
    <div class="d-flex flex-row align-center">
      <v-avatar
        color="primary"
        size="40"
      >
        <img
          :src="resolveProfilePic(comment.commenter)"
          alt=""
        >
      </v-avatar>
      <div class="ml-2">
        <span class="d-block">{{ comment.commenter.username }}</span>
        <small class="d-block">{{ commentDate }}</small>
      </div>

      <v-menu v-if="showControls">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-auto"
            icon
            dark
            v-bind="attrs"
            :loading="state.isDeleting"
            v-on="on"
          >
            <v-icon color="#000">
              {{ icons.mdiDotsVertical }}
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn
              small
              :disabled="state.isDeleting || state.isEditing"
              @click="state.isEditing = true"
            >
              Edit
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn
              small
              color="warning"
              :loading="state.isDeleting"
              @click="del"
            >
              Delete
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="my-4">
      <span v-if="!state.isEditing">{{ state.commentText }}</span>
      <v-text-field
        v-else
        v-model="state.editText"
        :disabled="state.isUploadingEdits"
        hide-details=""
        dense
      />
    </div>

    <div
      v-if="state.isEditing"
      class="d-flex flex-row mt-2 mb-2"
    >
      <v-btn
        small
        :loading="state.isUploadingEdits"
        :disabled="state.isDeleting"
        @click="saveEdits"
      >
        Save Edits
      </v-btn>
      <v-btn
        small
        class="ml-2"
        :disabled="state.isDeleting || state.isUploadingEdits"
        @click="clearEdits"
      >Cancel</v-btn>
    </div>
  </v-card-text>
</template>

<script>
import axios from '@axios'

import { mdiDeleteOutline, mdiDownload, mdiDotsVertical } from '@mdi/js'
import { reactive, computed } from '@vue/composition-api'
import { useUser } from '@/composables/user/user'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'

import { useComments } from '@/composables/tasks/commnets'
import { resolveProfilePic } from '@/helpers'

export default {
  name: 'CommentLine',
  props: { comment: Object },
  setup(props, _) {
    const state = reactive({
      isDeleting: false,
      isEditing: false,
      isUploadingEdits: false,
      editText: props.comment.text,
      commentText: props.comment.text,
    })

    const { userType, userId } = useUser()
    const { activeTask } = useTasks()
    const { deleteComment } = useComments()

    const commentId = props.comment.id
    const projectId = useRouter().routeParams().id
    const parentTaskId = activeTask.value.id
    const commentUrl = `/projects/${projectId}/tasks/${parentTaskId}/comments/${commentId}`

    const commentDate = computed(() => {
      const date = new Date(props.comment.created_at).toLocaleString()
      return date
    })

    const showControls = computed(() => {
      if (userId.value == props.comment.commenter.id) return true
      return false
    })

    function clearEdits() {
      state.editText = state.commentText
      state.isEditing = false
    }

    async function saveEdits() {
      if (!state.editText) {
        clearEdits()
        return
      }

      if (state.editText == props.comment.text) {
        state.isEditing = false
        clearEdits()
        return
      }

      try {
        state.isUploadingEdits = true
        await axios.patch(commentUrl, {
          text: state.editText,
        })
        state.isEditing = false
        state.commentText = state.editText
      } catch (err) {
        console.log(err)
      } finally {
        state.isUploadingEdits = false
      }
    }

    async function del() {
      try {
        state.isDeleting = true
        await axios.delete(commentUrl)
        deleteComment(commentId)
      } catch (err) {
        console.log(err.response)
      } finally {
        state.isDeleting = false
      }
    }

    return {
      state,
      userType,

      showControls,
      commentDate,

      del,
      saveEdits,
      clearEdits,

      resolveProfilePic,

      icons: {
        mdiDotsVertical,
        mdiDeleteOutline,
        mdiDownload,
      },
    }
  },
}
</script>

<style>
.task__comment {
  background-color: #dadada54;
  border-radius: 6px;
  margin: 0.25rem;
  margin-top: 0rem;
  color: #000;
}
</style>
