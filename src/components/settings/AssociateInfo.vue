<template>
  <div
    v-if="hasAssociateUser"
    class="col-12"
  >
    <div class="d-flex flex-row align-center mb-2">
      <div class="black--text">
        Your Assigned {{ userType == "client" ? "Virtual Assistant(s)" : "Client" }}
      </div>
    </div>

    <v-card elevation="0">
      <v-card-text class="px-0">
        <v-text-field
          v-model="state.associateInfo.username"

          hide-details=""
          disabled
          outlined
          label="Username"
        />
      </v-card-text>
    </v-card>
  </div>
  <div
    v-else
    class="px-3"
  >
    No Assigned {{ associatedUserType }}
  </div>
</template>

<script>
import axios from '@axios'
import { onMounted, reactive, computed } from '@vue/composition-api'
import { useUser } from '@/composables/user/user'
import { useSubscription } from '@/composables/user/subscription'

export default {
  name: 'AssociateInfo',
  setup() {
    const { userType } = useUser()
    const { isSubscriptionActive } = useSubscription()

    const state = reactive({
      isLoading: true,
      associateInfo: {},
    })

    onMounted(() => fetchAssociateInfo())

    async function fetchAssociateInfo() {
      try {
        const { data: associateInfo } = await axios.get('/users/associate')
        state.associateInfo = associateInfo
      } catch (err) {
        console.log(err)
      }
    }

    const hasAssociateUser = computed(() => {
      if (Object.keys(state.associateInfo).length && isSubscriptionActive.value) return true
      return false
    })

    const associatedUserType = computed(() => {
      if (userType.value == 'client') return 'Virtual Assitant'
      return 'Client'
    })

    return {
      state,
      userType,

      hasAssociateUser,
      associatedUserType,
    }
  },
}
</script>

<style></style>
