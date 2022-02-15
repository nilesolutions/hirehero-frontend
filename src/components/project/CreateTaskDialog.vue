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
import { useTasks } from "@/composables/tasks";
import { reactive } from "@vue/composition-api";
import axios from "@axios";

export default {
  name: "CreateTaskDialog",
  props: ["isOpen"],
  setup(_, { emit }) {
    const state = reactive({
      name: "",
      dueOn: "",
      notes: "",
      isLoading: false,
      menu: false,
    });

    const clearFields = () => {
      state.name = "";
      state.dueOn = "";
      state.notes = "";
    };

    const { addTask } = useTasks();

    const minDate = new Date().toISOString();

    const closeDialog = () => {
      emit("close");
      clearFields();
    };

    async function createTask() {
      try {
        const projectId = this.$route.params.id;
        state.isLoading = true;
        var response = await axios.post(`projects/${projectId}/tasks`, {
          name: state.name,
          due_on: state.dueOn,
          notes: state.notes,
        });
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
      minDate,
    };
  },
};
</script>

<style></style>
