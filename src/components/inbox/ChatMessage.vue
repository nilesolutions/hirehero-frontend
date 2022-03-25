<template>
  <li class="d-flex flex-column message-content" :class="msgAlignment">
    <p v-show="msgData.message" class="message-content__text" :class="msgAlignment">
      {{ msgData.message }}
    </p>

    <div v-show="msgAttachments.length" class="message-attachments" :class="msgAlignment">
      <small class="d-block">Attachments</small>
      <a
        class="py-2 px-2 d-block"
        v-for="attachment in msgAttachments"
        :key="attachment.url"
        :href="attachment.url"
        target="blank"
      >
        {{ attachment.name }}
      </a>
    </div>

    <small class="message-content__date" :class="msgAlignment">{{ msgTime() }}</small>
  </li>
</template>

<script>
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import { useUser } from "@/composables/user";
import { computed } from "@vue/composition-api";

export default {
  name: "ChatMessage",
  components: { popper: Popper },
  props: { msgData: Object },
  setup({ msgData }) {
    const userId = useUser().userData().id;

    const resolveAlignment = () => {
      if (msgData.user_id == userId) return "our-message";
      return "their-message";
    };

    const msgTime = () => {
      return new Date(msgData.created_at).toLocaleTimeString();
    };

    const extractAttachments = () => {
      if (!msgData.files) return [];
      return JSON.parse(msgData.files);
    };

    return {
      msgAlignment: resolveAlignment(),
      msgTime,
      msgAttachments: extractAttachments(),
    };
  },
};
</script>

<style lang="scss">
.message-content {
  width: fit-content;
  margin-bottom: 1.25rem;
}

.message-content__text {
  background-color: #1f70fd;
  color: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 4px !important;
  border-radius: 6px;
  width: fit-content;
}

.message-attachments {
  padding: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: small;
  background-color: #f7f7f7;
  width: 200px;
}

.message-content__attachments {
  margin: 0.25rem 0rem;
  margin-left: auto;
  cursor: pointer;
  color: #1f70fd;
  display: inline-block;
}

.message-content__date {
  display: inline-block;
}

.our-message {
  margin-left: auto;
}
</style>
