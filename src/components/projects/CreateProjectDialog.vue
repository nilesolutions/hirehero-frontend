<template>
  <v-dialog persistent v-model="isOpen">
    <v-card>
      <v-card-title class="justify-center">Create New Project</v-card-title>

      <v-text-field
        v-model="state.name"
        v-on:keyup.enter="createProject"
        class="mx-5"
        outlined
        height="14"
        label="Project Name"
      ></v-text-field>

      <v-card-actions v-if="!state.isLoading" class="justify-center">
        <v-btn color="primary" @click="createProject">Create</v-btn>
        <v-btn color="danger" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
      <div v-else class="text-center my-2">
        <v-progress-circular class="my-2" indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-show="state.errorMsg" class="text-center">Error while creating</div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "@axios";
import { ref, reactive } from "@vue/composition-api";

export default {
  name: "CreateProjectDialog",
  props: ["isOpen"],
  setup(_, { emit }) {
    const state = reactive({
      name: "",
      errorMsg: "",
      isLoading: false,
    });

    const closeDialog = () => emit("close");

    async function createProject() {
      try {
        if (!state.name) return;
        state.errorMsg = "";
        state.isLoading = true;

        var response = await axios.post("/projects", {
          name: state.name,
        });
        console.log(response);
      } catch (err) {
        console.log("failure from function");
        console.log(err);
        //state.errorMsg = err.response.data.message;
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      closeDialog,
      createProject,
    };
  },
};
</script>

<style></style>
