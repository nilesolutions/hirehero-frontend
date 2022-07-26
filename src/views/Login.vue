<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <router-link to="/" class="brand-logo">
        <v-img
          :src="appLogo"
          alt="logo"
          contain
          class="me-3 logo-img-size"
        ></v-img>

        <!-- <h2 class="text--primary mt-3">
          {{ appName }}
        </h2> -->
      </router-link>

      <v-row class="auth-row ma-0">
        <v-col lg="6" class="d-none d-lg-block position-relative overflow-hidden pa-0">
          <div class="auth-bg-wrapper">
            <!-- <v-img :src="loginBg" alt="" /> -->
            <v-img
              class="mx-auto"
              contain
              max-width="350px"
              max-height="350px"
              :src="require('@/assets/logos/logo-lg.png')"
            ></v-img>
          </div>
        </v-col>

        <v-col lg="6" class="d-flex align-center auth-bg pa-10 pb-0 login-form">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat class="pb-3">
                <v-card-text class="auth-mob-padding">
                  <p
                    class="cursive-font text-2xl font-weight-semibold text--primary auth-text mb-1"
                  >
                    Welcome Back!
                  </p>
                  <p class="cursive-font auth-text mb-2">
                    Enter your email and password to sign in
                  </p>
                </v-card-text>

                <v-card-text class="auth-mob-padding auth-mob-padding-2">
                  <v-form @submit.prevent>
                    <v-text-field
                      v-model="email"
                      type="email"
                      outlined
                      label="Email"
                      placeholder="Email"
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
<!-- d-flex align-center justify-space-between flex-wrap -->
                    <div class="custom-box">
                      <v-checkbox hide-details label="Remember Me" class="mt-0"> </v-checkbox>

                      <a class="ms-3 text-decoration-underline" href="#"> Forgot Password? </a>
                    </div>

                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      class="mt-6 auth-submit-btn"
                      @click="login"
                      :disabled="isLoading"
                      :loading="isLoading"
                    >
                      Sign in
                    </v-btn>
                    <div v-show="errorMsg != ''" class="my-2 text-center">{{ errorMsg }}</div>
                  </v-form>
                </v-card-text>

                <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
                  <p class="mb-0 me-2">or</p>
                  <br/>
                  <router-link to="/signup"> Register </router-link>
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
import { usePusher } from "@/composables/pusher";
import axios from "@axios";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import themeConfig from "@themeConfig";
import { ref } from "@vue/composition-api";

export default {
  setup() {
    const { updateAuthCreds } = usePusher();
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
        localStorage.setItem("userData", JSON.stringify(response.data.userData));
        updateAuthCreds();
        this.$router.push({ name: "dashboard" });
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
      loginBg: require("@/assets/images/login.svg"),
      login,
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
.custom-box{
  display: flex ;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (max-width:1265px) {
  .auth-mob-padding{

    text-align: center !important;
  }
  .brand-logo{
  left: 0 ; 
  right: 0 ; 
  margin: 0 auto ; 
  width: 100%;
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
  .login-form{
    padding-top: 80px !important;
  }
  
  .auth-text {
    text-align: center;
  }
  .auth-mob-padding {
    
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .auth-mob-padding-2 {
    padding-bottom: 0;
  }

  .auth-footer ul li {
    opacity: 0.6;
    font-weight: 300;
  }
}
</style>
