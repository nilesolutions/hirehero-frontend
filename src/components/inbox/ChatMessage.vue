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

      <div
        v-show="imageAttachments.length || normalAttachments.length"
        class="message-attachments"
        :class="msgAlignment"
      >
        <div class="image-attachments d-flex flex-row flex-wrap" v-show="imageAttachments.length">
          <div v-for="img in imageAttachments" :key="img.id" class="image-attachment">
            <a :href="img.url" target="_blank">
              <img :src="img.url" alt="" />
            </a>
          </div>
        </div>

        <a
          class="py-2 px-2 d-block mb-1"
          v-for="attachment in normalAttachments"
          :key="attachment.url"
          :href="attachment.url"
          target="blank"
        >
          {{ attachment.name }}
        </a>
      </div>

      <div class="audio-attachments" v-show="audioAttachments.length">
        <div class="audio-attachment" v-for="audio in audioAttachments" :key="audio.id">
          <audio :src="audio.url" controls></audio>
        </div>
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
import { useMessages } from "@/composables/chat/messages";
import { useUser } from "@/composables/user/user";
import axios from "@axios";
import { mdiTrashCanOutline } from "@mdi/js";
import { computed, reactive } from "@vue/composition-api";

export default {
  name: "ChatMessage",
  async created() {
    this.state.imgUrl = await axiosDefault.get(data.download_url, {
      responseType: "blob",
    });
  },
  props: { msgData: Object },
  setup({ msgData }) {
    const { userId } = useUser();
    const { state: msgsState } = useMessages();
    const state = reactive({
      isHovering: false,
      isConfirmDeleteOpen: false,
    });

    const showControls = computed(() => {
      if (state.isHovering && msgData.user_id == userId.value) return true;
      return false;
    });

    const resolveAlignment = () => {
      if (msgData.user_id == userId.value) return "our-message";
      return "their-message";
    };

    const resolveArrow = () => {
      if (msgData.user_id == userId.value) return "right-arrow";
      return "left-arrow";
    };

    const msgTime = () => {
      return new Date(msgData.created_at).toLocaleString();
    };

    const hasAttachments = () => {
      if (msgData.files) return true;
      return false;
    };

    const imageAttachments = () => {
      if (!msgData.files) return [];
      const attachments = JSON.parse(msgData.files);
      return attachments.filter((attachment) => attachment.type == "image");
    };

    const audioAttachments = () => {
      if (!msgData.files) return [];
      const attachments = JSON.parse(msgData.files);
      return attachments.filter((attachment) => attachment.type == "audio");
    };

    const normalAttachments = () => {
      if (!msgData.files) return [];
      const attachments = JSON.parse(msgData.files);
      return attachments.filter(
        (attachment) => attachment.type != "audio" && attachment.type != "image"
      );
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

      hasAttachments: hasAttachments(),
      normalAttachments: normalAttachments(),
      imageAttachments: imageAttachments(),
      audioAttachments: audioAttachments(),
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
  margin-bottom: 1rem;
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

.message-content__text.left-arrow {
  background-color: #f4f5fa;
  color: black;
}

.message-wrapper {
  position: relative;
  padding: 0.25rem 1rem;
}

.message-hover {
  background-color: #fafafa;
  // background-color: #cccccca2;
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

.image-attachment img {
  margin-right: 0.25rem;
  max-width: 100%;
  max-height: 75px;
}

.audio-attachment audio {
  max-width: 100%;
}

.message-controls {
  position: absolute;
  left: 10px;
}

.our-message {
  margin-left: auto;
}
</style>
