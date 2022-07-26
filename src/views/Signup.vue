<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <!-- brand logo -->
      <router-link to="/" class="brand-logo">
        <v-img :src="appLogo"   alt="logo" contain class="me-3 logo-img-size" />

        <!-- <h2 class="text--primary mt-3">
          {{ appName }}
        </h2> -->
      </router-link>
      <!--/ brand logo -->

      <v-row class="auth-row ma-0">
        <v-col lg="6" class="d-none d-lg-block position-relative overflow-hidden pa-0">
          <div class="auth-bg-wrapper">
            <!-- <v-img :src="signupBg" alt="" /> -->
            <v-img
              class="mx-auto"
              contain
              max-width="350px"
              max-height="350px"
              :src="require('@/assets/logos/logo-lg.png')"
            />
          </div>
        </v-col>

        <v-col lg="6" class="d-flex align-center auth-bg pa-10 pb-0 signup-form">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">

              <v-card flat class="pb-3">
                <v-card-text class="auth-mob-padding">
                  <p
                    class="cursive-font text-2xl font-weight-semibold text--primary mb-2 signup-title auth-text"
                  >
                    Welcome to HireHeroes!
                  </p>
                  <p class="cursive-font mb-4 auth-text">
                    Join our platform to start optimizing your projects
                  </p>
                </v-card-text>

                <!-- signup form -->
                <v-card-text class="auth-mob-padding auth-mob-padding-2">
                  <v-form @submit.prevent>
                    <v-text-field
                      v-model="state.username"
                      outlined
                      label="Username"
                      placeholder="Username"
                      hide-details="auto"
                      class="mb-4"
                    />

                    <v-text-field
                      v-model="state.email"
                      outlined
                      label="Email"
                      placeholder="Email"
                      hide-details="auto"
                      class="mb-4"
                    />

                    <v-text-field
                      v-model="state.password"
                      outlined
                      :type="state.isPasswordVisible ? 'text' : 'password'"
                      label="Password"
                      placeholder="Password"
                      :append-icon="
                        state.isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
                      "
                      hide-details="auto"
                      class="mb-4"
                      @click:append="state.isPasswordVisible = !state.isPasswordVisible"
                    />

                    <v-text-field
                      v-model="state.confirmPassword"
                      outlined
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      hide-details="auto"
                      class="mb-4"
                      @click:append="state.isPasswordVisible = !state.isPasswordVisible"
                    />

                    <v-select
                      v-model="state.accType"
                      label="I'm looking to"
                      outlined
                      :items="accTypeOpts"
                    />

                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      class="mt-6 auth-submit-btn"
                      :disabled="state.isLoading"
                      :loading="state.isLoading"
                      @click="signup"
                    >
                      Signup
                    </v-btn>

                    <v-card-text v-show="state.errorMsg" class="my-2 text-center">
                      {{ state.errorMsg }}
                    </v-card-text>

                    <v-card-text
                      v-show="state.accCreated"
                      class="text-center pt-2 pb-2 text-decoration-underline"
                    >
                      <router-link to="/login" class="border success--text">
                        Account created successfully. Head to login.
                      </router-link>
                    </v-card-text>
                  </v-form>
                </v-card-text>

                <!-- create new account  -->
                <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
                  <p class="mb-0 me-2">Already have an account?</p>
                  <router-link to="/login"> Login </router-link>
                </v-card-text>
              </v-card>

            </v-col>
          </v-row>
        </v-col>
        
      </v-row>

      <div class="auth-footer">
        <ul>
          <li>Privacy Policy</li>
          <li>Contact us</li>
          <li>FAQ</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import axios from "@axios";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import themeConfig from "@themeConfig";
import { reactive } from "@vue/composition-api";

export default {
  name: "Signup",
  setup() {
    const state = reactive({
      isPasswordVisible: false,
      isLoading: false,
      errorMsg: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      accType: {},
      accCreated: false,
    });

    const accTypeOpts = [
      { value: "client", text: "Hire a virtual assistant" },
      { value: "va", text: "Work as a virtual assistant" },
    ];

    async function signup() {
      try {
        if (state.password != state.confirmPassword) throw "Passwords do not match";

        state.errorMsg = "";
        state.isLoading = true;

        const signupData = {
          username: state.username,
          email: state.email,
          password: state.password,
          type: state.accType,
        };

        const response = await axios.post("/signup", signupData);
        console.log(response.data.email)
        if (response) {
          console.log('Window : ', window.fpr)
          let email = response.data.email;
          window.fpr("referral",{email: email})
        }

        state.username = "";
        state.email = "";
        state.password = "";
        state.confirmPassword = "";
        state.accType = {};

        state.accCreated = true;
      } catch (err) {
        state.errorMsg = err.response.data.message;
      } finally {
        state.isLoading = false;
      }
    }

    return {
      state,
      accTypeOpts,

      // Icons
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },

      // themeConfig
      appName: themeConfig.app.name,
      appLogo: themeConfig.app.logo,
      signupBg: require("@/assets/images/signup.svg"),
      signup,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";

.auth-submit-btn {
 padding: 24px  0 !important;
}
.logo-img-size{
    max-width: 150px !important;
}
@media (max-width:1265px) {
  .auth-mob-padding{
    text-align: center;
  }
  .brand-logo{
  left: 0; 
  right: 0; 
  margin: auto; 
  width: 100% !important;
  }
}

@media (max-width: 767px) {
  .brand-logo{
    display: flex;
  justify-content: center;
  align-items: center;
  }
  .logo-img-size{
    max-width: 200px !important;
    left: -30px;
  }
  .signup-form {
    padding-top: 80px !important;
  }
  .signup-form .signup-title {
    font-size: 1.3rem !important;
  }
  .auth-submit-btn.v-btn:not(.v-btn--round).v-size--default {
    margin-top: 0 !important;
  }
  .auth-text {
    text-align: center;
  }
  p.auth-text {
    margin-bottom: 0 !important;
  }
  .auth-mob-padding {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .auth-footer ul li {
    opacity: 0.6;
    font-weight: 300;
  }
  .auth-mob-padding-2 {
    padding-bottom: 0;
  }
}
</style>
