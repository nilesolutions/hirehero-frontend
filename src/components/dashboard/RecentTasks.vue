<template>
  <div class="d-flex flex-column col-12">
    <v-card :loading="state.isLoading">
      <v-card-title>
        <span>Recent Tasks</span>
        <v-spacer></v-spacer>
        <router-link to="projects"> See Details </router-link>
      </v-card-title>

      <v-card-text>
        <v-data-table :items="state.tableData" :headers="headers">
          <template v-slot:item.created_at="{ item }">
            <span>{{ new Date(item.created_at).toLocaleString() }}</span>
          </template>

          <template v-slot:item.completed="{ item }">
            <span>{{ item.completed ? "Completed" : "Not Completed" }}</span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, onMounted } from "@vue/composition-api";

export default {
  name: "RecentTasks",

  setup() {
    const headers = [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Date",
        value: "created_at",
      },
      {
        text: "Priority",
        value: "priority",
      },
      {
        text: "Status",
        value: "completed",
      },
    ];

    const state = reactive({
      isLoading: false,
      tableData: [],
    });

    onMounted(() => fetchRecentTasks());

    async function fetchRecentTasks() {
      try {
        state.isLoading = true;
        const { data } = await axios.get("stats/recent-tasks");
        state.tableData = data;
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      headers,
    };
  },
};
</script>

<style></style>
