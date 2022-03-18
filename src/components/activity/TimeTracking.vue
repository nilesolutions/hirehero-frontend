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
          v-model="state.dateRange"
          label="Choose date range"
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="state.dateRange" @change="fetchTableData" range no-title scrollable>
      </v-date-picker>
    </v-menu>

    <v-data-table :items="state.tableData" :headers="state.headers">
      <template v-slot:item.from="{ item }">
        <span>{{ formatDate(item.from) }}</span>
      </template>
      <template v-slot:item.to="{ item }">
        <span>{{ formatDate(item.to) }}</span>
      </template>
      <template v-slot:item.screenshots="{ item }">
        <v-btn
          small
          color="primary"
          depressed
          class="align-self-center"
          @click="setActivityId(item)"
        >
          View
        </v-btn>
      </template>
    </v-data-table>

    <!-- <screenshots-popup
      :activityId="state.pickedActivity"
      @close="clearActivityId"
    ></screenshots-popup> -->
    <v-dialog v-model="state.pickedActivity != ''" @click:outside="clearActivityId">
      <v-card>
        <v-card-title>Activity Details</v-card-title>
        <div v-for="detail in state.activityDetails" :key="detail.activityId">
          <v-card-title>Activity Level</v-card-title>
          <v-card-text> {{ detail.activityLevel }} </v-card-text>

          <v-card-title>Open Apps / Websites</v-card-title>
          <v-card-text>
            {{ detail.applications.map((app) => app.applicationName).join(",") }}
          </v-card-text>

          <v-card-title>Screenshot</v-card-title>
          <v-card-text> <img :src="detail.url" alt="" /> </v-card-text>
          <v-divider></v-divider>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiEye } from "@mdi/js";
import { reactive, ref, onMounted } from "@vue/composition-api";
import ScreenshotsPopup from "@/components/activity/ScreenshotsPopup.vue";

export default {
  name: "TimeTracking",
  components: {
    ScreenshotsPopup,
  },
  setup() {
    const menu = ref(null);
    const state = reactive({
      tableData: [],
      dateRange: [],
      pickedActivity: "",
      activityDetails: [],
      isDatePickerActive: false,
      headers: [
        {
          text: "Start",
          value: "from",
        },
        {
          text: "End",
          value: "to",
        },
        {
          text: "View Screenshots",
          value: "screenshots",
          sortable: false,
        },
      ],
    });

    onMounted(() => {
      var today = new Date();
      var aWeekAgo = new Date();
      aWeekAgo.setDate(today.getDate() - 7);
      state.dateRange = [aWeekAgo.toISOString().split("T")[0], today.toISOString().split("T")[0]];
      fetchTableData();
    });

    const formatDate = (date) => new Date(date * 1000).toLocaleString();
    const clearActivityId = () => {
      state.pickedActivity = "";
      state.activityDetails = [];
    };
    async function setActivityId(val) {
      state.pickedActivity = val.activityId;
      try {
        const response = await axios.get("/tracker/screenshots", {
          params: { activityId: state.pickedActivity },
        });
        state.activityDetails = response.data;
      } catch (err) {
        console.log(err);
      }
    }

    async function fetchTableData() {
      try {
        if (state.dateRange.length < 2) return;
        var [from, to] = state.dateRange;
        var response = await axios.get("/tracker/activity", {
          params: {
            from,
            to,
          },
        });
        state.tableData = response.data;
      } catch (err) {
        console.log(err);
      }
    }

    return {
      state,
      formatDate,
      fetchTableData,
      menu,
      setActivityId,
      clearActivityId,
      icons: {
        mdiEye,
      },
    };
  },
};
</script>

<style></style>
