<template>
  <v-card-text class="task__comment pt-2 pb-1">
    <div class="d-flex flex-row align-center">
      <v-avatar color="primary" size="40">
        {{ comment.userName[0] }}
      </v-avatar>
      <div class="ml-2">
        <span class="d-block">{{ comment.userName }}</span>
        <small class="d-block">{{ commentDate }}</small>
      </div>

      <v-menu v-if="showControls">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ml-auto" icon dark v-bind="attrs" v-on="on" :loading="state.isDeleting">
            <v-icon color="#000">{{ icons.mdiDotsVertical }}</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn
              small
              @click="state.isEditing = true"
              :disabled="state.isDeleting || state.isEditing"
            >
              Edit
            </v-btn>
          </v-list-item>

          <v-list-item>
            <v-btn small color="warning" @click="del" :loading="state.isDeleting">Delete</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="my-4">
      <span v-if="!state.isEditing">{{ comment.text }}</span>
      <v-text-field
        v-else
        v-model="state.text"
        :disabled="state.isUploadingEdits"
        hide-details=""
        dense
      ></v-text-field>
    </div>

    <div class="d-flex flex-row mt-2 mb-2" v-if="state.isEditing">
      <v-btn
        small
        @click="saveEdits"
        :loading="state.isUploadingEdits"
        :disabled="state.isDeleting"
      >
        Save Edits
      </v-btn>
      <v-btn
        small
        class="ml-2"
        @click="state.isEditing = false"
        :disabled="state.isDeleting || state.isUploadingEdits"
        >Cancel</v-btn
      >
    </div>
  </v-card-text>
</template>

<script>
import axios from "@axios";

import { useUser } from "@/composables/user/user";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks/tasks";
import { mdiDeleteOutline, mdiDownload, mdiDotsVertical } from "@mdi/js";

import { reactive, computed } from "@vue/composition-api";
import { useComments } from "@/composables/tasks/commnets";

export default {
  name: "CommentLine",
  props: { comment: Object },
  setup(props, _) {
    console.log("Comment line created");
    const state = reactive({
      isDeleting: false,
      isEditing: false,
      isUploadingEdits: false,
      text: props.comment.text,
    });

    const { userType, userId } = useUser();
    const { activeTask } = useTasks();
    const { deleteComment, updateComment } = useComments();

    const commentId = props.comment.id;
    const projectId = useRouter().routeParams().id;
    const parentTaskId = activeTask.value.id;
    const commentUrl = `/projects/${projectId}/tasks/${parentTaskId}/comments/${commentId}`;

    const commentDate = computed(() => {
      const date = new Date(props.comment.created_at).toLocaleString();
      return date;
    });

    const showControls = computed(() => {
      if (userId.value == props.comment.userId) return true;
      return false;
    });

    async function saveEdits() {
      if (!state.text) return;

      if (state.text == props.comment.text) {
        state.isEditing = false;
        return;
      }

      try {
        state.isUploadingEdits = true;
        const { data: updatedComment } = await axios.patch(commentUrl, {
          text: state.text,
        });
        state.isEditing = false;
        updateComment(updatedComment);
      } catch (err) {
        console.log(err);
      } finally {
        state.isUploadingEdits = false;
      }
    }

    async function del() {
      try {
        state.isDeleting = true;
        await axios.delete(commentUrl);
        deleteComment(commentId);
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isDeleting = false;
      }
    }

    return {
      state,
      userType,

      showControls,
      commentDate,

      del,
      saveEdits,

      icons: {
        mdiDotsVertical,
        mdiDeleteOutline,
        mdiDownload,
      },
    };
  },
};
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
