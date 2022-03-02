<template>
  <div class="text-center fill-height" v-if="isLoading">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
  </div>
  <div class="my-2 d-flex flex-wrap flex-row" v-else>
    <div class="col-12 col-sm-6 col-md-4">
      <h4 class="mb-3">Active</h4>

      <div>
        <task-item v-for="task in unfinishedTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!unfinishedTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-4">
      <h4 class="mb-3">Due Soon</h4>

      <div>
        <task-item v-for="task in dueSoonTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!dueSoonTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-4">
      <h4 class="mb-3">Completed</h4>

      <div>
        <task-item v-for="task in doneTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!doneTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeMount, ref } from "@vue/composition-api";
import { useTasks } from "@/composables/tasks";
import { useRouter } from "@/composables/router";
import TaskItem from "@/components/project/TaskItem.vue";
import axios from "@axios";

export default {
  name: "TasksView",
  components: { TaskItem },
  setup() {
    const { setTasks, doneTasks, unfinishedTasks, dueSoonTasks } = useTasks();
    const { routeParams } = useRouter();
    const isLoading = ref(true);

    async function initTasks() {
      try {
        const projectId = routeParams().id;
        var response = await axios.get(`/projects/${projectId}/tasks`);
        setTasks(response.data.tasks);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(() => initTasks());
    onBeforeMount(() => setTasks([]));

    return {
      doneTasks,
      unfinishedTasks,
      dueSoonTasks,

      isLoading,
    };
  },
};
</script>

<style></style>
