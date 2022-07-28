<template>
  <div class="col-12">
    <div class="d-flex flex-row align-center mb-2">
      <div class="black--text">
        Change Password
      </div>
    </div>

    <v-card elevation="0">
      <v-card-text>
        <v-text-field
          v-model="state.oldPassword"
          hide-details=""

          outlined
          type="password"
          label="Old Password"
          class="fontSize input-height"
        />
      </v-card-text>

      <v-card-text>
        <v-text-field
          v-model="state.newPassword"
          hide-details=""
          outlined
          type="password"
          label="New Password"
          class="fontSize input-height"
        />
      </v-card-text>

      <v-card-actions class="py-4 px-0">
        <v-btn
          :disabled="!canUpdate"
          :loading="state.isUpdating"
          color="primary"
          class="px w-sm-full"
          @click="updatePassword"
        >Change</v-btn>
      </v-card-actions>

      <v-card-text class="py-0">
        <v-btn
          v-show="state.updateSuccessful"
          outlined
          color="success"
          class="cursive-font"
          small
          @click="state.updateSuccessful = false"
        >
          Update Successful
        </v-btn>
      </v-card-text>

      <v-card-text class="py-0">
        <v-btn
          v-show="state.updateFailed"
          outlined
          color="warning"
          class="cursive-font"
          small
          @click="state.updateFailed = false"
        >
          {{ state.errorMsg || "Update Failed" }}
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from '@axios'
import { reactive, computed } from '@vue/composition-api'
import { usePusher } from '@/composables/pusher'

export default {
  name: 'ChangePassword',
  setup() {
    const { updateAuthCreds } = usePusher()

    const state = reactive({
      oldPassword: '',
      newPassword: '',
      errorMsg: '',
      isUpdating: false,
      updateSuccessful: false,
      updateFailed: false,

    })

    const canUpdate = computed(() => {
      if (!state.oldPassword || !state.newPassword) return false
      return true
    })

    async function updatePassword() {
      try {
        if (!canUpdate.value) return

        state.isUpdating = true

        const { data: token } = await axios.patch('/users/me/password', {
          oldPassword: state.oldPassword,
          newPassword: state.newPassword,
        })

        localStorage.setItem('accessToken', token.accessToken)
        localStorage.setItem('userData', JSON.stringify(token.userData))
        updateAuthCreds()

        state.updateSuccessful = true
        state.updateFailed = false
        state.oldPassword = ''
        state.newPassword = ''
        setTimeout(() => {
          state.updateSuccessful = false
        }, 2000)
      } catch (err) {
        state.updateSuccessful = false
        state.errorMsg = err.response.data.message
        state.updateFailed = true
        setTimeout(() => {
          state.updateFailed = false
        }, 2000)
      } finally {
        state.isUpdating = false
      }
    }

    return {
      state,
      updatePassword,
      canUpdate,
    }
  },
}
</script>

<style scoped>
@media (max-width: 767px){
.w-sm-full{
  width: 100%;
  font-size: 16px;
}}
.v-card__text{
  padding: 16px 0;
}
.fontSize{
  font-size: 18px;
}
.px{
  padding: 0 32px !important;
}
</style>
