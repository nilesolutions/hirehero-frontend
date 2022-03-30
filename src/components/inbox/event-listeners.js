import { useMessages } from "@/composables/messages";
import { useVideoCall } from "@/composables/videocall";

const { addMessage, deleteMessage, setConversation, updateOnlineUsers } = useMessages();
const {
  handleIncomingCall,
  handleIceCandidate,
  endCall,
  handleCallAnswer,
  handleCallRejection,
  updatePeerStatus,
} = useVideoCall();

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
      console.log("subscription succeeded, present members are", members);
      if (members.count == 2) updatePeerStatus(true);
      else updatePeerStatus(false);
    },
  },
  {
    name: "pusher:member_added",
    handler: () => {
      console.log("member added");
      updatePeerStatus(true);
    },
  },
  {
    name: "pusher:member_removed",
    handler: () => {
      console.log("member removed");
      updatePeerStatus(false);
    },
  },
];

const videoCallEvents = [
  {
    name: "client-call-candidate",
    handler: (event) => updatePeerStatus(event),
  },
  {
    name: "client-call-sdp",
    handler: (event) => handleIncomingCall(event),
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
    handler: () => endCall(),
  },
  {
    name: "client-candidate",
    handler: (event) => handleIceCandidate(event),
  },
];

const notificationEvents = [];

export { msgEvents, conversationEvents, videoCallPresenceEvents, videoCallEvents };
