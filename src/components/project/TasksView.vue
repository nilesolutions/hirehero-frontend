<template>
  <div
    v-if="isLoading"
    class="text-center fill-height"
  >
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </div>
  <div
    v-else
    class="my-2 d-flex flex-wrap flex-row"
  >
    <div class="col-12 col-md-3">
      <div class="section-heading gray-heading font-weight-bold task-due-m">
        Not done
      </div>

      <div class="tasks-column">
        <task-item
          v-for="(task, index) in unfinishedTasks"
          :key="task.gid"
          :class="{ 'item-margin': index == unfinishedTasks.length - 1 }"
          :task="task"
        />
        <v-card>
          <v-card-text v-show="!unfinishedTasks.length">
            Nothing to show...
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-md-3">
      <div class="section-heading blue-heading font-weight-bold task-due-m">
        Due Soon
      </div>

      <div class="tasks-column">
        <task-item
          v-for="(task, index) in dueSoonTasks"
          :key="task.gid"
          :class="{ 'item-margin': index == dueSoonTasks.length - 1 }"
          :task="task"
        />
        <v-card>
          <v-card-text v-show="!dueSoonTasks.length">
            Nothing to show...
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-md-3">
      <div class="section-heading red-heading font-weight-bold task-due-m">
        Overdue
      </div>

      <div class="tasks-column">
        <task-item
          v-for="(task, index) in overDueTasks"
          :key="task.gid"
          :class="{ 'item-margin': index == overDueTasks.length - 1 }"
          :task="task"
        />
        <v-card>
          <v-card-text v-show="!overDueTasks.length">
            Nothing to show...
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="col-12 col-md-3">
      <div class="section-heading green-heading font-weight-bold task-due-m">
        Completed
      </div>

      <div class="tasks-column">
        <task-item
          v-for="(task, index) in doneTasks"
          :key="task.gid"
          :class="{ 'item-margin': index == doneTasks.length - 1 }"
          :task="task"
        />
        <v-card>
          <v-card-text v-show="!doneTasks.length">
            Nothing to show...
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@axios'
import { onBeforeMount, onMounted, ref } from '@vue/composition-api'
import TaskItem from '@/components/project/TaskItem.vue'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'

export default {
  name: 'TasksView',
  components: { TaskItem },
  setup() {
    const {
      setTasks, setActiveTaskId, doneTasks, unfinishedTasks, dueSoonTasks, overDueTasks,
    } = useTasks()
    const { routeParams } = useRouter()
    const isLoading = ref(true)

    async function initTasks() {
      try {
        const projectId = routeParams().id
        const response = await axios.get(`/projects/${projectId}/tasks`)
        setTasks(response.data.tasks)
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => initTasks())
    onBeforeMount(() => setTasks([]))

    return {
      setActiveTaskId,

      doneTasks,
      unfinishedTasks,
      dueSoonTasks,
      overDueTasks,

      isLoading,
    }
  },
}
</script>

<style lang="scss">
.tasks-column {
  border-radius: 6px;
  background-color: transparent;
  padding: 0.5rem 0;
}

.section-heading {
  cursor: pointer;
  width: 138px;
  height: 34px;
  color: white;
  margin-bottom: 1rem;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
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

.yellow-heading {
  background: #e5ce02;
}

.gray-heading {
  background: #adabab;
}

.tasks-column .item-margin {
  margin-bottom: 0 !important;
}

@media (max-width: 767px) {
  .task-due-m {
    margin-bottom: 0.3rem;
  }
}
</style>
