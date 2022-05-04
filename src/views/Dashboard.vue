<template>
  <div class="dashboard__content">
    <h2 class="black--text">Dashboard</h2>
    <h3>Welcome back {{ userName }}</h3>

    <div class="d-flex flex-row my-2 flex-wrap">
      <!-- <hourly-reports></hourly-reports> -->
      <tasks-progress></tasks-progress>
      <recent-tasks></recent-tasks>
    </div>
  </div>
</template>

<script>
import { useUser } from "@/composables/user/user";
import RecentTasks from "@/components/dashboard/RecentTasks.vue";
import HourlyReports from "@/components/dashboard/HourlyReports.vue";
import TasksProgress from "@/components/dashboard/TasksProgress.vue";

export default {
  name: "Dashboard",
  components: { RecentTasks, HourlyReports, TasksProgress },
  setup() {
    const { userName } = useUser();

    return {
      userName,
    };
  },
};
</script>

<style></style>
