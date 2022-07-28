import '@stripe/stripe-js'
import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import '@axios'
import Vue from 'vue'
import VuetifyConfirm from 'vuetify-confirm'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

// Import vuetify confirm here instead of plugin file
// to pass vuetify instance to it
Vue.use(VuetifyConfirm, { vuetify })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
