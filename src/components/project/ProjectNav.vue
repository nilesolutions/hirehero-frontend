<template>
  <div class="my-2 d-flex flex-row align-center">
    <router-link class="mr-4" to="/projects">
      <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
    </router-link>
    <h2 class="cursive-font black--text">{{ projectName }}</h2>

    <div class="ml-auto" v-if="userType == 'client'">
      <v-btn color="primary" large tile @click="isCreateDiagOpen = true">
        Add Task <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </div>

    <create-task-dialog
      :isOpen="isCreateDiagOpen"
      @close="isCreateDiagOpen = false"
    ></create-task-dialog>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useUser } from "@/composables/user";
import { mdiChevronLeft, mdiPlus } from "@mdi/js";
import CreateTaskDialog from "@/components/project/CreateTaskDialog.vue";

export default {
  name: "AddTasks",
  // Use options API to extract from route
  // old Router ver & Vue 2 dont make it easy using composition
  // data() {
  //   return {
  //     projectName: this.$router.currentRoute.params.projectName,
  //   };
  // },
  components: {
    CreateTaskDialog,
  },
  setup() {
    const isCreateDiagOpen = ref(false);
    const userType = useUser().userType();
    const routeParams = useRouter().routeParams();
    console.log(routeParams);
    console.log(userType);

    return {
      isCreateDiagOpen,
      userType,
      projectName: routeParams.projectName,

      icons: {
        mdiChevronLeft,
        mdiPlus,
      },
    };
  },
};
</script>

<style></style>
