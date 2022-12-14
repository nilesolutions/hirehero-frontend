<template>
  <!-- If url contains client secret, show the appropriate message before loading app -->
  <!-- Message will contain status about the most recent payment/card update -->
  <div v-if="state.hasSubNotification">
    <v-app>
      <subscription-notification-message
        @close="closeSubNotification"
      /></v-app>
  </div>
  <v-app v-else>
    <navbar />
    <v-alert
      v-if="state.isInfoVisible && infoMsg && !state.isLoading"
      color="primary"
      class="mb-0"
      rounded="0"
      type="info"
      dismissible
    >
      {{ infoMsg }}
    </v-alert>
    <v-alert
      v-if="userState.isPreviewMode"
      color="primary"
      class="mb-0"
      rounded="0"
      type="info"
    >
      You are currently previewing the website as {{ userName }}.<span
        class="ml-1"
      >Any changes you make will be saved.</span>
    </v-alert>

    <div class="dashboard--layout">
      <video-call-prompt />
      <video-call />

      <navigation />

      <!--  class="ml-auto mr-auto" -->

      <div
        v-if="state.isLoading"
        class="loading-box"
      >
        <v-progress-circular
          color="primary"
          indeterminate
          class="loading-spinner"
        />
      </div>
      <account-disabled-wall v-else-if="showAccountDisabled" />
      <subscription-paywall v-else-if="showSubPaywall" />
      <slot v-else />
      <!-- <slot> </slot> -->
    </div>
  </v-app>
</template>

<script>
import axios from '@axios'
import { mdiClose } from '@mdi/js'
import {
  computed, onMounted, onUnmounted, reactive,
} from '@vue/composition-api'
import { fa } from 'vuetify/lib/locale'
import Navbar from '@/components/layout/navbar/Navbar.vue'
import Navigation from '@/components/layout/navigation/Navigation.vue'
import AccountDisabledWall from '@/components/misc/AccountDisabledWall.vue'
import SubscriptionNotificationMessage from '@/components/subscriptions/SubscriptionNotificationMessage.vue'
import SubscriptionPaywall from '@/components/subscriptions/SubscriptionPaywall.vue'
import VideoCall from '@/components/videocall/VideoCall.vue'
import VideoCallPrompt from '@/components/videocall/VideoCallPrompt.vue'

import { useRouter } from '@/@core/utils'
import { useMessages } from '@/composables/chat/messages'
import { useNotifications } from '@/composables/chat/notifications'
import {
  notificationEvents,
  subscriptionEvents,
  videoCallEvents,
  videoCallPresenceEvents,
} from '@/composables/event-listeners'
import { usePusher } from '@/composables/pusher'
import { useSubscription } from '@/composables/user/subscription'
import { useUser } from '@/composables/user/user'

export default {
  name: 'LayoutCustom',
  components: {
    Navbar,
    Navigation,
    VideoCall,
    VideoCallPrompt,
    SubscriptionNotificationMessage,
    SubscriptionPaywall,
    AccountDisabledWall,
  },
  setup() {
    const state = reactive({
      isLoading: true,
      isInfoVisible: true,
      hasSubNotification: true,
    })

    const { setSubInfo, isSubscribed, isSubscriptionActive } = useSubscription()
    const {
      state: userState, userData, userName, userType, setUserData,
    } = useUser()
    const { setNotification } = useNotifications()
    const { setAssociatedUser, associatedUser } = useMessages()
    const { subscribeToChannel, unsubscribeFromChannel } = usePusher()
    const { route } = useRouter()

    let videoCallChannel = 'presence-video-call-'
    let notificationsChannel = 'private-notifications-'
    let privateUserChannel = 'private-user-'

    async function initApp() {
      try {
        state.isLoading = true
        const [user, associate, notifications, sub] = await Promise.all([
          axios.get('/users/me'),
          axios.get('/users/associate'),
          axios.get('/conversations/notifications'),
          axios.get('/subscriptions/'),
        ])

        setUserData(user.data)
        setAssociatedUser(associate.data)
        setNotification(notifications.data)

        setSubInfo(sub.data)

        videoCallChannel += user.data.id
        privateUserChannel += user.data.id
        notificationsChannel += user.data.id

        subscribeToChannel(videoCallChannel, videoCallEvents)
        subscribeToChannel(privateUserChannel, subscriptionEvents)
        subscribeToChannel(notificationsChannel, notificationEvents)

        if (associatedUser) {
          subscribeToChannel(`presence-video-call-${associatedUser.value.id}`, [
            ...videoCallPresenceEvents,
            ...videoCallEvents,
          ])
        }
      } catch (err) {
        console.log(err)
      } finally {
        state.isLoading = false
      }
    }

    onMounted(() => {
      const searchParams = new URLSearchParams(window.location.search)

      if (
        !searchParams.get('payment_intent_client_secret')
        && !searchParams.get('setup_intent_client_secret')
      ) closeSubNotification()
    })

    function closeSubNotification() {
      state.hasSubNotification = false
      initApp()
    }

    onUnmounted(() => {
      unsubscribeFromChannel(videoCallChannel)
      unsubscribeFromChannel(privateUserChannel)
      unsubscribeFromChannel(notificationsChannel)
    })

    const showSubPaywall = computed(() => {
      if (userType.value == 'va') return false
      // if (!isSubscribed.value && route.value.name != "settings") return true;
      if (!isSubscriptionActive.value && route.value.name != 'settings') return true
      // console.log('isSubscriptionActive : ', isSubscriptionActive.value)
      return false
    })

    const showAccountDisabled = computed(() => {
      if (userData.value.is_disabled) return true
      return false
    })

    const infoMsg = computed(() => {
      const msg = []

      if (!associatedUser.value) {
        if (userType.value == 'client') msg.push('No VA Assigned')
        else msg.push('No Client Assigned')
      }

      if (!isSubscribed.value && userType.value == 'client') msg.push('You are not subscribed to a plan')

      if (msg.length) return msg.join(' | ')
      return ''
    })

    return {
      state,
      infoMsg,
      showSubPaywall,
      showAccountDisabled,
      closeSubNotification,
      userName,
      userState,

      icons: {
        mdiClose,
      },
    }
  },
}
</script>

<style lang="scss">

.loading-spinner{
    /* position: absolute; */
    /* display: flex; */
    /* justify-items: center; */
    position: absolute;
    margin: auto auto;
    // margin-left: auto;
    // margin-right: auto;
    // margin-top: auto;
    // margin-bottom: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

}

.dashboard--layout {
  position: relative;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.dashboard__content {
  max-height: 100%;
  padding: 2rem;
  flex-grow: 1;
}

.info-bar {
  display: flex;
  flex-direction: row;
  padding: 0.5rem 2rem;
  border-bottom: 1px solid;
  color: white;
  background-color: #f34c57;
}

@media (max-width: 545px) {
  .dashboard__content {
    padding: 1.5rem 1rem;
  }
  .dashboard--layout {
  height: 100%;
      display: block;
}
}

</style>
