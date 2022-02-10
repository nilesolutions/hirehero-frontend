<template>
  <div>
      <div class="d-flex flex-row align-center mb-6">
        <h2>Projects</h2>
        <v-btn class="ml-auto" color="primary">
          Add
        </v-btn>
      </div>
    <v-card class="mb-6 d">
      <v-card-text class="align-self-center">No projects created</v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'Projects',
  setup() {
    const createDialogOpen = ref(false)
    console.log('Setting up component')
    console.log(createDialogOpen)

    return {
      createDialogOpen,
    }
  },
}
</script>

<style>
</style>