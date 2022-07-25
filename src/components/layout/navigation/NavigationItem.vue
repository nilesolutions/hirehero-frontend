<template>
  <router-link class="navigation__item__wrapper" :to="`/${item.to}`" >
    <li
      class="navigation__item"
      :class="isActive ? 'navigation__item-active' : 'navigation__item-inactive'"
   @click="setMenuActive(false)"
    >
      <v-icon color="black" class="navigation__item__icon">
        {{ item.icon }}
      </v-icon>
      <div class="navigation__item__text">{{ item.title }}</div>
    </li>
  </router-link>
</template>

<script>
import { useRouter } from "@/composables/router";
import { computed } from "@vue/composition-api";
import {useNavigation} from "@/composables/navigation";


export default {
  name: "NavigationItem",
  props: { item: Object },
  setup(props) {
    const {state,setMenuActive} = useNavigation();
    const { currRouteName } = useRouter();

    const isActive = computed(() => currRouteName.value == props.item.to);

    return { isActive,setMenuActive,state };
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
  width: 100%;
  color: #293962;
}

.navigation__item svg {
  color: #293962;
}

.navigation__item-inactive .navigation__item__text {
  font-weight: 300;
}

.navigation__item:hover .navigation__item__text {
  font-weight: 700;
}

// .navigation__item-active .navigation__item__text,
// .navigation__item:hover .navigation__item__text {
//   // font-weight: bold;
//   color: #fff;
// }

// .navigation__item-active .navigation__item__icon svg,
// .navigation__item:hover .navigation__item__icon svg {
//   fill: #fff !important;
// }

.navigation__item-active::before,
.navigation__item:hover:before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background: #f34c57;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -10px;
  // margin-top: -5px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.navigation__item::before:not(.navigation__item-active::before) {
  display: none;
}

.navigation__item__wrapper {
  display: flex;
  flex-direction: row;
  color: #000 !important;
  text-decoration: none;
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
