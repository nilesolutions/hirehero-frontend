import { computed, ref, set } from '@vue/composition-api'

const tasks = ref([])
const activeTaskId = ref('')
const isEditingTask = ref(false)
const dueSoonThreshold = 3 * 24 * 60 * 60 * 1000

const setTasks = entries => {
  tasks.value = entries
}

const setActiveTaskId = val => {
  if (!val) isEditingTask.value = false
  activeTaskId.value = val
}
const toggleEdit = val => (isEditingTask.value = val)

const addTask = task => {
  tasks.value = [task, ...tasks.value]
}

const deleteTask = taskId => {
  tasks.value = tasks.value.filter(t => t.id != taskId)
}

const updateTask = task => {
  for (let i = 0; i < tasks.value.length; i++) {
    if (tasks.value[i].id == task.id) {
      set(tasks.value, i, task)
      break
    }
  }
}

const doneTasks = computed(() => tasks.value.filter(t => t.completed == true))

const unfinishedTasks = computed(() => {
  const today = new Date()

  const unfinished = tasks.value.filter(task => {
    if (task.completed) return false
    if (!task.due_on) return true

    const dueDate = new Date(task.due_on)
    if (dueDate < today) return false
    if (Math.abs(dueDate - today) > dueSoonThreshold) return true
  })
  return unfinished
})

const dueSoonTasks = computed(() => {
  const today = new Date()

  const dueSoon = tasks.value.filter(task => {
    if (!task.due_on) return false
    if (task.completed) return false

    const dueDate = new Date(task.due_on)
    if (Math.abs(dueDate - today) < dueSoonThreshold) return true
  })

  return dueSoon
})

const overDueTasks = computed(() => {
  const today = new Date()

  const overDue = tasks.value.filter(task => {
    if (!task.due_on) return false
    if (task.completed) return false

    const dueDate = new Date(task.due_on)
    if (dueDate < today) return true
  })

  return overDue
})

const activeTask = computed(() => tasks.value.find(t => t.id == activeTaskId.value))
const isTaskDetailsOpen = computed(() => {
  if (!activeTaskId.value) return false
  return true
})

export function useTasks() {
  return {
    setTasks,
    addTask,
    deleteTask,
    updateTask,

    activeTask,
    setActiveTaskId,
    isTaskDetailsOpen,
    isEditingTask,
    toggleEdit,

    doneTasks,
    unfinishedTasks,
    dueSoonTasks,
    overDueTasks,
  }
}
