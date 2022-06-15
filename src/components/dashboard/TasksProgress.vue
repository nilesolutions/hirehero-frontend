<template>
  <div class="d-flex flex-column col-12 col-md-6 dashboard-padding">
    <v-card :loading="state.isLoading">
      <v-card-title>
        <v-icon class="mr-2">{{ icons.mdiChartDonut }}</v-icon>
        Tasks Progress
      </v-card-title>

      <v-card-text>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              outlined
              v-model="state.dateRange"
              label="Choose date range"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="state.dateRange"
            @change="fetchProgress"
            range
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-card-text>

      <v-card-text>
        <vue-apex-charts
          type="donut"
          height="250"
          :options="options"
          :series="state.series"
        ></vue-apex-charts>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { generateWeekRange } from "@/helpers";
import axios from "@axios";
import { mdiChartDonut } from "@mdi/js";
import { onMounted, reactive } from "@vue/composition-api";
import VueApexCharts from "vue-apexcharts";

export default {
  name: "TasksProgress",
  components: { VueApexCharts },
  setup() {
    const state = reactive({
      isLoading: false,
      dateRange: [],
      series: [],
    });

    onMounted(() => {
      state.dateRange = generateWeekRange(1);
      fetchProgress();
    });

    async function fetchProgress() {
      try {
        if (state.dateRange.length < 2) return;
        state.isLoading = true;
        const { data } = await axios.get("stats/tasks", {
          params: {
            from: state.dateRange[0],
            to: state.dateRange[1],
          },
        });
        if (data.tasksCount == 0) state.series = [];
        else state.series = [data.completedTasks, data.uncompletedTasks];
      } catch (err) {
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      options: {
        legend: { position: "bottom" },
        labels: ["Complete Tasks", "Incomplete Tasks"],
        colors: ["#30d988", "#e5ce02"],
        noData: {
          text: "No data for selected period",
        },
      },
      fetchProgress,
      icons: {
        mdiChartDonut,
      },
    };
  },
};
</script>

<style>
.apexcharts-legend .apexcharts-legend-marker {
  display: none;
}

.apexcharts-legend .apexcharts-legend-text::before {
  content: "";
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
}

.apexcharts-legend > div:first-child .apexcharts-legend-text::before {
  background: #30d988;
}

.apexcharts-legend > div:last-child .apexcharts-legend-text::before {
  background: #e5ce02;
}
</style>
