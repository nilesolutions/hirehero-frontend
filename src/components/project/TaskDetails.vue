<template>
  <div class="d-flex flex-column col-12">
    <v-card-actions>
      Details
      <v-btn @click="showDetails = !showDetails" x-small class="ml-auto" icon>
        <v-icon>{{ showDetails ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showDetails">
        <v-card-text v-for="(value, field) in taskFields" :key="field">
          <b> {{ field }}</b> : {{ value }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { useTasks } from "@/composables/tasks/tasks";
import { ref, computed } from "@vue/composition-api";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";

export default {
  name: "TaskDetails",
  props: { task: Object },
  setup() {
    const task = useTasks().activeTask.value;
    const showDetails = ref(true);

    const taskFields = computed(() => {
      const fields = {
        "Due on": task.due_on || null,
        Notes: task.notes || null,
        "Created at": new Date(task.created_at).toLocaleString(),
      };

      const setFields = Object.fromEntries(Object.entries(fields).filter(([_, v]) => v != null));
      return setFields;
    });

    return {
      showDetails,
      taskFields,

      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    };
  },
};
</script>

<style></style>
