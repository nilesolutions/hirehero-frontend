<template>
  <div class="d-flex flex-column col-12">
    <v-card width="fit-content" :loading="state.isLoading" :disabled="state.isLoading">
      <v-card-text>Start A Video Call With folan</v-card-text>
      <v-card-text>
        <v-btn @click="startCall(state.associatedUser.id)" color="primary" small>
          Call
          <v-icon class="ml-2" small>{{ icons.mdiPhonePlus }}</v-icon>
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
import { videoCallEvents } from "@/components/inbox/event-listeners";
import { mdiPhonePlus } from "@mdi/js";
import { useVideoCall } from "@/composables/videocall";
import { usePusher } from "@/composables/pusher";
import { useUser } from "@/composables/user";

export default {
  name: "StartVideoCall",
  components: {
    VideoCall,
  },
  setup() {
    const { startCall, state: callState } = useVideoCall();
    const state = reactive({
      isLoading: false,
      associatedUser: {},
    });

    const userId = useUser().userData().id;
    const { subscribeToChannel, debugActiveChannels } = usePusher();
    subscribeToChannel(`private-video-call-${userId}`, videoCallEvents);
    debugActiveChannels();

    onMounted(() => fetchAssociatedUser());

    async function fetchAssociatedUser() {
      try {
        state.isLoading = true;
        const { data } = await axios.get("/users/associate");
        state.associatedUser = data;
        if (data) subscribeToChannel(`private-video-call-${data.id}`);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      callState,
      startCall,
      icons: {
        mdiPhonePlus,
      },
    };
  },
};
</script>

<style></style>
