<template>
  <v-card
    :disabled="state.isInitting || state.isLoading"
    :loading="state.isInitting || state.isLoading"
  >
    <v-card-title>
      <span class="cursive-font main-headding">Change your plan</span>
      <v-btn class="ml-auto" icon @click="toggleActivePlanUpdate(false)">
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text v-if="scheduledPlanInfo">
      <v-alert border="left" dense type="info">
        <small>
          Your plan will change to <span class="text-capitalize">{{ scheduledPlanInfo }}</span> at
          the end of your current billing period.
          <br />
        </small>
      </v-alert>

      <v-btn color="warning" @click="cancelScheduledUpdate" outlined small>Cancel Update</v-btn>
    </v-card-text>

    <div v-else>
      <v-card-text class="text-left active-sub">
        <v-subheader class="lg-heading pl-0">Your Active Plan </v-subheader>
        <b class="active-plan-heading">{{ activePlan.name }}</b> <br />
        <b class="active-subscription ">Subscription ends on <sapn class="text-black"> {{ subscriptionEnd }} </sapn></b>
      </v-card-text>

      <v-card-text class="black--text">
        <v-list>
          <v-subheader class="lg-heading padding-left-0" >Avaialble Options</v-subheader>

          <v-list-item-group v-model="state.selectedPlan" color="primary">
            <v-list-item class="bordered mobile-block" v-for="option in updateOptions" :key="option.id">
              <span>{{ option.name }}</span>
              <span class="ml-auto text-capitalize">
                {{ option.amount / 100 }} {{ option.currency.toUpperCase() }} /
                {{ option.interval }}
              </span>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>

      <v-card-text class="text-center lg-text">
        <b class="pb-4">Your plan will change to {{ selectedOptionName }}. </b><br />
        <b>Changes will take effect at end of your current plan</b>
      </v-card-text>

      <v-card-text class="d-flex">
        <v-btn type="submit" class="ml-auto mr-auto" color="primary" @click="handlePlanUpdate">
          Confirm
        </v-btn>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import axios from "@axios";
import { mdiClose } from "@mdi/js";

import { reactive, computed } from "@vue/composition-api";
import { useSubscription } from "@/composables/user/subscription";

export default {
  name: "ChangeActivePlan",
  setup() {
    const {
      toggleActivePlanUpdate,
      activePlan,
      plans,
      subscriptionEnd,
      setScheduledUpdate,
      updatePlanInfo: scheduledPlanInfo,
    } = useSubscription();
    const state = reactive({
      selectedPlan: 0,
      isLoading: false,
      isInitting: false,
    });

    const updateOptions = computed(() => {
      const activePlanId = activePlan.value.id;
      const remainingOptions = plans.value.filter((plan) => plan.id != activePlanId);
      return remainingOptions;
    });

    const selectedOptionName = computed(() => {
      if (state.selectedPlan == undefined) return "";
      const name = updateOptions.value[state.selectedPlan].name;
      return name;
    });

    async function handlePlanUpdate() {
      try {
        state.isLoading = true;
        const newPriceId = updateOptions.value[state.selectedPlan].price_id;
        if (!newPriceId) return;

        const { data: schedule } = await axios.post("/subscriptions/schedule-update", {
          newPriceId,
        });
        setScheduledUpdate(schedule);
        toggleActivePlanUpdate(false);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    async function cancelScheduledUpdate() {
      var confirm = await this.$confirm("Are you sure you want to cancel scheduled update?", {
        buttonFalseText: "Go back",
        buttonTrueText: "Cancel scheduled update",
      });
      if (!confirm) return;

      state.isLoading = true;
      try {
        await axios.post("subscriptions/cancel-scheduled-update");
        setScheduledUpdate({});
        toggleActivePlanUpdate(false);
      } catch (err) {
        console.log(err);
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,

      activePlan,
      toggleActivePlanUpdate,
      subscriptionEnd,
      scheduledPlanInfo,

      updateOptions,
      selectedOptionName,

      handlePlanUpdate,
      cancelScheduledUpdate,

      icons: {
        mdiClose,
      },
    };
  },
};
</script>

<style scoped>
.lg-heading{
  font-size: 18px !important;
  font-weight: 500;
  padding-bottom: 10px;
}
.active-sub{
  padding-left: 36px !important;
}
.active-plan-heading{
  font-size: 18px !important;
}
.active-sub > h4{
  font-size: 18px !important;
}

.main-headding{
  font-size: 22px !important;
}
.text-black{
  color: #f34c57
}
.active-subscription{
  font-size: 16px !important;
}
@media (max-width:767px) {
  .active-sub{
  padding-left: 20px !important;
}
.padding-left-0{
  padding-left: 0;
}
.mobile-block{
  display: block !important;
  padding: 10px 4px !important;
  font-size: 0.95rem
}
.lg-text{
  font-size: 1rem;
}
.active-subscription{
  font-size: 18px !important;
}
}
</style>
