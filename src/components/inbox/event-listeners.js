import { useMessages } from "@/composables/messages";
import { useVideoCall } from "@/composables/videocall";

const { addMessage, setConversation, updateOnlineUsers } = useMessages();
const { handleIncomingCall, handleIceCandidate, endCall, handleCallAnswer, handleCallRejection } =
  useVideoCall();

const msgEvents = [
  {
    name: "send-message",
    handler: (msg) => addMessage(msg),
  },
  {
    name: "delete-message",
    handler: (event) => {
      console.log("delete msg", event);
    },
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

const videoCallEvents = [
  {
    name: "client-call-candidate",
    handler: (event) => console.log(event),
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

export { msgEvents, conversationEvents, videoCallEvents };
