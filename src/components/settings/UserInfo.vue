<template>
  <div class="col-12 col-md-6">
    <p>User Info</p>
    <v-card>
      <v-card-text>
        <v-text-field dense outlined disabled label="Username" v-model="state.userInfo.username">
        </v-text-field>
      </v-card-text>

      <v-card-text>
        <v-text-field dense outlined disabled label="Email" v-model="state.userInfo.email">
          {{ state.userInfo.email }}
        </v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { onMounted, reactive } from "@vue/composition-api";

export default {
  name: "UserInfo",
  setup() {
    const state = reactive({
      isLoading: true,
      userInfo: {},
    });

    onMounted(() => fetchUserInfo());

    async function fetchUserInfo() {
      try {
        const { data: userInfo } = await axios.get("/users/me");
        state.userInfo = userInfo;
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
    };
  },
};
</script>

<style></style>
