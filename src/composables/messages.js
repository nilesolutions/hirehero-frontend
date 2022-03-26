import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({
  chatGroups: [],
  messages: [],
  activeGroupId: "",
});

const setChatGroups = (val) => (state.chatGroups = val);
const setActiveGroupId = (val) => (state.activeGroupId = val);
const addGroup = (val) => (state.chatGroups = [...state.chatGroups, val]);

const setMessages = (val) => (state.messages = val);
const addMessage = (val) => (state.messages = [...state.messages, val]);

const activeGroup = computed(() =>
  state.chatGroups.find((group) => group.id == state.activeGroupId)
);

export function useMessages() {
  return {
    state: readonly(state),

    setChatGroups,
    setActiveGroupId,
    activeGroup,
    addGroup,

    addMessage,
    setMessages,
  };
}
