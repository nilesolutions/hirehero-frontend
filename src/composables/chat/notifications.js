import { reactive, readonly } from '@vue/composition-api'
import { useRouter } from '../router'

const { currRouteName } = useRouter()
const state = reactive({
  notification: {
    unreadCount: 0,
    earliestUnread: '',
  },
})

const setNotification = val => (state.notification = val)

const handleNotification = event => {
  if (currRouteName.value == 'inbox') return

  if (state.notification.unreadCount) state.notification.unreadCount += 1
  else state.notification.unreadCount = 1

  if (!state.notification.earliestUnread) state.notification.earliestUnread = event.notificationTime
}

export function useNotifications() {
  return {
    state: readonly(state),

    setNotification,
    handleNotification,
  }
}
