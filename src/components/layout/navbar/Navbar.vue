<template>
  <div class="navbar">
    <router-link to="/dashboard">
      <div class="navbar__logo">
        <v-btn v-show="breakpoint == 'sm'" icon @click="setMenuActive(!navMenuState.isMenuFixed)">
          <v-icon>{{ icons.mdiMenu }}</v-icon>
        </v-btn>
        <img :src="require('@/assets/images/logo.svg')" alt="" />
      </div>
    </router-link>

    <div v-show="breakpoint == 'md'" class="navbar__divider"></div>
    <div class="navbar__user-profile">
      <app-bar-user-menu></app-bar-user-menu>
    </div>
    <div class="navbar__divider"></div>
    <!-- <div class="navbar__search">C</div> -->
    <navbar-actions></navbar-actions>
  </div>
</template>

<script>
import { mdiMenu } from "@mdi/js";
import { useNavigation } from "@/composables/navigation";
import AppBarUserMenu from "@/components/AppBarUserMenu.vue";
import NavbarActions from "@/components/layout/navbar/NavbarActions.vue";

export default {
  name: "Navbar",
  components: {
    AppBarUserMenu,
    NavbarActions,
  },
  setup() {
    const { state: navMenuState, breakpoint, setMenuActive } = useNavigation();

    return {
      setMenuActive,
      navMenuState,
      breakpoint,
      icons: { mdiMenu },
    };
  },
};
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
    padding: 0.25rem;
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
  height: 35px;
  padding-right: 2rem;

  @media (max-width: 550px) {
    padding-right: 0.5rem;
  }
}

.navbar__logo img {
  max-height: 100%;
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
