<template>
  <v-app>
    <navbar></navbar>

    <div class="dashboard--layout">
      <navigation></navigation>
      <slot></slot>
    </div>
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/navbar/Navbar.vue";
import Navigation from "@/components/layout/navigation/Navigation.vue";

export default {
  name: "LayoutCustom",
  components: {
    Navbar,
    Navigation,
  },
};
</script>

<style lang="scss">
.dashboard--layout {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.dashboard__content {
  max-height: 100%;
  padding: 2rem;
  flex-grow: 1;
}
</style>
