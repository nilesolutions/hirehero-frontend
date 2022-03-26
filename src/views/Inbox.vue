<template>
  <div class="dashboard__content">
    <h2 class="d-flex flex-row align-center black--text mb-2">
      <span class="cursive-font">Inbox</span>
    </h2>
    <div class="d-flex flex-row flex-wrap">
      <start-video-call></start-video-call>

      <div class="d-flex flex-column col-12">
        <h3>Conversations</h3>
      </div>
      <inbox-messages></inbox-messages>
      <inbox-groups></inbox-groups>
    </div>
  </div>
</template>

<script>
import { mdiCamera } from "@mdi/js";
import InboxGroups from "@/components/inbox/InboxGroups.vue";
import InboxMessages from "@/components/inbox/InboxMessages.vue";
import StartVideoCall from "@/components/inbox/StartVideoCall.vue";
import { useMessages } from "@/composables/messages";
import { onBeforeUnmount } from "@vue/composition-api";

export default {
  name: "Inbox",
  components: {
    InboxGroups,
    InboxMessages,
    StartVideoCall,
  },
  setup() {
    const { setActiveGroupId } = useMessages();

    onBeforeUnmount(() => {
      setActiveGroupId("");
    });

    return {
      icons: {
        mdiCamera,
      },
    };
  },
};
</script>

<style></style>
