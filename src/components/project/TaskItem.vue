<template>
  <v-card
    class="mb-4"
    @click="setActiveTaskId(task.id)"
  >
    <v-card-text>
      <v-btn
        small
        depressed
        :color="colorFromPriority()"
        class="task-priority font-weight-bold"
        :class="task.priority"
      >
        <v-tooltip
          v-if="task.priority == 'High'"
          bottom
          color="error"
        >
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">{{ task.priority }}</span>
          </template>

          <span class="tooltip-font">Priority #1: complete this first!</span>
        </v-tooltip>
        <span v-else>{{ task.priority }}</span>
      </v-btn>
    </v-card-text>
    <v-card-text class="flex-row align-center">
      <div style="text-transform: capitalize">
        {{ task.name }}
      </div>

      <div
        v-if="task.due_on"
        style="margin-top: 10px"
      >
        <strong>Due on:</strong> {{ task.due_on }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from '@axios'
import {
  mdiCheckboxBlank,
  mdiCheckboxMarked,
  mdiDelete,
  mdiDeleteOutline,
  mdiDownload,
  mdiTooltipEdit,
} from '@mdi/js'
import { reactive } from '@vue/composition-api'
import TaskActions from '@/components/project/TaskActions.vue'
import TaskAttachments from '@/components/project/TaskAttachments.vue'
import TaskDetails from '@/components/project/TaskDetails.vue'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'
import { useUser } from '@/composables/user/user'

export default {
  name: 'TaskItem',
  components: { TaskAttachments, TaskActions, TaskDetails },
  props: { task: Object },
  setup(props) {
    const state = reactive({
      isLoading: false,
      isUploading: false,
      files: [],
    })

    const { userType } = useUser()

    const taskId = props.task.id
    const { setActiveTaskId, updateTask } = useTasks()
    const projectId = useRouter().routeParams().id

    const taskUrl = `projects/${projectId}/tasks/${taskId}`

    const colorFromPriority = () => {
      if (props.task.priority == 'High') return '#EB5757'
      if (props.task.priority == 'Medium') return '#FFC207'
      return '#30D988'
    }

    async function toggleStatus() {
      try {
        state.isLoading = true
        const response = await axios.patch(taskUrl, {
          completed: !props.task.completed,
        })
        updateTask(response.data)
      } catch (err) {
        console.log(err)
      } finally {
        state.isLoading = false
      }
    }

    return {
      state,
      userType,
      toggleStatus,
      colorFromPriority,

      setActiveTaskId,

      icons: {
        mdiDeleteOutline,
        mdiCheckboxMarked,
        mdiCheckboxBlank,
        mdiDownload,
        mdiDelete,
        mdiTooltipEdit,
      },
    }
  },
}
</script>

<style lang="scss">
.task-priority.High {
  color: #fff;
}

.task-priority::before {
  display: none;
}
.theme--light.v-btn:hover::before {
  opacity: 0 !important;
}
</style>
