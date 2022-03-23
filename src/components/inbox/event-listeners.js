import { useMessages } from "@/composables/messages";
const { addMessage } = useMessages();

const msgEvents = [
  {
    name: "send-message",
    handler: (event) => addMessage(event),
  },
  {
    name: "delete-message",
    handler: (event) => {
      console.log("delete msg", event);
    },
  },
];

export { msgEvents };
