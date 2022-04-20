<template>
  <div class="col-12">
    <div class="d-flex flex-row align-center mb-2">
      <div class="black--text">Change password</div>
    </div>

    <v-card elevation="0">
      <v-card-text>
        <v-text-field
          v-model="state.oldPassword"
          hide-details=""
          dense
          outlined
          type="password"
          label="Old Password"
        >
        </v-text-field>
      </v-card-text>

      <v-card-text>
        <v-text-field
          v-model="state.newPassword"
          hide-details=""
          dense
          outlined
          type="password"
          label="New Password"
        >
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :disabled="!canUpdate"
          @click="updatePassword"
          :loading="state.isUpdating"
          color="primary"
          >Change</v-btn
        >
      </v-card-actions>

      <v-card-text class="py-0">
        <v-btn
          @click="state.updateSuccessful = false"
          v-show="state.updateSuccessful"
          outlined
          color="success"
          class="cursive-font"
          small
        >
          Update Successful
        </v-btn>
      </v-card-text>

      <v-card-text class="py-0">
        <v-btn
          @click="state.updateFailed = false"
          v-show="state.updateFailed"
          outlined
          color="warning"
          class="cursive-font"
          small
        >
          {{ state.errorMsg || "Update Failed" }}
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";

import { reactive, computed } from "@vue/composition-api";
import { usePusher } from "@/composables/pusher";

export default {
  name: "ChangePassword",
  setup() {
    const { updateAuthCreds } = usePusher();

    const state = reactive({
      oldPassword: "",
      newPassword: "",
      errorMsg: "",
      isUpdating: false,
      updateSuccessful: false,
      updateFailed: false,
    });

    const canUpdate = computed(() => {
      if (!state.oldPassword || !state.newPassword) return false;
      return true;
    });

    async function updatePassword() {
      try {
        if (!canUpdate.value) return;

        state.isUpdating = true;

        const { data: token } = await axios.patch("/users/me/password", {
          oldPassword: state.oldPassword,
          newPassword: state.newPassword,
        });

        localStorage.setItem("accessToken", token.accessToken);
        localStorage.setItem("userData", JSON.stringify(token.userData));
        updateAuthCreds();

        state.updateSuccessful = true;
        state.oldPassword = "";
        state.newPassword = "";
      } catch (err) {
        state.errorMsg = err.response.data.message;
        state.updateFailed = true;
      } finally {
        state.isUpdating = false;
      }
    }

    return {
      state,
      updatePassword,
      canUpdate,
    };
  },
};
</script>

<style></style>
