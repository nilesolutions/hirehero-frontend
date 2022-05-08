import { computed, reactive, readonly } from "@vue/composition-api";

const state = reactive({ info: {} });

const setUserData = (val) => (state.info = val);
const setProfilePic = (val) => (state.info.profile_picture_url = val);

const userData = computed(() => state.info);
const userId = computed(() => state.info.id);
const userName = computed(() => state.info.username);
const userEmail = computed(() => state.info.email);
const userType = computed(() => state.info.type);

const profilePicture = computed(() => {
  if (state.info.profile_picture_url) return state.info.profile_picture_url;
  return require("@/assets/images/default-profile-pic.jpg");
});

const accessToken = () => localStorage.getItem("accessToken");

export function useUser() {
  return {
    state: readonly(state),

    setUserData,
    setProfilePic,

    userId,
    userData,
    userType,
    userName,
    userEmail,
    profilePicture,
    accessToken,
  };
}
