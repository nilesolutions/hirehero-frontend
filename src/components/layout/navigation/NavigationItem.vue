<template>
  <li
    class="navigation__item"
    :class="isActive ? 'navigation__item-active' : 'navigation__item-inactive'"
  >
    <router-link :to="`/${item.to}`">
      <v-icon color="black" class="navigation__item__icon">
        {{ item.icon }}
      </v-icon>
      <div class="navigation__item__text">{{ item.title }}</div>
    </router-link>
  </li>
</template>

<script>
import { computed } from "@vue/composition-api";
import { useRouter } from "@/composables/router";

export default {
  name: "NavigationItem",
  props: { item: Object },
  setup(props) {
    const { currRouteName } = useRouter();

    const isActive = computed(() => currRouteName.value == props.item.to);

    return { isActive };
  },
};
</script>

<style lang="scss">
.navigation__item {
  position: relative;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding-left: 22px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.navigation__item-inactive .navigation__item__text {
  font-weight: 300;
}

.navigation__item-active .navigation__item__text {
  // font-weight: bold;
  color: #fff;
}

.navigation__item-active .navigation__item__icon svg {
  fill: #fff !important;
}

.navigation__item-active::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background: #f34c57;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -10px;
  margin-top: -5px;
  z-index: 1;
}

.navigation__item a {
  display: flex;
  flex-direction: row;
  color: #000 !important;
  text-decoration: none;
  width: 100%;
}

.navigation__item__icon {
  color: #000;
  z-index: 2;
}

.navigation__item__text {
  margin-left: 1rem;
  white-space: nowrap;
  z-index: 2;
}
</style>
