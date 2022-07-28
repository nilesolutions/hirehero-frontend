import { computed, reactive, readonly } from '@vue/composition-api'

const state = reactive({
  attachments: [],
})

const setAttachments = val => (state.attachments = val)

const addAttachment = newAttachments => {
  state.attachments = [...newAttachments, ...state.attachments]
}

const deleteAttachment = attachmendId => {
  state.attachments = state.attachments.filter(attahcment => attahcment.id != attachmendId)
}

const attachments = computed(() => state.attachments)

export function useAttachments() {
  return {
    state: readonly(state),
    attachments,

    setAttachments,
    addAttachment,
    deleteAttachment,
  }
}
