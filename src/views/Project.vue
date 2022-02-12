<template>
  <div class="d-flex flex-column">
    <project-info></project-info>
    <add-tasks></add-tasks>
    <tasks-view></tasks-view>
  </div>
</template>

<script>
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import AddTasks from "@/components/project/AddTasks.vue";
import TasksView from "@/components/project/TasksView.vue";

export default {
  name: "Project",
  components: {
    ProjectInfo,
    AddTasks,
    TasksView,
  },
};
</script>

<style></style>
