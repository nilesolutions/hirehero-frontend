import { useMessages } from "@/composables/chat/messages";
import { useVideoCall } from "@/composables/chat/videocall";
import { useNotifications } from "./chat/notifications";
import { useSubscription } from "./user/subscription";

const { handleSubUpdate } = useSubscription();
const { handleNotification } = useNotifications();
const { addMessage, deleteMessage, setConversation, updateOnlineUsers,state } = useMessages();
const { handleIncomingHandshake, handleIceCandidate, endCall, handleCallAnswer, updatePeerStatus } =
  useVideoCall();

const msgEvents = [
  {
    name: "send-message",
    handler: (msg) => {
      function IDexists(id) {
        return state.messages.some(function(item) {
          return item.id === id;
        });
      }
      if(!IDexists(msg.id)){
        addMessage(msg)
      }

    },
  },
  {
    name: "delete-message",
    handler: (event) => deleteMessage(event.id),
  },
  {
    name: "pusher:subscription_succeeded",
    handler: () => updateOnlineUsers(),
  },
  {
    name: "pusher:member_added",
    handler: () => updateOnlineUsers(),
  },
  {
    name: "pusher:member_removed",
    handler: () => updateOnlineUsers(),
  },
];

const conversationEvents = [
  {
    name: "conversation-started",
    handler: (group) => setConversation(group),
  },
];

const videoCallPresenceEvents = [
  {
    name: "pusher:subscription_succeeded",
    handler: (members) => {
      if (members.count == 2) updatePeerStatus(true);
      else updatePeerStatus(false);
    },
  },
  {
    name: "pusher:member_added",
    handler: () => updatePeerStatus(true),
  },
  {
    name: "pusher:member_removed",
    handler: () => updatePeerStatus(false),
  },
];

const videoCallEvents = [
  {
    name: "client-call-candidate",
    handler: (event) => updatePeerStatus(event),
  },
  {
    name: "client-call-handshake",
    handler: (event) => handleIncomingHandshake(event),
  },
  {
    name: "client-call-answer",
    handler: (event) => handleCallAnswer(event),
  },
  {
    name: "client-call-reject",
    handler: () => endCall(),
  },
  {
    name: "client-call-end",
    handler: (event) =>endCall(event),
  },
  {
    name: "client-candidate",
    handler: (event) => handleIceCandidate(event),
  },
];

const notificationEvents = [
  {
    name: "new-message",
    handler: (event) => handleNotification(event),
  },
];

const subscriptionEvents = [
  {
    name: "sub-updated",
    handler: () => handleSubUpdate(),
  },
];

export {
  msgEvents,
  conversationEvents,
  videoCallPresenceEvents,
  videoCallEvents,
  notificationEvents,
  subscriptionEvents,
};
