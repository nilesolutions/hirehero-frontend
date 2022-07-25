<template>
  <div class="d-flex col-12 heading-box">
    <v-card-text class="" style="padding-top: 20px">
  
      <div class="group">

      
      <h2 class="d-block" style="text-transform: capitalize">{{ task.name }}</h2>

      <div class="mt-4">

        <v-btn
          class=""
          :class="{ 'btn-high': task.priority == 'High' }"
          x-small
          depressed
          :color="colorFromPriority()"
        >{{ task.priority }}
        </v-btn>

        <v-btn class="toggle-task-btn ml-4" :class="{
        'incomplete' : !task.completed
      }" small @click="toggleStatus" :loading="state.isLoading">
        Mark as {{ task.completed ? "Uncomplete" : "Complete" }}
        <v-icon class="ml-2" small :color="task.completed ? '#4CAF' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
        </v-btn>

      </div>
</div>
      
        
      
      

 

      <v-btn class="ml-auto close-btn" icon @click="setActiveTaskId('')" :disabled="state.isLoading">
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card-text>
  </div>
</template>

<script>
import {useRouter} from "@/composables/router";
import {useTasks} from "@/composables/tasks/tasks";
import axios from "@axios";
import {mdiCheckboxBlank, mdiCheckboxMarked, mdiClose} from "@mdi/js";
import {reactive} from "@vue/composition-api";

export default {
  name: "TaskHeader",
  setup() {
    const {activeTask, updateTask, setActiveTaskId} = useTasks();
    const state = reactive({
      isLoading: false,
    });

    const projectId = useRouter().routeParams().id;
    const taskId = activeTask.value.id;
    const taskUrl = `projects/${projectId}/tasks/${taskId}`;

    const colorFromPriority = () => {
      if (activeTask.value.priority == "High") return "#EB5757";
      if (activeTask.value.priority == "Medium") return "#FFC207";
      return "#30D988";
    };

    async function toggleStatus() {
      try {
        state.isLoading = true;
        var response = await axios.patch(taskUrl, {
          completed: !activeTask.value.completed,
        });
        updateTask(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      colorFromPriority,
      task: activeTask,
      toggleStatus,
      setActiveTaskId,

      icons: {
        mdiCheckboxMarked,
        mdiCheckboxBlank,
        mdiClose,
      },
    };
  },
};
</script>

<style scoped>

.group{
  width: 100%;
  display: flex;
  flex-direction: column;
}


.heading-box{
  position: relative;
}
.close-btn{
  position: absolute;
  right: 20px;
  top: 20px;

}

.btn-high {
  color: white;
}

#task-btn.complete-hover:hover {
  background: rgba(48, 217, 136, 0.2) !important;
}

.toggle-task-btn:hover {
  background: rgba(48, 217, 136, 0.2) !important;
}
@media (max-width:767px) {
 
}
</style>
