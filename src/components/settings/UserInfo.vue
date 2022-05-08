<template>
  <div class="col-12">
    <div class="d-flex flex-row align-center mb-2">
      <div class="black--text">User Info</div>
    </div>

    <profile-picture></profile-picture>

    <label for=""><small>Basic Info</small></label>
    <v-card :loading="state.isLoading" :disabled="state.isUpdating" elevation="0">
      <v-card-text>
        <v-text-field
          hide-details=""
          dense
          outlined
          label="Username"
          v-model="state.userInfo.username"
        >
        </v-text-field>
      </v-card-text>

      <v-card-text>
        <v-text-field
          hide-details=""
          dense
          outlined
          :disabled="!state.isEditing"
          label="Email"
          v-model="state.userInfo.email"
        >
          {{ state.userInfo.email }}
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="updateInfo" :loading="state.isUpdating" color="primary">Update Info</v-btn>
      </v-card-actions>

      <v-card-text class="py-0">
        <v-btn v-show="state.updateSuccessful" color="success" class="cursive-font" small>
          Update Successfull
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import ProfilePicture from "@/components/settings/ProfilePicture.vue";
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useUser } from "@/composables/user/user";

export default {
  name: "UserInfo",
  components: { ProfilePicture },
  setup() {
    const { setUserData, userData } = useUser();

    const state = reactive({
      isLoading: true,
      isEditing: false,
      isUpdating: false,
      updateSuccessful: false,
      userInfo: {},
    });

    onMounted(() => fetchUserInfo());

    async function fetchUserInfo() {
      try {
        const { data: userInfo } = await axios.get("/users/me");

        state.userInfo = userInfo;
        setUserData(JSON.parse(JSON.stringify(userInfo)));
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    async function updateInfo() {
      try {
        if (!state.userInfo.username) return;
        state.isUpdating = true;

        const info = {
          username: state.userInfo.username,
        };
        const { data: updatedUser } = await axios.patch("/users/me", info);

        state.userInfo = updatedUser;
        setUserData(JSON.parse(JSON.stringify(updatedUser)));

        state.updateSuccessful = true;
        setTimeout(() => {
          state.updateSuccessful = false;
        }, 2500);
      } catch (err) {
        console.log(err);
      } finally {
        state.isUpdating = false;
      }
    }

    return {
      state,
      userData,
      updateInfo,
    };
  },
};
</script>

<style></style>
