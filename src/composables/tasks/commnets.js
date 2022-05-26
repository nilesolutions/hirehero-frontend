import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  comments: [],
});

const comments = computed(() => state.comments.reverse());

const setComments = (val) => (state.comments = val);

const addComment = (newComment) => {
  state.comments = [...state.comments, newComment];
};

const updateComment = (comment) => {
  var comments = state.comments;

  for (var i = 0; i < comments.length; i++) {
    if (comments[i].id == comment.id) {
      console.log("Updating index", i);
      comments[i] = comment;
      break;
    }
  }
  state.comments = comments;
};

const deleteComment = (commentId) => {
  state.comments = state.comments.filter((comment) => comment.id != commentId);
};

export function useComments() {
  return {
    state: readonly(state),
    comments,

    setComments,
    addComment,
    deleteComment,
    updateComment,
  };
}
