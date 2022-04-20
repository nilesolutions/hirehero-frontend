<template>
  <div>
    <v-overlay absolute :value="isStatusOverlayActive">
      <v-card
        class="status-msg d-flex flex-column align-center text-center"
        elevation="2"
        v-if="isStatusOverlayActive"
        @click="setStatusMsg('')"
      >
        <v-card-text class="cursive-font black--text">
          <h2>
            <b>{{ subscriptionState.statusMsg }}</b>
          </h2>
        </v-card-text>
        <v-card-text>
          <small>Click to dismiss</small>
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import { useSubscription } from "@/composables/user/subscription";
export default {
  name: "StatusMessage",

  setup() {
    const { isStatusOverlayActive, setStatusMsg, state: subscriptionState } = useSubscription();

    return {
      subscriptionState,

      isStatusOverlayActive,
      setStatusMsg,
    };
  },
};
</script>

<style></style>
