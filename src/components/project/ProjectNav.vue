<template>
  <div class="outer-box">
    <div class="heading-box">
      <router-link class="mr-4" to="/projects">
        <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
      </router-link>
      <h2 class="cursive-font black--text">{{ projectName }}</h2>
    </div>

    <div class="ml-auto btn-box" v-if="userType == 'client'">
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
import { useUser } from "@/composables/user/user";
import { mdiChevronLeft, mdiPlus } from "@mdi/js";
import CreateTaskDialog from "@/components/project/CreateTaskDialog.vue";

export default {
  name: "AddTasks",
  components: {
    CreateTaskDialog,
  },
  setup() {
    const isCreateDiagOpen = ref(false);
    const { userType } = useUser();
    const routeParams = useRouter().routeParams();

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

<style scoped>
.outer-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding:15px 0;
  }
  .heading-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: flex-start;
  }
@media (max-width:767px) {
  .outer-box{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .heading-box{
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .btn-box{
    width: 100%;
    display: flex;
    padding: 20px 0;
  }
  .btn-box > button{
    width: 100%;
    display: flex;
  }
}
</style>
