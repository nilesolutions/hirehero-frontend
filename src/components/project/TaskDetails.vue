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
import { relativeDate } from "@/helpers";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { computed, ref } from "@vue/composition-api";

export default {
  name: "TaskDetails",
  props: { task: Object },
  setup() {
    const task = useTasks().activeTask.value;
    const showDetails = ref(true);

    const taskFields = computed(() => {
      var dueOnDate = null;
      var creationDate = new Date(task.created_at).toLocaleString();

      const relativeCreationDate = relativeDate(task.created_at);

      if (relativeCreationDate[0] != "0") creationDate += ` , ${relativeCreationDate}`;

      if (task.due_on) {
        const relativeDueDate = relativeDate(task.due_on);
        dueOnDate = `${task.due_on} , ${relativeDueDate}`;
      }

      const fields = {
        "Due on": dueOnDate,
        Notes: task.notes || null,
        "Created at": creationDate,
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
