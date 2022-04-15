<template>
  <div class="d-flex flex-column col-12">
    <v-card width="fit-content" :loading="state.isLoading" :disabled="state.isLoading">
      <v-card-text>Start A Video Call With folan</v-card-text>
      <v-card-text>
        <v-btn @click="initCall(state.associatedUser.id)" color="primary" small>
          Call
          <v-icon class="ml-2" small>{{ icons.mdiPhonePlusOutline }}</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>

    <video-call v-if="callState.isInCall"></video-call>
  </div>
</template>

<script>
import axios from "@axios";
import VideoCall from "@/components/inbox/VideoCall.vue";
import { reactive, onMounted } from "@vue/composition-api";
import { videoCallEvents } from "@/composables/event-listeners";
import { mdiPhonePlusOutline } from "@mdi/js";
import { useVideoCall } from "@/composables/chat/videocall";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user/user";

export default {
  name: "StartVideoCall",
  components: {
    VideoCall,
  },
  setup() {
    const { initCall, state: callState } = useVideoCall();
    const state = reactive({
      isLoading: false,
      associatedUser: {},
    });

    const { userId } = useUser();
    const { subscribeToChannel, debugActiveChannels } = usePusher();
    subscribeToChannel(`private-video-call-${userId.value}`, videoCallEvents);
    onMounted(() => fetchAssociatedUser());

    async function fetchAssociatedUser() {
      try {
        state.isLoading = true;
        const { data } = await axios.get("/users/associate");
        callState.associatedUser = data;
        if (data) {
          subscribeToChannel(`private-video-call-${data.id}`, videoCallEvents);
        }
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      callState,
      initCall,
      icons: {
        mdiPhonePlusOutline,
      },
    };
  },
};
</script>

<style></style>
