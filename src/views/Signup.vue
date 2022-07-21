<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <!-- brand logo -->
      <router-link to="/" class="brand-logo d-flex align-center">
        <v-img
          :src="appLogo"
          max-height="30px"
          max-width="150px"
          alt="logo"
          contain
          class="me-3"
        ></v-img>

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
            ></v-img>
          </div>
        </v-col>

        <v-col lg="6" class="d-flex align-center auth-bg pa-10 pb-0 signup-form">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat>
                <v-card-text class="auth-mob-padding">
                  <p
                    class="
                      cursive-font
                      text-2xl
                      font-weight-semibold
                      text--primary
                      mb-2
                      signup-title
                      auth-text
                    "
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
                    <v-stepper v-model="state.e1">
                      <v-stepper-header>
                        <v-stepper-step
                          :complete="state.e1 > 1"
                          step="1"
                        ></v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step
                          :complete="state.e1 > 2"
                          step="2"
                        ></v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step
                          :complete="state.e1 > 3"
                          step="3"
                        ></v-stepper-step>
                      </v-stepper-header>
                      <v-stepper-items>
                        <v-stepper-content step="1">
                          <v-card
                            color="grey lighten-1"
                          >
                            <v-row style="margin-top: 1px">
                              <v-col>
                                <v-text-field
                                  v-model="state.first_name"
                                  outlined
                                  label="First name"
                                  placeholder="First name"
                                  hide-details="auto"
                                  class="mb-4"
                                ></v-text-field>
                              </v-col>

                              <v-col>
                                <v-text-field
                                v-model="state.last_name"
                                outlined
                                label="Last name"
                                placeholder="Last name"
                                hide-details="auto"
                                class="mb-4"
                              ></v-text-field>
                              </v-col>
                            </v-row>
                            
                            <v-text-field
                              v-model="state.username"
                              outlined
                              label="Username"
                              placeholder="Username"
                              hide-details="auto"
                              class="mb-4"
                            ></v-text-field>

                            <v-text-field
                              v-model="state.email"
                              outlined
                              label="Email"
                              placeholder="Email"
                              hide-details="auto"
                              class="mb-4"
                            ></v-text-field>

                            <v-text-field
                              v-model="state.phone"
                              outlined
                              label="Phone"
                              placeholder="(000) 000-0000"
                              hide-details="auto"
                              class="mb-4"
                            ></v-text-field>

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
                            ></v-text-field>

                            <v-text-field
                              v-model="state.confirmPassword"
                              outlined
                              :type="state.isPasswordVisible ? 'text' : 'password'"
                              label="Confirm Password"
                              placeholder="Confirm Password"
                              hide-details="auto"
                              class="mb-4"
                              @click:append="state.isPasswordVisible = !state.isPasswordVisible"
                            ></v-text-field>
                          </v-card>

                          <v-btn
                            color="primary"
                            @click="validateStep1"
                          >
                            Next
                          </v-btn>
                        </v-stepper-content>

                        <v-stepper-content step="2">
                          <v-card
                            color="grey lighten-1"
                          >
                            <v-select
                              style="margin-top: 10px"
                              v-model="state.accType"
                              label="I'm looking to"
                              outlined
                              :items="accTypeOpts"
                            >
                            </v-select>

                            <v-text-field
                              v-if="state.accType == 'client'"
                              v-model="state.number_of_va"
                              outlined
                              type="number"
                              step="1"
                              label="How many Virtual Assistants do you need?"
                              placeholder="0"
                              hide-details="auto"
                              class="mb-4"
                            ></v-text-field>

                            <v-textarea
                              v-if="state.accType == 'client'"
                              v-model="state.va_description"
                              outlined
                              clear-icon="mdi-close-circle"
                              label="What tasks are you needing your VA to handle?"
                              placeholder="Type here"
                              rows="3"
                              row-height="25"
                            ></v-textarea>

                            <v-textarea
                              v-if="state.accType == 'client'"
                              v-model="state.va_assist_application"
                              outlined
                              clear-icon="mdi-close-circle"
                              label="What softwares/applications do you need your VA to use?"
                              placeholder="Type here"
                              rows="3"
                              row-height="25"
                            ></v-textarea>
                          </v-card>

                          <v-btn
                            @click="state.e1 = 1"
                          >
                            Back
                          </v-btn>
                          <v-btn
                            color="primary"
                            @click="validateStep2"
                          >
                            Next
                          </v-btn>
                          
                        </v-stepper-content>

                        <v-stepper-content step="3">
                          <v-card
                            color="grey lighten-1"
                          >
                            <h2>How did you hear about us? </h2>
                            <v-checkbox
                              v-model="state.source"
                              label="Word of Mouth"
                              value="Word of Mouth"
                              style="margin-top: 20px"
                            ></v-checkbox>

                            <v-checkbox
                              v-model="state.source"
                              label="Social Media"
                              value="Social Media"
                              style="margin-top: 0px"
                            ></v-checkbox>

                            <v-checkbox
                              v-model="state.source"
                              label="Website"
                              value="Website"
                              style="margin-top: 0px"
                            ></v-checkbox>

                            <v-checkbox
                              v-model="state.source"
                              label="Other"
                              value="Other"
                              style="margin-top: 0px"
                            ></v-checkbox>
                            
                            <!--other value-->
                            <v-text-field
                                v-if="state.source == 'Other'"
                                v-model="state.other_source"
                                placeholder="Please type another option here"
                                outlined
                                hide-details="auto"
                                class="mb-4"
                              ></v-text-field>
                            <!--mouth of word value-->

                            <h4 v-if="state.source == 'Word of Mouth'">What is the name of the person that referred you to us?</h4>
                            <v-text-field
                                v-if="state.source == 'Word of Mouth'"
                                v-model="state.referred_person"
                                outlined
                                hide-details="auto"
                                class="mb-4"
                              ></v-text-field>
                          </v-card>


                          <v-checkbox
                            class="mt-4"
                            v-model="state.tos_agreement"
                            label="I acknowledge that I have read and agree to the Terms."
                            value="yes"
                            style="margin-top: 0px"
                          ></v-checkbox>

                          <v-btn
                            @click="state.e1 = 2"
                          >
                            Back
                          </v-btn>
                          <v-btn
                            color="primary"
                            type="submit"
                            class="auth-submit-btn"
                            @click="signup"
                            :disabled="state.isLoading"
                            :loading="state.isLoading"
                          >
                            Signup
                          </v-btn>
                          
                        </v-stepper-content>
                      </v-stepper-items>
                    </v-stepper>
                    
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
                  <router-link to="/login">Login</router-link>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" class="mx-auto">
          <div class="auth-footer" style="background: transparent !important;">
            <ul>
              <li>Privacy Policy</li>
              <li>Contact us</li>
              <li>FAQ</li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import axios from "@axios";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import themeConfig from "@themeConfig";
import { reactive, computed } from "@vue/composition-api";

export default {
  name: "Signup",
  setup() {
    const state = reactive({
      isPasswordVisible: false,
      isLoading: false,
      errorMsg: "",
      user_id: "",
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      accType: "",
      number_of_va: 0,
      va_description: "",
      va_assist_application: "",
      source: "",
      other_source: "",
      referred_person: "",
      accCreated: false,
      tos_agreement: 'no',
      e1: 1
    });

    const signupData = computed(() => {
      return {
        first_name: state.first_name,
        last_name: state.last_name,
        username: state.username,
        email: state.email,
        phone_number: state.phone,
        password: state.password,
        type: state.accType,
        number_of_va: state.number_of_va,
        va_description: state.va_description,
        va_assist_application: state.va_assist_application,
        heard_from: state.source,
        heard_from_other: state.other_source,
        referred_person: state.referred_person,
      }
    });

    const accTypeOpts = [
      { value: "client", text: "Hire a virtual assistant" },
      { value: "va", text: "Work as a virtual assistant" },
    ];

    function resetForm (state) {
      state.first_name = "";
      state.last_name = "";
      state.username = "";
      state.email = "";
      state.phone = "";
      state.password = "";
      state.confirmPassword = "";
      state.accType = {};
      state.number_of_va = 0;
      state.va_description = "";
      state.va_assist_application = "";
    }

    async function validateStep1() {
      state.errorMsg = ""
      if (state.first_name == "") {
        state.errorMsg = "First name is required";
      }
      if (state.last_name == "") {
        state.errorMsg = "Last name is required";
      }
      if (state.username == "") {
        state.errorMsg = "Username is required";
      }
      if (state.email == "") {
        state.errorMsg = "Email is required";
      }
      if (state.phone == "") {
        state.errorMsg = "Phone is required";
      }

      if ( state.password.length < 6 ) {
        state.errorMsg = "Too short password";
      }
      if (state.password != state.confirmPassword) {
        state.errorMsg = "Passwords did not match";
      }

      if ( state.errorMsg == "" ) {
        // await axios.post("/signup", signupData.value);
        state.e1 = 2
      }
    }

    function validateStep2() {
      state.errorMsg = ""
      if (state.accType == "") {
        state.errorMsg = "Please select a account type";
      }

      if ( state.accType == 'client' ) {
        if ( state.number_of_va == 0 ) {
          state.errorMsg = "Please set number of VA you need.";
        }
        if ( state.va_description == "" ) {
          state.errorMsg = "Please write down task requirements.";
        }
        if ( state.va_assist_application == "" ) {
          state.errorMsg = "Please write down software requirements.";
        }
      }

      if ( state.errorMsg == "" ) {
        state.e1 = 3
      }
    }

    async function signup() {
      try {
        // validate tos agreement
        if ( state.tos_agreement == 'no' ) {
          let _msg = "You must agree to terms and conditions to signup."
          state.errorMsg = _msg
          throw _msg
        }

        // validate password match
        if (state.password != state.confirmPassword) {
          state.errorMsg = "Passwords did not match"
          throw "Passwords did not match";
        }

        // validate account type selection
        if ( state.accType == "" ) {
          state.errorMsg = '"I am looking to" is required field.'
          throw '"I am looking to" is required field.'
        }

        state.errorMsg = "";
        state.isLoading = true;

        /* 
        [NOT IN USE]:
        This sniphet is replaced by PR: https://bitbucket.org/hydro780/leadheroes-frontend/pull-requests/2
        const signupData = {
          username: state.username,
          email: state.email,
          password: state.password,
          type: state.accType,
        };
        */

        await axios.post("/signup", signupData.value);

        // reset the form
        resetForm(state)

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
      validateStep1,
      validateStep2
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";

.auth-submit-btn {
  border-radius: 0;
}

@media (max-width: 767px) {
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
