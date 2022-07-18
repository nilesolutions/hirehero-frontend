<template>
  <div class="d-flex flex-col align-self-center mx-auto">
    <v-card>
      <!-- 
      REMOVED AS WE'RE NOT GONNA USE SUBSCRIPTION FOR NOW
      Ref: https://bitbucket.org/hydro780/leadheroes-frontend/pull-requests/1
      
      <v-card-text>Activate your account by subscribing to a plan.</v-card-text>
      <v-card-actions v-if="!userState.isPreviewMode">
        <router-link class="mx-auto text-decoration-none" to="/settings">
          <v-btn color="primary">Go to settings</v-btn></router-link
        >
      </v-card-actions>
      -->
      <v-card-text>To activate your account please contact us!</v-card-text>
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

<style></style>
