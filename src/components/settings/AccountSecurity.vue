<template>
  <div>
    <h3 class="cursive-font ms-2 mb-3 mx-2 black--text">
      Manage your account security
    </h3>

    <div class="d-flex flex-row flex-wrap">
      <change-password />
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/settings/UserInfo.vue'
import AssociateInfo from '@/components/settings/AssociateInfo.vue'
import ChangePassword from '@/components/settings/ChangePassword.vue'

export default {
  name: 'UserSecurity',
  components: {
    UserInfo,
    AssociateInfo,
    ChangePassword,
  },
}
</script>

<style></style>
