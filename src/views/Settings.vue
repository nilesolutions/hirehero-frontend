<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Settings</h2>

    <div class="d-flex flex-row flex-wrap">
      <user-info></user-info>
      <change-password></change-password>
      <associate-info></associate-info>
    </div>
  </div>
</template>

<script>
import UserInfo from "@/components/settings/UserInfo.vue";
import AssociateInfo from "@/components/settings/AssociateInfo.vue";
import ChangePassword from "@/components/settings/ChangePassword.vue";

export default {
  name: "Settings",
  components: {
    UserInfo,
    AssociateInfo,
    ChangePassword,
  },
};
</script>

<style></style>
