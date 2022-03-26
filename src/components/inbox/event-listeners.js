import { useMessages } from "@/composables/messages";
const { addMessage, addGroup } = useMessages();

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
];

const groupEvents = [
  {
    name: "chat-group-created",
    handler: (group) => addGroup(group),
  },
];

const videoCallEvents = [
  {
    name: "client-call-candidate",
    handler: (event) => console.log(event),
  },
  {
    name: "client-call-sdp",
    handler: (event) => console.log(event),
  },
  {
    name: "client-call-answer",
    handler: (event) => console.log(event),
  },
  {
    name: "client-call-reject",
    handler: (event) => console.log(event),
  },
  {
    name: "client-call-end",
    handler: (event) => console.log(event),
  },
];

export { msgEvents, groupEvents, videoCallEvents };
