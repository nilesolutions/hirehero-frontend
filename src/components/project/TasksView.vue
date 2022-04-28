<template>
  <div class="text-center fill-height" v-if="isLoading">
    <v-progress-circular color="primary" indeterminate></v-progress-circular>
  </div>
  <div class="my-2 d-flex flex-wrap flex-row" v-else>
    <div class="col-12 col-sm-6 col-md-4">
      <div class="section-heading red-heading">Not done</div>

      <div class="tasks-column">
        <task-item v-for="task in unfinishedTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!unfinishedTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-4">
      <div class="section-heading blue-heading">Due Soon</div>

      <div class="tasks-column">
        <task-item v-for="task in dueSoonTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!dueSoonTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-4">
      <div class="section-heading green-heading">Completed</div>

      <div class="tasks-column">
        <task-item v-for="task in doneTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!doneTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-sm-6 col-md-4">
      <div class="section-heading green-heading">Overdue</div>

      <div class="tasks-column">
        <task-item v-for="task in overDueTasks" :key="task.gid" :task="task"></task-item>
        <v-card>
          <v-card-text v-show="!overDueTasks.length">Nothing to show...</v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeMount, ref } from "@vue/composition-api";
import { useTasks } from "@/composables/tasks/tasks";
import { useRouter } from "@/composables/router";
import TaskItem from "@/components/project/TaskItem.vue";
import axios from "@axios";

export default {
  name: "TasksView",
  components: { TaskItem },
  setup() {
    const { setTasks, setActiveTaskId, doneTasks, unfinishedTasks, dueSoonTasks, overDueTasks } =
      useTasks();
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
      setActiveTaskId,

      doneTasks,
      unfinishedTasks,
      dueSoonTasks,
      overDueTasks,

      isLoading,
    };
  },
};
</script>

<style lang="scss">
.tasks-column {
  border-radius: 6px;
  background-color: #dedede;
  padding: 0.5rem;
}

.section-heading {
  width: 138px;
  height: 34px;
  color: white;
  margin-bottom: 1rem;
  align-items: center;
  text-align: center;
  padding: 0.5rem 2rem;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border-radius: 4px;
}

.red-heading {
  background: #eb5757;
}

.green-heading {
  background: #30d988;
}

.blue-heading {
  background: #017efa;
}
</style>
