<template>
  <div class="d-flex flex-column col-6">
    <v-card :loading="state.isLoading">
      <v-card-title>
        <v-icon class="mr-2">{{ icons.mdiChartDonut }}</v-icon> Tasks Progress
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
import axios from "@axios";
import { generateWeekRange } from "@/helpers";
import { onMounted, reactive } from "@vue/composition-api";
import VueApexCharts from "vue-apexcharts";
import { mdiChartDonut } from "@mdi/js";

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
      state.dateRange = generateWeekRange();
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
        state.series = [data.completedTasks, data.uncompletedTasks];
      } catch (err) {
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      options: {
        legend: { position: "bottom" },
        labels: ["Complete Tasks", "Uncomplete Tasks"],
      },
      fetchProgress,
      icons: {
        mdiChartDonut,
      },
    };
  },
};
</script>

<style></style>