<template>
  <div class="dashboard__content">
    <div class="d-flex flex-row align-center mb-6">
      <h2 class="cursive-font black--text">
        Projects
      </h2>
      <v-btn
        v-if="userType == 'client'"
        class="ml-auto py-2"
        color="primary"
        @click="isCreateDialogOpen = true"
      >
        Add Project
      </v-btn>
    </div>

    <div
      v-show="isLoading"
      class="text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>

    <v-card
      v-show="!projects.length && !isLoading"
      class="mb-6 d"
    >
      <v-card-text class="align-self-center">
        No projects created
      </v-card-text>
    </v-card>

    <div
      v-show="projects.length && !isLoading"
      class="d-flex flex-wrap flex-row user-projects"
    >
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @projectDeleted="deleteProject"
      />
    </div>

    <create-project-dialog
      :is-open="isCreateDialogOpen"
      @close="isCreateDialogOpen = false"
      @projectCreated="addProject"
    />

  </div>
</template>

<script>
import axios from '@axios'
import { onMounted, ref } from '@vue/composition-api'
import CreateProjectDialog from '@/components/projects/CreateProjectDialog.vue'
import ProjectCard from '@/components/projects/ProjectCard.vue'
import { useUser } from '@/composables/user/user'

export default {
  name: 'Projects',
  components: {
    CreateProjectDialog,
    ProjectCard,
  },
  setup() {
    const isLoading = ref(true)
    const isCreateDialogOpen = ref(false)
    const projects = ref([])
    const { userType } = useUser()

    const addProject = proj => projects.value.push(proj)
    const deleteProject = projId => {
      projects.value = projects.value.filter(p => p.id != projId)
    }

    async function initDashboard() {
      try {
        const response = await axios.get('/projects')
        console.log(response)
        projects.value = response.data
      } catch (err) {
        console.log(err.response)
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      initDashboard()
    })

    return {
      isCreateDialogOpen,
      isLoading,
      projects,
      addProject,
      deleteProject,
      userType,
    }
  },
}
</script>

<style></style>
