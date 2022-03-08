<template>
  <div>
    <v-menu
      ref="menu"
      v-model="state.isDatePickerActive"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="state.pickedDate"
          label="Choose date range"
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="state.pickedDate" @change="fetchTableData" range no-title scrollable>
      </v-date-picker>
    </v-menu>

    <v-data-table :items="state.tableData" :headers="state.headers"> </v-data-table>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
  name: "TimeTracking",
  setup() {
    const menu = ref(null);
    const state = reactive({
      tableData: [],
      pickedDate: [],
      isDatePickerActive: false,
      headers: [
        {
          text: "From",
          value: "from",
        },
        {
          text: "To",
          value: "to",
        },
        {
          text: "Note",
          value: "note",
        },
      ],
    });

    onMounted(() => {
      var today = new Date();
      var aWeekAgo = new Date();
      aWeekAgo.setDate(today.getDate() - 7);
      state.pickedDate = [aWeekAgo.toISOString().split("T")[0], today.toISOString().split("T")[0]];
      fetchTableData();
    });

    async function fetchTableData() {
      try {
        if (state.pickedDate.length < 2) return;
        var [from, to] = state.pickedDate;
        var response = await axios.get("/tracker/activity", {
          params: {
            from,
            to,
          },
        });
        console.log(response.data);
        state.tableData = response.data;
      } catch (err) {
        console.log(err);
      }
    }

    return { state, fetchTableData, menu };
  },
};
</script>

<style></style>
