<template>
  <v-dialog max-width="500" @click:outside="closeDialog" v-model="isOpen">
    <v-card class="d-flex flex-column align-center">
      <v-card-title>Add Task</v-card-title>

      <v-form @submit.prevent class="mb-4">
        <v-text-field v-model="state.name" outlined label="Task name" required></v-text-field>

        <v-menu
          ref="menu"
          v-model="state.menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="state.dueOn"
              label="Due on"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="state.dueOn" :min="minDate" @change=""></v-date-picker>
        </v-menu>

        <v-text-field v-model="state.notes" outlined label="Notes"></v-text-field>

        <v-select
          full-width
          label="Priority"
          outlined
          v-model="state.priority"
          :items="priorityOptions"
          @change="setPriority"
        >
        </v-select>

        <v-file-input
          v-model="state.attachments"
          :rules="attachmentsValidation"
          show-size=""
          outlined
          label="Attachments"
          multiple
        ></v-file-input>

        <v-btn
          :loading="state.isLoading"
          :disabled="state.isLoading"
          @click="createTask"
          width="100%"
          color="primary"
          type="submit"
        >
          Add
        </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { validateFileSizes } from "@/helpers";
import { useTasks } from "@/composables/tasks/tasks";
import { reactive, computed } from "@vue/composition-api";
import axios from "@axios";

export default {
  name: "CreateTaskDialog",
  props: ["isOpen"],
  setup(_, { emit }) {
    const state = reactive({
      name: "",
      dueOn: "",
      notes: "",
      priority: "Low",
      attachments: [],
      isLoading: false,
      menu: false,
    });

    const clearFields = () => {
      state.name = "";
      state.dueOn = "";
      state.notes = "";
      state.priority = "Low";
      state.attachments = [];
    };

    const uploadSizeLimit = 100;

    const { addTask } = useTasks();

    const minDate = new Date().toISOString();
    const priorityOptions = ["Low", "Medium", "High"];

    const attachmentsValidation = [(files) => validateFileSizes(files, uploadSizeLimit)];

    const closeDialog = () => {
      emit("close");
      clearFields();
    };

    const setPriority = (e) => {
      state.priority = e;
    };

    const canCreate = computed(() => {
      if (!state.name) return false;

      const filesAboveLimit = state.attachments.some(
        (attachment) => attachment.size > uploadSizeLimit * 1000 * 1000
      );
      if (filesAboveLimit) return false;

      return true;
    });

    function generateFormData() {
      const form = new FormData();
      form.append("name", state.name);
      form.append("due_on", state.dueOn);
      form.append("notes", state.notes);
      form.append("priority", state.priority);
      for (var attachment of state.attachments) {
        form.append("attachments", attachment);
      }

      return form;
    }

    async function createTask() {
      try {
        if (!canCreate.value) return;
        const projectId = this.$route.params.id;
        const form = generateFormData();
        state.isLoading = true;
        var response = await axios.post(`projects/${projectId}/tasks`, form);
        console.log(response);
        addTask(response.data);
        clearFields();
      } catch (err) {
        console.log(err.response);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,

      closeDialog,
      createTask,

      attachmentsValidation,
      minDate,

      setPriority,
      priorityOptions,
    };
  },
};
</script>

<style></style>
