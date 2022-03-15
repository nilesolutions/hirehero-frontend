<template>
  <v-menu offset-y left nudge-bottom="14" min-width="230" content-class="user-profile-menu-content">
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex flex-row align-center" v-on="on" v-bind="attrs">
        <v-badge bottom color="success" overlap offset-x="12" offset-y="12" dot>
          <v-avatar size="40px" color="primary" class="v-avatar-light-bg primary--text">
            <v-img :src="require('@/assets/images/avatars/1.png')"></v-img>
          </v-avatar>
        </v-badge>

        <div class="font-weight-black ml-2">
          {{ userData.username }} <br />
          <small>{{ userData.email }}</small>
        </div>

        <div class="ml-2">
          <v-icon>{{ icons.mdiChevronDown }}</v-icon>
        </div>
      </div>
    </template>
    <v-list>
      <div class="pb-3 pt-2">
        <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
          <v-avatar size="40px" color="primary" class="v-avatar-light-bg primary--text">
            <v-img :src="require('@/assets/images/avatars/1.png')"></v-img>
          </v-avatar>
        </v-badge>
        <div class="d-inline-flex flex-column justify-center ms-3" style="vertical-align: middle">
          <span class="text--primary font-weight-semibold mb-n1"> {{ userData.username }} </span>
          <small class="text--disabled text-capitalize">{{ userData.type }}</small>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <!-- Logout -->
      <v-list-item @click="logout">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiLogoutVariant }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { useUser } from "@/composables/user";
import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiCheckboxMarkedOutline,
  mdiChatOutline,
  mdiCogOutline,
  mdiCurrencyUsd,
  mdiHelpCircleOutline,
  mdiLogoutVariant,
  mdiChevronDown,
} from "@mdi/js";

export default {
  setup() {
    const userData = useUser().userData();

    function logout() {
      localStorage.removeItem("accessToken");
      this.$router.push({ name: "auth-login" });
    }

    return {
      logout,
      userData,

      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiCheckboxMarkedOutline,
        mdiChatOutline,
        mdiCogOutline,
        mdiCurrencyUsd,
        mdiHelpCircleOutline,
        mdiLogoutVariant,
        mdiChevronDown,
      },
    };
  },
};
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
