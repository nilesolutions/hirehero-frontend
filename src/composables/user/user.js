import { computed, reactive, readonly } from '@vue/composition-api'

const state = reactive({
  info: {},
  isPreviewMode: false,
  isSettingUpPreview: false,
})

const setUserData = val => (state.info = val)
const setProfilePic = val => (state.info.profile_picture_url = val)

const togglePreviewMode = val => (state.isPreviewMode = val)
const toggleIsSettingUpPreview = val => (state.isSettingUpPreview = val)

const userData = computed(() => state.info)
const userId = computed(() => state.info.id)
const userName = computed(() => state.info.username)
const userEmail = computed(() => state.info.email)
const userType = computed(() => state.info.type)

const profilePicture = computed(() => {
  if (state.info.profile_picture_url) return state.info.profile_picture_url
  return require('@/assets/images/default-profile-pic.jpg')
})

const accessToken = () => sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken')

export function useUser() {
  return {
    state: readonly(state),

    togglePreviewMode,
    toggleIsSettingUpPreview,

    setUserData,
    setProfilePic,

    userId,
    userData,
    userType,
    userName,
    userEmail,
    profilePicture,
    accessToken,
  }
}
