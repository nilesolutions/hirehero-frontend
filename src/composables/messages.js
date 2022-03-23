import { computed, reactive, readonly } from "@vue/composition-api";
import Pusher from "pusher-js";
import { useUser } from "./user";

const user = useUser().userData();
const accessToken = useUser().accessToken();

const state = reactive({
  chatGroups: [],
  messages: [],
  activeGroupId: "",
  pusher: new Pusher("1d281727be4979719061", {
    authEndpoint: "http://localhost:3000/api/messages/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    cluster: "eu",
    encrypted: true,
  }),
});

const setChatGroups = (val) => (state.chatGroups = val);
const setActiveGroupId = (val) => (state.activeGroupId = val);

const setMessages = (val) => (state.messages = val);
const addMessage = (val) => (state.messages = [...state.messages, val]);

const activeGroup = computed(() =>
  state.chatGroups.find((group) => group.id == state.activeGroupId)
);
const pusher = computed(() => state.pusher);

function initPusher() {
  const channel = state.pusher.subscribe(`private-invite-${user.id}`);
  channel.bind("chat-group-created", (event) => {
    console.log("pusher event", event);
  });

  channel.bind_global((event) => {
    console.log("global event", event);
  });
}

export function useMessages() {
  return {
    state: readonly(state),
    pusher,

    setChatGroups,
    setActiveGroupId,
    activeGroup,

    addMessage,
    setMessages,

    initPusher,
  };
}
