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
        <v-col lg="8" class="d-none d-lg-block position-relative overflow-hidden pa-0">
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

        <v-col lg="4" class="d-flex align-center auth-bg pa-10 pb-0">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat>
                <v-card-text>
                  <p class="text-2xl font-weight-semibold text--primary mb-2">
                    Welcome to HireHeroes!
                  </p>
                  <p class="mb-2">Please sign-in to your account and start the adventure</p>
                </v-card-text>

                <!-- login form -->
                <v-card-text>
                  <v-form @submit.prevent>
                    <v-text-field
                      v-model="email"
                      outlined
                      label="Email"
                      placeholder="email"
                      hide-details="auto"
                      class="mb-6"
                    ></v-text-field>

                    <v-text-field
                      v-model="password"
                      outlined
                      :type="isPasswordVisible ? 'text' : 'password'"
                      label="Password"
                      placeholder="Password"
                      :append-icon="
                        isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
                      "
                      hide-details="auto"
                      class="mb-2"
                      @click:append="isPasswordVisible = !isPasswordVisible"
                    ></v-text-field>

                    <div class="d-flex align-center justify-space-between flex-wrap">
                      <v-checkbox hide-details label="Remember Me" class="mt-0"> </v-checkbox>

                      <!-- forget link -->
                      <a class="ms-3" href="#"> Forgot Password? </a>
                    </div>

                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      class="mt-6"
                      @click="login"
                      :disabled="isLoading"
                      :loading="isLoading"
                    >
                      Login
                    </v-btn>
                    <div v-show="errorMsg != ''" class="my-2 text-center">{{ errorMsg }}</div>
                  </v-form>
                </v-card-text>

                <!-- create new account  -->
                <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
                  <p class="mb-0 me-2">New on our platform?</p>
                  <a href="#"> Create an account </a>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { ref } from "@vue/composition-api";
import themeConfig from "@themeConfig";
import axios from "@axios";

export default {
  setup() {
    const isPasswordVisible = ref(false);
    const isLoading = ref(false);
    const errorMsg = ref("");
    const email = ref("");
    const password = ref("");

    async function login() {
      try {
        if (isLoading.value) return;
        errorMsg.value = "";
        isLoading.value = true;
        var response = await axios.post("/login", {
          email: email.value,
          password: password.value,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        this.$router.push({ name: "projects" });
      } catch (err) {
        errorMsg.value = err.response.data.message;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      isPasswordVisible,
      email,
      password,
      errorMsg,
      isLoading,

      // Icons
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },

      // themeConfig
      appName: themeConfig.app.name,
      appLogo: themeConfig.app.logo,
      login,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";
</style>
