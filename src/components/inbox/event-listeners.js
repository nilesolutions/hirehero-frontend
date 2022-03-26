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

export { msgEvents, groupEvents };
