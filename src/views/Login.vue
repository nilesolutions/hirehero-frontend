<template>
  <div class="auth-wrapper auth-v2">
    <div class="auth-inner">
      <router-link to="/" class="brand-logo d-flex align-center">
        <v-img
          :src="appLogo"
          max-height="30px"
          max-width="150px"
          alt="logo"
          contain
          class="me-3"
        />

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
            />
          </div>
        </v-col>

        <v-col lg="6" class="d-flex align-center auth-bg pa-10 pb-0">
          <v-row>
            <v-col cols="12" sm="8" md="6" lg="12" class="mx-auto">
              <v-card flat>
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
                    />

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
                    />

                    <div class="d-flex align-center justify-space-between flex-wrap">
                      <v-checkbox hide-details label="Remember Me" class="mt-0"> </v-checkbox>

                      <a class="ms-3 text-decoration-underline" href="#"> Forgot Password? </a>
                    </div>
                    <!--google site recaptcha-->
                    <vue-recaptcha
                      class="mt-5"
                      :sitekey="siteKey"
                      @verify="captchaVerifyMethod"
                      @expired="setCaptchaAsNotVerified"
                      @error="setCaptchaAsNotVerified"
                    />
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
                  <br />
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
import { VueRecaptcha } from 'vue-recaptcha'
import axios from '@axios'
import { mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import themeConfig from '@themeConfig'
import { ref } from '@vue/composition-api'
import { usePusher } from '@/composables/pusher'
import { RECAPTCHA_SITE_KEY } from '../config'

export default {
  components: { VueRecaptcha },
  setup() {
    const { updateAuthCreds } = usePusher()
    const isPasswordVisible = ref(false)
    const isLoading = ref(false)
    const errorMsg = ref('')
    const email = ref('')
    const password = ref('')
    const siteKey = ref(RECAPTCHA_SITE_KEY)
    const isCaptchaVerified = ref(false)

    async function login() {
      try {
        if (isLoading.value) return
        if (!isCaptchaVerified.value) {
          errorMsg.value = 'Please verify you are not a robot.'
          return
        }
        errorMsg.value = ''
        isLoading.value = true
        const response = await axios.post('/login', {
          email: email.value,
          password: password.value,
        })
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('userData', JSON.stringify(response.data.userData))
        updateAuthCreds()
        this.$router.push({ name: 'dashboard' })
      } catch (err) {
        errorMsg.value = err.response.data.message
      } finally {
        isLoading.value = false
      }
    }

    function captchaVerifyMethod(response) {
      // eslint-disable-next-line no-unneeded-ternary
      isCaptchaVerified.value = response ? true : false
    }

    function setCaptchaAsNotVerified() {
      isCaptchaVerified.value = false
    }

    return {
      isPasswordVisible,
      email,
      password,
      errorMsg,
      isLoading,
      siteKey,
      isCaptchaVerified,

      // Icons
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },

      // themeConfig
      appName: themeConfig.app.name,
      appLogo: themeConfig.app.logo,
      // eslint-disable-next-line global-require
      loginBg: require('@/assets/images/login.svg'),
      login,
      captchaVerifyMethod,
      setCaptchaAsNotVerified,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@core/preset/preset/pages/auth.scss";
.auth-submit-btn {
  border-radius: 0;
}

@media (max-width: 767px) {
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
