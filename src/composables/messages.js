import { usePusher } from "@/composables/pusher";
import { computed, reactive, readonly } from "@vue/composition-api";

const { state: pusherState } = usePusher();

const state = reactive({
  conversation: {},
  associatedUser: {},
  messages: [],
  onlineUsers: [],
});

const setConversation = (val) => (state.conversation = val);
const setAssociatedUser = (val) => (state.associatedUser = val);

const setMessages = (val) => (state.messages = val);
const addMessage = (val) => (state.messages = [...state.messages, val]);

const updateOnlineUsers = () => {
  const channel = pusherState.pusher.channel(`presence-${state.conversation.id}`);
  const onlineUsers = [];

  channel.members.each((member) => {
    onlineUsers.push({
      name: member.info.name,
      type: member.info.type,
    });
  });

  state.onlineUsers = onlineUsers;
};

const activeConversation = computed(() => {
  if (Object.keys(state.conversation).length) return state.conversation;
  return false;
});

export function useMessages() {
  return {
    state: readonly(state),

    setConversation,
    setAssociatedUser,
    activeConversation,

    updateOnlineUsers,

    addMessage,
    setMessages,
  };
}
