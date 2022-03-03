import { computed, ref, set } from "@vue/composition-api";

const tasks = ref([]);

const setTasks = (entries) => {
  tasks.value = entries;
};

const addTask = (task) => {
  tasks.value = [task, ...tasks.value];
};

const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter((t) => t.id != taskId);
};

const updateTask = (task) => {
  for (var i = 0; i < tasks.value.length; i++) {
    if (tasks.value[i].id == task.id) {
      set(tasks.value, i, task);
      break;
    }
  }
};

const updateTaskAttachments = (attachments, parentTaskId) => {
  for (var i = 0; i < tasks.value.length; i++) {
    if (tasks.value[i].id == parentTaskId) {
      tasks.value[i].attachments = [...tasks.value[i].attachments, ...attachments];
      break;
    }
  }
};

const deleteTaskAttachment = (attachmendId, parentTaskId) => {
  for (var i = 0; i < tasks.value.length; i++) {
    if (tasks.value[i].id == parentTaskId) {
      tasks.value[i].attachments = tasks.value[i].attachments.filter(
        (attachment) => attachment.id != attachmendId
      );
      break;
    }
  }
};

const doneTasks = computed(() => tasks.value.filter((t) => t.completed == true));
const unfinishedTasks = computed(() => tasks.value.filter((t) => t.completed == false));
const dueSoonTasks = computed(() => []);

export function useTasks() {
  return {
    setTasks,
    addTask,
    deleteTask,
    updateTask,

    updateTaskAttachments,
    deleteTaskAttachment,

    doneTasks,
    unfinishedTasks,
    dueSoonTasks,
  };
}
