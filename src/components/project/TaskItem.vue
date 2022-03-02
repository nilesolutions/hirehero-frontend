<template>
  <v-card class="mb-2">
    <v-card-title>
      {{ task.name }}
      <v-btn class="ml-auto" icon @click="toggleStatus" :loading="isLoading">
        <v-icon :color="task.completed ? 'primary' : 'grey'">
          {{ task.completed ? icons.mdiCheckboxMarked : icons.mdiCheckboxBlank }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-btn x-small color="" small disabled>{{ task.priority }} Priority</v-btn>
    </v-card-text>

    <v-card-text v-show="task.notes"> Notes : {{ task.notes }} </v-card-text>
    <v-card-text v-show="task.due_on"> Due on : {{ task.due_on }} </v-card-text>

    <task-attachments
      v-show="task.attachments.length"
      :attachments="task.attachments"
      :parentTask="task.id"
    ></task-attachments>

    <v-card-actions>
      <v-btn icon x-small>
        <v-icon>{{ icons.mdiTooltipEdit }}</v-icon>
      </v-btn>
      <v-btn icon x-small>
        <v-icon>{{ icons.mdiDelete }} </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "@axios";
import TaskAttachments from "@/components/project/TaskAttachments.vue";
import { ref } from "@vue/composition-api";
import { useRouter } from "@/composables/router";
import { useTasks } from "@/composables/tasks";
import {
  mdiDeleteOutline,
  mdiCheckboxMarked,
  mdiCheckboxBlank,
  mdiDownload,
  mdiDelete,
  mdiTooltipEdit,
} from "@mdi/js";

export default {
  name: "TaskItem",
  props: { task: Object },
  components: { TaskAttachments },
  setup(props) {
    const { updateTask } = useTasks();
    const isLoading = ref(false);
    const params = useRouter().routeParams();

    async function toggleStatus() {
      try {
        isLoading.value = true;
        const url = `projects/${params.id}/tasks/${props.task.id}`;
        var response = await axios.patch(url, {
          completed: !props.task.completed,
        });
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
        mdiDownload,
        mdiDelete,
        mdiTooltipEdit,
      },
    };
  },
};
</script>

<style lang="scss"></style>
