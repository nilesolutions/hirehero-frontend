<template>
  <div class="navbar">
    <div class="navbar__logo">
      <v-btn
        v-show="breakpoint == 'sm'"
        class="mr-4"
        icon
        @click="setMenuActive(!navMenuState.isMenuFixed)"
      >
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-btn>
      <router-link to="/dashboard">
        <img
          class="navbar__logo-img"
          :src="require('@/assets/logos/logo-nav.png')"
          alt=""
        >
      </router-link>
    </div>

    <div
      v-show="breakpoint == 'md'"
      class="navbar__divider"
    />
    <div
      id="abccc"
      class="navbar__user-profile "
    >
      <app-bar-user-menu />
    </div>
    <div class="navbar__divider" />
    <!-- <div class="navbar__search">C</div> -->
    <navbar-actions />
  </div>
</template>

<script>
import { mdiMenu } from '@mdi/js'
import AppBarUserMenu from '@/components/AppBarUserMenu.vue'
import NavbarActions from '@/components/layout/navbar/NavbarActions.vue'
import { useNavigation } from '@/composables/navigation'

export default {
  name: 'Navbar',
  components: {
    AppBarUserMenu,
    NavbarActions,
  },
  setup() {
    const { state: navMenuState, breakpoint, setMenuActive } = useNavigation()

    return {
      setMenuActive,
      navMenuState,
      breakpoint,
      icons: { mdiMenu },
    }
  },
}
</script>

<style lang="scss">
.navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #000;
  background-color: rgb(250, 250, 250);
  border-bottom: 1px solid #dadada;
  padding: 1rem 2rem;

  @media (max-width: 550px) {
    padding: 1rem 0.25rem;
  }
}

.navbar__divider {
  height: 100%;
  width: 1px;
  border: 1px solid #dadada;

  @media (max-width: 550px) {
    display: none;
  }
}

.navbar__logo {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 25px;
  padding-right: 2rem;

  a {
    height: 100%;
    margin-bottom: 10px;
  }

  a img {
    max-height: 100%;
  }

  @media (max-width: 550px) {
    padding-right: 0.5rem;
  }
}

.navbar__user-profile {
  padding-left: 2rem;
  padding-right: 2rem;

  @media (max-width: 550px) {
    margin-left: auto;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}

.navbar__logo {
  @media (max-width: 550px) {
    padding-left: 0rem;
    padding-right: 0rem;
  }
}
</style>
