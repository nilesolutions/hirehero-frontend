<template>
  <div class="outer-box">
    <div class="heading-box">
      <router-link
        class="mr-4"
        to="/projects"
      >
        <v-icon>{{ icons.mdiChevronLeft }}</v-icon>
      </router-link>
      <h2 class="cursive-font black--text">
        {{ projectName }}
      </h2>
    </div>

    <div
      v-if="userType == 'client'"
      class="ml-auto btn-box"
    >
      <v-tooltip
        left
        color="error"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            tile
            v-bind="attrs"
            v-on="on"
            @click="isCreateDiagOpen = true"
          >
            Add Task <v-icon>{{ icons.mdiPlus }}</v-icon>
          </v-btn>
        </template>

        <span class="tooltip-font">Create a new task</span>
      </v-tooltip>
    </div>

    <create-task-dialog
      :is-open="isCreateDiagOpen"
      @close="isCreateDiagOpen = false"
    />
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import { mdiChevronLeft, mdiPlus } from '@mdi/js'
import { useRouter } from '@/composables/router'
import { useUser } from '@/composables/user/user'
import CreateTaskDialog from '@/components/project/CreateTaskDialog.vue'

export default {
  name: 'AddTasks',
  components: {
    CreateTaskDialog,
  },
  setup() {
    const isCreateDiagOpen = ref(false)
    const { userType } = useUser()
    const routeParams = useRouter().routeParams()

    return {
      isCreateDiagOpen,
      userType,
      projectName: routeParams.projectName,

      icons: {
        mdiChevronLeft,
        mdiPlus,
      },
    }
  },
}
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
