<template>
  <v-menu
    offset-y
    left
    nudge-bottom="14"
    min-width="230"
    content-class="user-profile-menu-content abc1"
  >

    <template v-slot:activator="{ on, attrs }">
      <div
        class="d-flex flex-row align-center"
        v-bind="attrs"
        v-on="on"
      >
        <v-badge
          bottom
          color="success"
          overlap
          offset-x="12"
          offset-y="12"
          dot
        >
          <v-avatar
            size="40px"
            color="primary"
            class="v-avatar-light-bg primary--text"
          >
            <v-img :src="profilePicture" />
          </v-avatar>
        </v-badge>

        <div
          v-show="breakpoint != 'sm'"
          class="font-weight-black ml-2"
        >
          {{ userData.username }} <br>
          <small>{{ userData.email }}</small>
        </div>

        <div
          v-show="breakpoint != 'sm'"
          class="ml-2"
        >
          <v-icon>{{ icons.mdiChevronDown }}</v-icon>
        </div>
      </div>
    </template>

    <v-list class="">
      <div class="pb-3 pt-2">
        <!-- <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
          <v-avatar size="40px" color="primary" class="v-avatar-light-bg primary--text">
            <v-img :src="profilePicture"></v-img>
          </v-avatar>
        </v-badge> -->
        <div
          class="d-inline-flex flex-column justify-center ms-3"
          style="vertical-align: middle"
        >
          <span class="text--primary font-weight-semibold mb-n1"> {{ userData.username }} </span>
          <small class="text--disabled">{{ userData.type == "va" ? "VA" : "Client" }}</small>
        </div>
      </div>

      <v-divider class="my-2" />

      <v-list-item
        v-show="notificationsState.notification.unreadCount"
        @click="goToInbox"
      >
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiBell }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ notificationsState.notification.unreadCount }} New Messages
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="logout-btn"
        @click="logout"
      >
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiLogoutVariant }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>

  </v-menu>
</template>

<script>
import { mdiBell, mdiChevronDown, mdiLogoutVariant } from '@mdi/js'
import { useNotifications } from '@/composables/chat/notifications'
import { useNavigation } from '@/composables/navigation'
import { useUser } from '@/composables/user/user'

export default {
  setup() {
    const { breakpoint } = useNavigation()
    const { state: notificationsState } = useNotifications()
    const { userData, profilePicture } = useUser()

    function logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      this.$router.push({ name: 'auth-login' })
    }

    function goToInbox() {
      this.$router.push({ name: 'inbox' })
    }

    return {
      logout,
      userData,
      profilePicture,
      breakpoint,
      notificationsState,
      goToInbox,

      icons: {
        mdiBell,
        mdiLogoutVariant,
        mdiChevronDown,
      },
    }
  },
}
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}

.v-menu__content {
  overflow: hidden !important;
}

.logout-btn {
  margin: -8px 0;
}

.logout-btn:hover {
  background: #ff4c51 !important;
}

.logout-btn:hover .v-list-item__title,
.logout-btn:hover svg {
  color: #fff;
}
.v-menu__content.menuable__content__active.user-profile-menu-content {
	transform-origin: unset !important;
  top: 70px !important;
}
</style>
