import { useMessages } from "@/composables/chat/messages";
import { useVideoCall } from "@/composables/chat/videocall";
import { useNotifications } from "./chat/notifications";

const { addMessage, deleteMessage, setConversation, updateOnlineUsers } = useMessages();
const { handleNotification } = useNotifications();
const { handleIncomingHandshake, handleIceCandidate, endCall, handleCallAnswer, updatePeerStatus } =
  useVideoCall();

const msgEvents = [
  {
    name: "send-message",
    handler: (msg) => addMessage(msg),
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
    handler: (event) => endCall(event),
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

export {
  msgEvents,
  conversationEvents,
  videoCallPresenceEvents,
  videoCallEvents,
  notificationEvents,
};
