<template>
  <li class="d-flex flex-column message-content" :class="msgAlignment()">
    <p class="message-content__text">{{ msgData.message }}</p>
    <small class="message-content__date" :class="msgAlignment()">{{ msgTime() }}</small>
  </li>
</template>

<script>
import { useUser } from "@/composables/user";
import { computed } from "@vue/composition-api";

export default {
  name: "ChatMessage",
  props: { msgData: Object },
  setup({ msgData }) {
    const userId = useUser().userData().id;

    const msgAlignment = () => {
      if (msgData.user_id == userId) return "our-message";
      return "their-message";
    };

    const msgTime = () => {
      return new Date(msgData.created_at).toLocaleTimeString();
    };

    return {
      msgAlignment,
      msgTime,
    };
  },
};
</script>

<style lang="scss">
.message-content {
  width: fit-content;
  margin-bottom: 1rem;
}

.message-content__text {
  background-color: #1f70fd;
  color: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 4px !important;
  border-radius: 6px;
}

.message-content__date {
  display: inline-block;
}

.our-message {
  margin-left: auto;
}
</style>
