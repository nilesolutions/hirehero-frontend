<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title>
        {{ task.name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        {{ task.notes }}
      </v-list-item-subtitle>

      <v-list-item-subtitle> Due on : {{ task.due_on || "Not specified" }} </v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action class="ml-auto">
      <v-btn icon @click="toggleStatus" :loading="isLoading">
        <v-icon :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import axios from "@axios";
import { ref } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import { mdiDeleteOutline, mdiCheckboxMarked, mdiCheckboxBlank } from "@mdi/js";

export default {
  name: "TaskItem",
  props: { task: Object },
  setup(props) {
    const { updateTask } = useTasks();
    const isLoading = ref(false);
    const routeParams = useRouter().routeParams();

    async function toggleStatus() {
      try {
        isLoading.value = true;
        const url = `projects/${routeParams.id}/tasks/${props.task.gid}`;
        var response = await axios.patch(url, {
          completed: !props.task.completed,
        });
        console.log(response.data);
        updateTask(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      toggleStatus,
      isLoading,

      icons: {
        mdiDeleteOutline,
        mdiCheckboxMarked,
        mdiCheckboxBlank,
      },
    };
  },
};
</script>

<style></style>
