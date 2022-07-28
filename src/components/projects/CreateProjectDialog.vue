<template>
  <v-dialog
    v-model="isOpen"
    max-width="500"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title class="justify-center">
        Create New Project
      </v-card-title>

      <v-text-field
        v-model="state.name"
        class="mx-5"
        outlined
        height="14"
        label="Project Name"
        @keyup.enter="createProject"
      />

      <v-card-actions class="justify-center">
        <v-btn
          :loading="state.isLoading"
          :disabled="state.isLoading"
          color="primary"
          @click="createProject"
        >Create</v-btn>
        <v-btn
          :disabled="state.isLoading"
          color="danger"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
      </v-card-actions>

      <div
        v-show="state.errorMsg"
        class="text-center"
      >
        Error while creating
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@axios'
import { reactive } from '@vue/composition-api'

export default {
  name: 'CreateProjectDialog',
  props: ['isOpen'],
  setup(_, { emit }) {
    const state = reactive({
      name: '',
      errorMsg: '',
      isLoading: false,
    })

    const closeDialog = () => emit('close')

    async function createProject() {
      try {
        if (!state.name) return
        state.errorMsg = ''
        state.isLoading = true

        const response = await axios.post('/projects', {
          name: state.name,
        })
        emit('projectCreated', {
          ...response.data,
          created_at: Date.now(),
        })
        emit('close')
      } catch (err) {
        console.log('failure from function')
        console.log(err)
        // state.errorMsg = err.response.data.message;
      } finally {
        state.isLoading = false
      }
    }

    return {
      state,
      closeDialog,
      createProject,
    }
  },
}
</script>

<style></style>
