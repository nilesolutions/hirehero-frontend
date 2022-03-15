<template>
  <div class="navbar">
    <div class="navbar__logo">
      <img :src="require('@/assets/images/logo.svg')" alt="" />
    </div>
    <div class="navbar__divider"></div>
    <div class="navbar__user-profile">
      <app-bar-user-menu></app-bar-user-menu>
    </div>
    <div class="navbar__divider"></div>
    <div class="navbar__search">C</div>
    <navbar-actions></navbar-actions>
  </div>
</template>

<script>
import AppBarUserMenu from "@/components/AppBarUserMenu.vue";
import NavbarActions from "@/components/layout/navbar/NavbarActions.vue";

export default {
  name: "Navbar",
  components: {
    AppBarUserMenu,
    NavbarActions,
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
}

.navbar__divider {
  height: 100%;
  width: 1px;
  border: 1px solid #dadada;
}

.navbar__logo {
  height: 35px;
  padding-right: 2rem;
}

.navbar__logo img {
  max-height: 100%;
}

.navbar__user-profile {
  padding-left: 2rem;
  padding-right: 2rem;
}

.navbar__logo {
}
</style>
