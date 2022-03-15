<template>
  <div class="dashboard__content d-flex flex-column">
    <add-tasks></add-tasks>
    <tasks-view></tasks-view>
  </div>
</template>

<script>
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import AddTasks from "@/components/project/ProjectNav.vue";
import TasksView from "@/components/project/TasksView.vue";
import { useTasks } from "@/composables/tasks";

export default {
  name: "Project",
  components: {
    ProjectInfo,
    AddTasks,
    TasksView,
  },
  setup() {
    const { setTasks } = useTasks();
  },
};
</script>

<style></style>
