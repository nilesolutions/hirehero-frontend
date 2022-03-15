<template>
  <div class="navigation navigation-active">
    <ul class="navigation__menu">
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <small class="navigation__subheader">Workspace</small>
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>

      <small class="navigation__subheader">General</small>
      <li class="navigation__item">
        <v-icon color="black" class="navigation__item__icon">
          {{ icons.mdiCalendar }}
        </v-icon>
        <div class="navigation__item__text">Dashboard</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mdiChat, mdiCalendar, mdiChartArc } from "@mdi/js";

export default {
  name: "Navigation",

  setup() {
    return {
      icons: { mdiChat, mdiCalendar, mdiChartArc },
    };
  },
};
</script>

<style lang="scss">
.navigation {
  padding-top: 2rem;
  overflow: hidden;
  background-color: #fff;
}

.navigation-active {
  width: 200px;
}

.navigation__subheader {
  display: block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #0c77f8;
}

.navigation__menu {
  list-style: none;
}

.navigation__item {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.navigation__item__icon {
  color: #000;
}

.navigation__item__text {
  margin-left: 1rem;
}
</style>
