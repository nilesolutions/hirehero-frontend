import { computed, reactive, readonly, set } from "@vue/composition-api";

const state = reactive({
  comments: [],
});

const comments = computed(() => state.comments);

const setComments = (val) => (state.comments = val);

const addComment = (newComment) => {
  state.comments = [newComment, ...state.comments];
};

const updateComment = (comment) => {
  for (var i = 0; i < state.comments.length; i++) {
    if (state.comments[i].id == comment.id) {
      set(state.comments, i, comment);
      break;
    }
  }
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
