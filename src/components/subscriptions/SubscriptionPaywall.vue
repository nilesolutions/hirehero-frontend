<template>
  <div class="d-flex flex-col align-self-center mx-auto">
    <v-card>
      <v-card-text>Activate your account by subscribing to a plan.</v-card-text>

      <v-card-actions>
        <router-link class="mx-auto text-decoration-none" to="/settings">
          <v-btn color="primary">Go to settings</v-btn></router-link
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SubscriptionPaywall",
};
</script>

<style></style>
