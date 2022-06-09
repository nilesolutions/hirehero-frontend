<template>
  <div>
    <v-card-text> Apply a discount coupon here before filling your billing details.</v-card-text>

    <v-card-text>
      <v-text-field
        v-model="state.promotionCode"
        :disabled="isCouponApplied"
        class="my-4"
        hide-details=""
        outlined
        label="Coupon"
      ></v-text-field
    ></v-card-text>

    <v-card-text v-show="state.errorMsg">
      <v-alert @click="state.errorMsg = ''" dense outlined type="warning" dismissible>
        {{ state.errorMsg }}
      </v-alert>
    </v-card-text>

    <v-card-text v-show="isCouponApplied">
      <v-alert type="success">
        Coupon is valid. Your will a recieve a discount of :
        <b>
          <span v-show="appliedCoupon.percent_off"> {{ appliedCoupon.percent_off }} % off </span>
          <span v-show="appliedCoupon.amount_off" class="text-uppercase">
            {{ appliedCoupon.amount_off / 100 }} {{ appliedCoupon.currency }}
          </span>
        </b>
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :color="isCouponApplied ? 'secondary' : 'primary'"
        @click="isCouponApplied ? setAppliedCoupon({}) : fetchCoupon()"
        :disabled="state.isValidating"
        :loading="state.isValidating"
      >
        {{ isCouponApplied ? "Clear Coupon" : "Apply" }}
      </v-btn>
      <v-btn
        :color="isCouponApplied ? 'primary' : 'secondary'"
        @click="setActiveStep(2)"
        :disabled="state.isValidating"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import axios from "@axios";
import { reactive } from "@vue/composition-api";
import { useCheckout } from "@/composables/user/checkout";

export default {
  name: "ApplyCouponStep",
  setup() {
    const { setAppliedCoupon, isCouponApplied, appliedCoupon, setActiveStep } = useCheckout();

    const state = reactive({
      promotionCode: "",
      isValidating: false,
      errorMsg: "",
    });

    async function fetchCoupon() {
      if (!state.promotionCode) return;

      try {
        state.isValidating = true;

        const { data: coupon } = await axios.get(`/coupons/${state.promotionCode}`);
        console.log(coupon);
        setAppliedCoupon(coupon);
      } catch (err) {
        const status = err.response.status;
        if (status == 403) state.errorMsg = "Code expired";
        else if (status == 400) state.errorMsg = "Code does not exist";
        else state.errorMsg = "Invalid code";

        setAppliedCoupon({});
      } finally {
        state.isValidating = false;
      }
    }

    return {
      state,

      fetchCoupon,
      setAppliedCoupon,
      setActiveStep,
      appliedCoupon,
      isCouponApplied,
    };
  },
};
</script>

<style></style>
