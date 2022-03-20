<template>
  <div class="dashboard__content d-flex flex-column">
    <add-tasks></add-tasks>
    <tasks-view></tasks-view>
    <task-details-popup v-if="isTaskDetailsOpen"></task-details-popup>
  </div>
</template>

<script>
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import AddTasks from "@/components/project/ProjectNav.vue";
import TasksView from "@/components/project/TasksView.vue";
import TaskDetailsPopup from "@/components/project/TaskDetailsPopup.vue";
import { useTasks } from "@/composables/tasks";

export default {
  name: "Project",
  components: {
    ProjectInfo,
    AddTasks,
    TasksView,
    TaskDetailsPopup,
  },
  setup() {
    const { isTaskDetailsOpen } = useTasks();

    return { isTaskDetailsOpen };
  },
};
</script>

<style></style>
