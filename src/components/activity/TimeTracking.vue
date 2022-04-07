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

    <v-data-table :loading="state.isLoading" :items="state.tableData" :headers="state.headers">
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
          @click="setClickedActivityId(item.activityId)"
        >
          View
        </v-btn>
      </template>
    </v-data-table>

    <screenshots-popup v-if="isDetailsOpen"></screenshots-popup>
  </div>
</template>

<script>
import axios from "@axios";
import { mdiEye } from "@mdi/js";
import { generateWeekRange } from "@/helpers";
import { useActivity } from "@/composables/activity";
import { reactive, ref, onMounted } from "@vue/composition-api";
import ScreenshotsPopup from "@/components/activity/ScreenshotsPopup.vue";

export default {
  name: "TimeTracking",
  components: {
    ScreenshotsPopup,
  },
  setup() {
    const { setClickedActivityId, isDetailsOpen } = useActivity();

    const menu = ref(null);
    const state = reactive({
      tableData: [],
      dateRange: [],
      isDatePickerActive: false,
      isLoading: false,
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
      state.dateRange = generateWeekRange(1);
      fetchTableData();
    });

    const formatDate = (date) => new Date(date * 1000).toLocaleString();

    async function fetchTableData() {
      try {
        if (state.dateRange.length < 2) return;
        state.isLoading = true;
        var [from, to] = state.dateRange;
        var { data } = await axios.get("/tracker/activity", {
          params: {
            from,
            to,
          },
        });
        state.tableData = data;
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      formatDate,
      fetchTableData,
      setClickedActivityId,
      isDetailsOpen,
      menu,
      icons: {
        mdiEye,
      },
    };
  },
};
</script>

<style></style>
