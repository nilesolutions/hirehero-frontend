<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">
      Activity
    </h2>
    <time-tracking />
  </div>
</template>

<script>
import TimeTracking from '@/components/activity/TimeTracking.vue'
import ScreenshotsTracking from '@/components/activity/ScreenshotsTracking.vue'

export default {
  name: 'Activity',
  components: {
    TimeTracking,
    ScreenshotsTracking,
  },
}
</script>

<style></style>
