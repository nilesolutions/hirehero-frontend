import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({ info: {} });
const setUserData = (val) => (state.info = val);

const userData = computed(() => state.info);
const userId = computed(() => state.info.id);
const userName = computed(() => state.info.username);
const userEmail = computed(() => state.info.email);
const userType = computed(() => state.info.type);

const accessToken = () => localStorage.getItem("accessToken");

export function useUser() {
  return {
    state: readonly(state),
    setUserData,

    userId,
    userData,
    userType,
    userName,
    userEmail,
    accessToken,
  };
}
