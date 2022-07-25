<template>
  <div class="dashboard__content">
    <div class="d-flex flex-row align-center mb-6">
      <h2 class="cursive-font black--text">Projects</h2>
      <v-btn
        v-if="userType == 'client'"
        @click="isCreateDialogOpen = true"
        class="ml-auto py-2"
        color="primary"
      >
        Add Project
      </v-btn>
    </div>

    <div class="text-center" v-show="isLoading">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>

    <v-card class="mb-6 d" v-show="!projects.length && !isLoading">
      <v-card-text class="align-self-center">No projects created</v-card-text>
    </v-card>

    <div class="d-flex flex-wrap flex-row user-projects" v-show="projects.length && !isLoading">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @projectDeleted="deleteProject"
      ></ProjectCard>
    </div>

    <create-project-dialog
      @close="isCreateDialogOpen = false"
      @projectCreated="addProject"
      :isOpen="isCreateDialogOpen"
    ></create-project-dialog>


  </div>
</template>

<script>
import CreateProjectDialog from "@/components/projects/CreateProjectDialog.vue";
import ProjectCard from "@/components/projects/ProjectCard.vue";
import { useUser } from "@/composables/user/user";
import axios from "@axios";
import { onMounted, ref } from "@vue/composition-api";

export default {
  name: "Projects",
  components: {
    CreateProjectDialog,
    ProjectCard,
  },
  setup() {
    const isLoading = ref(true);
    const isCreateDialogOpen = ref(false);
    const projects = ref([]);
    const { userType } = useUser();

    const addProject = (proj) => projects.value.push(proj);
    const deleteProject = (projId) => {
      projects.value = projects.value.filter((p) => p.id != projId);
    };

    async function initDashboard() {
      try {
        var response = await axios.get("/projects");
        console.log(response);
        projects.value = response.data;
      } catch (err) {
        console.log(err.response);
      } finally {
        isLoading.value = false;
      }
    }

    onMounted(() => {
      initDashboard();
    });

    return {
      isCreateDialogOpen,
      isLoading,
      projects,
      addProject,
      deleteProject,
      userType,
    };
  },
};
</script>

<style></style>
