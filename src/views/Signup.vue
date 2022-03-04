<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <!-- brand logo -->
      <router-link to="/" class="brand-logo d-flex align-center">
        <v-img
          :src="appLogo"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          class="me-3"
        ></v-img>

        <h2 class="text--primary">
          {{ appName }}
        </h2>
      </router-link>
      <!--/ brand logo -->

      <v-row class="auth-row ma-0">
        <v-col lg="6" class="d-flex align-center auth-bg pa-10 pb-0">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat>
                <v-card-text>
                  <p class="cursive-font text-2xl font-weight-semibold text--primary mb-2">
                    Welcome to HireHeroes!
                  </p>
                  <p class="cursive-font mb-4">
                    Join our platform to start optimizing your projects
                  </p>
                </v-card-text>

                <!-- signup form -->
                <v-card-text>
                  <v-form @submit.prevent>
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
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      hide-details="auto"
                      class="mb-4"
                      @click:append="state.isPasswordVisible = !state.isPasswordVisible"
                    ></v-text-field>

                    <v-select
                      v-model="state.accType"
                      label="I'm looking to"
                      outlined
                      :items="accTypeOpts"
                    >
                    </v-select>

                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      class="mt-6"
                      @click="signup"
                      :disabled="state.isLoading"
                      :loading="state.isLoading"
                    >
                      Signup
                    </v-btn>

                    <v-card-text v-show="state.errorMsg" class="my-2 text-center">
                      {{ state.errorMsg }}
                    </v-card-text>

                    <v-card-text v-show="state.accCreated" class="text-center my-2">
                      <router-link to="/login" class="border success--text">
                        Account created successfully, go to login.
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

        <v-col lg="6" class="d-none d-lg-block position-relative overflow-hidden pa-0">
          <div class="auth-illustrator-wrapper">
            <!-- triangle bg -->
            <img
              height="362"
              class="auth-mask-bg"
              :src="
                require(`@/assets/images/misc/mask-v2-${
                  $vuetify.theme.dark ? 'dark' : 'light'
                }.png`)
              "
            />

            <!-- tree -->
            <v-img
              height="226"
              width="300"
              class="auth-tree"
              src="@/assets/images/misc/tree-4.png"
            ></v-img>

            <!-- 3d character -->
            <div class="d-flex align-center h-full pa-16 pe-0">
              <v-img
                contain
                max-width="100%"
                height="692"
                class="auth-3d-group"
                :src="
                  require(`@/assets/images/3d-characters/group-${
                    $vuetify.theme.dark ? 'dark' : 'light'
                  }.png`)
                "
              ></v-img>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { reactive } from "@vue/composition-api";
import themeConfig from "@themeConfig";
import axios from "@axios";

export default {
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
      { value: "client", text: "Get Services" },
      { value: "va", text: "Provide Services" },
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

        await axios.post("/signup", signupData);
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
      signup,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";
</style>
