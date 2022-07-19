<template>
  <div class="d-flex flex-col align-self-center mx-auto">
    <v-card class="activation-notification-card">
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
      <v-card-text class="activation-notification-container">
        Please wait for your account to be activated by an Administrator. 
        Contact
        <a 
          style="color: #f34c57 !important"
          class="mx-auto text-decoration-none" 
          href="mailto:info@hireheroes.com"
        >info@hireheroes.com</a>
        with any further questions or concerns.
      </v-card-text>
      
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
.activation-notification-card {
  margin: 10px;
}
.activation-notification-container {
  margin: 10px;
  padding: 10px;
}
</style>
