import { usePusher } from "@/composables/pusher";
import { computed, reactive, readonly } from "@vue/composition-api";
import { useNotifications } from "./notifications";

const { state: pusherState } = usePusher();
const { state: notificationsState } = useNotifications();

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
const deleteMessage = (msgId) => (state.messages = state.messages.filter((msg) => msg.id != msgId));

const updateOnlineUsers = () => {
  const channel = pusherState.pusher.channel(`presence-${state.conversation.id}`);
  const onlineUsers = [];

  channel.members.each((member) => {
    onlineUsers.push({
      id: member.info.id,
      name: member.info.name,
      type: member.info.type,
    });
  });

  state.onlineUsers = onlineUsers;
};

const associatedUser = computed(() => {
  if (Object.keys(state.associatedUser).length) return state.associatedUser;
  return false;
});

const activeConversation = computed(() => {
  if (Object.keys(state.conversation).length) return state.conversation;
  return false;
});

const readMsgs = computed(() => {
  const earliestUnread = notificationsState.notification.earliestUnread;
  if (!earliestUnread) return state.messages;
  const earliestDate = new Date(earliestUnread);
  return state.messages.filter((msg) => new Date(msg.created_at) < earliestDate);
});

const unreadMsgs = computed(() => {
  const earliestUnread = notificationsState.notification.earliestUnread;
  if (!earliestUnread) return [];
  const earliestDate = new Date(earliestUnread);
  return state.messages.filter((msg) => new Date(msg.created_at) > earliestDate);
});

export function useMessages() {
  return {
    state: readonly(state),
    associatedUser,

    readMsgs,
    unreadMsgs,

    setConversation,
    setAssociatedUser,
    activeConversation,

    updateOnlineUsers,

    addMessage,
    setMessages,
    deleteMessage,
  };
}
