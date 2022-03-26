<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Inbox</h2>
    <div class="d-flex flex-row">
      <inbox-messages></inbox-messages>
      <inbox-groups></inbox-groups>
    </div>
  </div>
</template>

<script>
import InboxGroups from "@/components/inbox/InboxGroups.vue";
import InboxMessages from "@/components/inbox/InboxMessages.vue";
import { useMessages } from "@/composables/messages";
import { onBeforeUnmount } from "@vue/composition-api";

export default {
  name: "Inbox",
  components: {
    InboxGroups,
    InboxMessages,
  },
  setup() {
    const { setActiveGroupId } = useMessages();

    onBeforeUnmount(() => {
      setActiveGroupId("");
    });
  },
};
</script>

<style></style>
