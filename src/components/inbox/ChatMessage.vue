<template>
  <li
    @mouseenter="state.isHovering = true"
    @mouseleave="state.isHovering = false"
    class="message-wrapper"
    :class="state.isHovering ? 'message-hover' : ''"
  >
    <div class="d-flex flex-column message-content" :class="msgAlignment">
      <small class="message-content__sender" :class="msgAlignment">{{ msgData.username }}</small>
      <p
        v-show="msgData.message"
        class="message-content__text"
        :class="[msgAlignment, msgArrowDirection]"
      >
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

      <div v-if="showControls" class="message-controls">
        <v-btn
          small
          icon
          tile
          elevation="2"
          color="warning"
          @click="state.isConfirmDeleteOpen = true"
        >
          <v-icon small>{{ icons.mdiTrashCanOutline }}</v-icon>
        </v-btn>
      </div>

      <v-dialog width="fit-content" v-model="state.isConfirmDeleteOpen">
        <v-card>
          <v-card-title>Delete Message ?</v-card-title>
          <v-card-actions>
            <v-btn @click="deleteMsg" color="warning" outlined>Delete</v-btn>
            <v-btn @click="state.isConfirmDeleteOpen = false" outlined>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <small class="message-content__date" :class="msgAlignment">{{ msgTime }}</small>
    </div>
  </li>
</template>

<script>
import axios from "@axios";
import { reactive } from "@vue/composition-api";
import { useUser } from "@/composables/user";
import { mdiTrashCanOutline } from "@mdi/js";
import { computed } from "@vue/composition-api";
import { useMessages } from "@/composables/messages";

export default {
  name: "ChatMessage",
  props: { msgData: Object },
  setup({ msgData }) {
    const userId = useUser().userData().id;
    const { state: msgsState } = useMessages();
    const state = reactive({
      isHovering: false,
      isConfirmDeleteOpen: false,
    });

    const showControls = computed(() => {
      if (state.isHovering && msgData.user_id == userId) return true;
      return false;
    });

    const resolveAlignment = () => {
      if (msgData.user_id == userId) return "our-message";
      return "their-message";
    };

    const resolveArrow = () => {
      if (msgData.user_id == userId) return "right-arrow";
      return "left-arrow";
    };

    const msgTime = () => {
      return new Date(msgData.created_at).toLocaleString();
    };

    const extractAttachments = () => {
      if (!msgData.files) return [];
      return JSON.parse(msgData.files);
    };

    async function deleteMsg() {
      try {
        await axios.delete(`/conversations/${msgsState.conversation.id}/messages/${msgData.id}`);
        state.isConfirmDeleteOpen = false;
      } catch (err) {}
    }

    return {
      state,
      showControls,
      deleteMsg,

      msgAlignment: resolveAlignment(),
      msgArrowDirection: resolveArrow(),
      msgTime: msgTime(),
      msgAttachments: extractAttachments(),

      icons: {
        mdiTrashCanOutline,
      },
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
  position: relative;
  background-color: #1f70fd;
  color: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 4px !important;
  border-radius: 6px;
  width: fit-content;
}

.message-wrapper {
  position: relative;
  padding: 1rem;
}

.message-hover {
  background-color: #cccccca2;
}

.right-arrow::after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  bottom: 0px;
  right: -5px;
  border-bottom: 10px solid #1f70fd;
  border-right: 10px solid transparent;
}

.left-arrow::after {
  content: " ";
  position: absolute;
  width: 0;
  height: 0;
  bottom: 0px;
  left: -5px;
  border-bottom: 10px solid #1f70fd;
  border-left: 10px solid transparent;
}

.message-content__sender {
  margin-bottom: 0.15rem;
  width: fit-content;
}

.message-attachments {
  padding: 0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
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

.message-controls {
  position: absolute;
  left: 10px;
}

.our-message {
  margin-left: auto;
}
</style>
