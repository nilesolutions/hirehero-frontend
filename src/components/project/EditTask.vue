<template>
  <div>
    <v-card-title>
      <v-btn
        icon
        class="mr-2"
        @click="toggleEdit(false)"
      >
        <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
      </v-btn>
      <span>Edit Task</span>
    </v-card-title>

    <v-card-text class="align-self-center">
      <v-form
        class="mb-4"
        @submit.prevent
      >
        <v-text-field
          v-model="state.name"
          outlined
          label="Task name"
          required
        />

        <v-menu
          ref="menu"
          v-model="state.menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="state.dueOn"
              label="Due on"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="state.dueOn"
            :min="minDate"
            @change=""
          />
        </v-menu>

        <v-text-field
          v-model="state.notes"
          outlined
          label="Notes"
        />

        <label for="">Priority</label>
        <v-select
          v-model="state.priority"
          full-width
          label="Priority"
          outlined
          :items="priorityOptions"
          @change="setPriority"
        />

        <v-btn
          :loading="state.isUpdating"
          :disabled="state.isUpdating"
          width="100%"
          color="primary"
          type="submit"
          @click="update"
        >
          Update
        </v-btn>
      </v-form>
    </v-card-text>
  </div>
</template>

<script>
import axios from '@axios'
import { mdiChevronLeft } from '@mdi/js'
import { reactive } from '@vue/composition-api'
import { useRouter } from '@/composables/router'
import { useTasks } from '@/composables/tasks/tasks'

export default {
  name: 'EditTask',
  setup() {
    const { toggleEdit, activeTask, updateTask } = useTasks()
    const taskCopy = JSON.parse(JSON.stringify(activeTask.value))
    const projectId = useRouter().routeParams().id

    const state = reactive({
      isUpdating: false,
      name: taskCopy.name,
      notes: taskCopy.notes,
      dueOn: taskCopy.due_on,
      priority: taskCopy.priority,
    })

    const minDate = new Date().toISOString()
    const priorityOptions = ['Low', 'Medium', 'High']
    const setPriority = e => {
      state.priority = e
    }

    async function update() {
      try {
        state.isUpdating = true
        const updateData = {
          name: state.name,
          notes: state.notes,
          priority: state.priority,
          due_on: state.dueOn,
        }
        const { data } = await axios.patch(
          `projects/${projectId}/tasks/${taskCopy.id}`,
          updateData,
        )
        updateTask(data)
        toggleEdit(false)
      } catch (err) {
        console.log(err)
      } finally {
        state.isUpdating = false
      }
    }

    return {
      state,
      update,
      minDate,
      priorityOptions,
      setPriority,

      updateTask,
      toggleEdit,

      icons: {
        mdiChevronLeft,
      },
    }
  },
}
</script>

<style></style>
