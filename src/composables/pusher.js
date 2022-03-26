import { reactive } from "@vue/composition-api";
import Pusher from "pusher-js";
import { useUser } from "./user";

const accessToken = useUser().accessToken();

const state = reactive({
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

state.pusher.bind_global((event) => {
  console.log("global event", event);
});

const updateAuthCreds = () => {
  const accessToken = useUser().accessToken();
  state.pusher.config.auth = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const subscribeToChannel = (channelName, eventHandlers) => {
  if (!channelName) return;
  const channel = state.pusher.subscribe(channelName);
  for (var event of eventHandlers) channel.bind(event.name, event.handler);
};

const unsubscribeFromChannel = (channelName) => {
  if (!channelName) return;
  const channel = state.pusher.allChannels().find((channel) => channel.name == channelName);
  if (channel) {
    channel.unbind_all();
    state.pusher.unsubscribe(channelName);
  }
};

const debugActiveChannels = (debugMsg) => {
  console.log(debugMsg);
  console.log(state.pusher.allChannels().map((c) => c.name));
};

export function usePusher() {
  return {
    state,
    subscribeToChannel,
    unsubscribeFromChannel,
    updateAuthCreds,
    debugActiveChannels,
  };
}
