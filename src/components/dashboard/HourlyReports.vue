<template>
  <div class="d-flex flex-column col-12 col-md-6 dashboard-padding">
    <v-card :loading="state.isLoading">
      <v-card-title>Hourly Reports</v-card-title>

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
              v-model="state.dateRange.toString().replace(',','  to  ')"
              outlined
              label="Choose date range"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <v-date-picker
            v-model="state.dateRange"
            range
            no-title
            scrollable
            @change="fetchActivity"
          />
        </v-menu>
      </v-card-text>

      <v-card-text>
        <vue-apex-charts
          type="bar"
          height="250px"
          :options="state.options"
          :series="state.series"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from '@axios'
import VueApexCharts from 'vue-apexcharts'

import { onMounted, reactive } from '@vue/composition-api'
import { generateWeekRange } from '@/helpers'

export default {
  name: 'HourlyReports',
  components: { VueApexCharts },
  setup() {
    const state = reactive({
      isLoading: false,
      dateRange: [],
      series: [],
      options: {
        legend: { position: 'bottom' },
        xaxis: {
          categories: [],
        },
        yaxis: {},
        noData: {
          text: 'No data for selected period',
        },
      },
    })

    onMounted(() => {
      state.dateRange = generateWeekRange(1)
      console.log(state.dateRange)
      fetchActivity()
    })

    async function fetchActivity() {
      try {
        if (state.dateRange.length < 2) return
        state.isLoading = true
        const { data: activity } = await axios.get('tracker/activity', {
          params: {
            from: state.dateRange[0],
            to: state.dateRange[1],
          },
        })

        const durations = activity.map(entry => (entry.to - entry.from) / 60)

        state.series = [{ name: 'Duration Worked (Minutes)', data: durations }]

        state.options = {
          ...state.options,
          ...{
            xaxis: {
              categories: activity.map(entry => new Date(entry.from * 1000).toLocaleString()),
            },
          },
        }
      } catch (err) {
      } finally {
        state.isLoading = false
      }
    }

    return {
      state,

      fetchActivity,
    }
  },
}
</script>

<style>
@media (max-width: 767px) {
  .dashboard-padding {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
