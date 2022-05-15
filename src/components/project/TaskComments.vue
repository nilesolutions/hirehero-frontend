<template>
  <div v-else class="d-flex flex-column col-12">
    <v-card-actions>
      Comments
      <v-btn class="ml-auto" @click="state.showComments = !state.showComments" x-small icon>
        <v-icon>{{ state.showComments ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-card-text class="mt-2">
      <form @submit.prevent="postComment" action="" class="d-flex flex-row align-center">
        <v-text-field
          clearable
          outlined
          dense
          hide-details
          label="Leave a comment"
          v-model="state.text"
        >
        </v-text-field>
        <v-btn icon @click="postComment" :loading="state.isPostingComment">
          <v-icon>{{ icons.mdiSend }} </v-icon>
        </v-btn>
      </form>
    </v-card-text>

    <v-card-text v-show="!comments.length">No comments</v-card-text>
    <v-expand-transition>
      <div v-show="state.showComments">
        <comment-line
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
        ></comment-line>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import CommentLine from "@/components/project/CommentLine.vue";
import { useRouter } from "@/composables/router";
import { useComments } from "@/composables/tasks/commnets";
import { useTasks } from "@/composables/tasks/tasks";
import axios from "@axios";
import { mdiChevronDown, mdiChevronUp, mdiSend } from "@mdi/js";
import { computed, onMounted, reactive } from "@vue/composition-api";

export default {
  components: { CommentLine },
  setup() {
    const state = reactive({
      isLoading: false,
      isPostingComment: false,
      showComments: true,
      text: "",
    });

    const { activeTask } = useTasks();
    const { comments, setComments, addComment } = useComments();
    const projectId = useRouter().routeParams().id;
    const taskId = activeTask.value.id;
    const commentsUrl = `/projects/${projectId}/tasks/${taskId}/comments`;

    onMounted(() => fetchComments());

    async function fetchComments() {
      try {
        const { data: fetchedComments } = await axios.get(commentsUrl);
        setComments(fetchedComments);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    const canSend = computed(() => {
      if (!state.text) return false;
      if (state.isPostingComment) return false;
      return true;
    });

    async function postComment() {
      try {
        if (!canSend.value) return;
        state.isPostingComment = true;
        const { data: newComment } = await axios.post(commentsUrl, {
          text: state.text,
        });
        addComment(newComment);
        state.text = "";
      } catch (err) {
      } finally {
        state.isPostingComment = false;
      }
    }

    return {
      state,
      comments,

      postComment,

      icons: {
        mdiSend,
        mdiChevronUp,
        mdiChevronDown,
      },
    };
  },
};
</script>

<style></style>
