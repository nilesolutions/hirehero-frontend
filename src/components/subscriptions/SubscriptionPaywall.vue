<template>
  <div class="d-flex flex-col align-self-center mx-auto width">
    <v-card class="mobile-css">
      <v-card-text>Activate your account by subscribing to a plan.</v-card-text>
      <v-card-actions v-if="!userState.isPreviewMode">
        <router-link class="mx-auto text-decoration-none" to="/settings">
          <v-btn color="primary">Go to settings</v-btn></router-link>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { useUser } from "@/composables/user/user";
export default {
  name: "SubscriptionPaywall",
  setup() {
    const { state: userState } = useUser();

    return {
      userState,
    };
  },
};
</script>

<style scoped>

@media (max-width:767px) {
.width{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70vh;
}
  .mobile-css{
    margin: auto 20px;

  }
}
</style>
