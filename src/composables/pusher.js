import { reactive } from "@vue/composition-api";
import Pusher from "pusher-js";
import { useUser } from "./user";
Pusher.logToConsole = true;
const accessToken = useUser().accessToken();

const state = reactive({
  pusher: new Pusher("1d281727be4979719061", {
    authEndpoint: "http://localhost:3000/api/conversations/auth",
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

const subscribeToChannel = async (channelName, eventHandlers) => {
  if (!channelName) return;
  const channel = await state.pusher.subscribe(channelName);
  if (eventHandlers) {
    for (var event of eventHandlers) {
      channel.bind(event.name, event.handler);
    }
  }
};

const unsubscribeFromChannel = (channelName) => {
  if (!channelName) return;
  const channel = state.pusher.allChannels().find((channel) => channel.name == channelName);
  if (channel) {
    channel.unbind_all();
    state.pusher.unsubscribe(channelName);
  }
};

const triggerEvent = (channelName, eventName, payload) => {
  try {
    const channel = state.pusher.channel(channelName);
    channel.trigger(eventName, payload);
  } catch (err) {
    console.log(err);
  }
};

const debugActiveChannels = (debugMsg) => {
  console.log(debugMsg);
  console.log(state.pusher.allChannels().map((c) => ({ name: c.name, status: c.subscribed })));
};

export function usePusher() {
  return {
    state,
    subscribeToChannel,
    unsubscribeFromChannel,
    triggerEvent,
    updateAuthCreds,
    debugActiveChannels,
  };
}
