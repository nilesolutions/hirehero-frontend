<template>
  <div class="col-12">

    <profile-picture></profile-picture>

    <div class="mt-10">
  <label for="" class="heading">
   Basic Info
  </label>
    <v-card :loading="state.isLoading" :disabled="state.isUpdating" elevation="0" >
      <v-card-text class="px-0">
        <v-text-field
          hide-details=""
          
          outlined
          label="Username"
          class="w-full text-sm-${16px}"
          v-model="state.userInfo.username"
        >
        </v-text-field>
      </v-card-text>

      <v-card-text class="px-0">
        <v-text-field
          hide-details=""
          outlined
          :disabled="!state.isEditing"
          label="Email"
          v-model="state.userInfo.email"
         
        >
          {{ state.userInfo.email }}
        </v-text-field>
      </v-card-text>

      <v-card-actions class="py-4 px-0">
        <v-btn @click="updateInfo" :loading="state.isUpdating" color="primary" class="w-sm-full px">Update Info</v-btn>
      </v-card-actions>

      <v-card-text class="py-0">
        <v-btn v-show="state.updateSuccessful" color="success" class="cursive-font" small>
          Update Successfull
        </v-btn>
      </v-card-text>
    </v-card>

    </div>

    
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

<style scoped>
.m-t{
  margin-top: 30px;
}
.w-full{
  width: 100%;
  padding: 12px  0 !important;
}
.px{
  padding: 0 32px !important;
}
@media (max-width: 767px){
.w-sm-full{
  width: 100%;
  font-size: 16px;
}
.heading{
  font-size: 18px;
}
.v-text-field{
  font-size: 1rem !important;
}
}
</style>>
