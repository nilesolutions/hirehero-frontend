<template>
  <div>
    <h3 class="cursive-font my-2 mx-2 black--text">
      Manage your account details
    </h3>

    <div class="d-flex flex-row flex-wrap">
      <user-info />
      <associate-info />
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/settings/UserInfo.vue'
import AssociateInfo from '@/components/settings/AssociateInfo.vue'

export default {
  name: 'UserDetails',
  components: {
    UserInfo,
    AssociateInfo,
  },
}
</script>

<style></style>
