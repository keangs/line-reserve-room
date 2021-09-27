import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'

import DatePicker from "@/components/DatePicker.vue"
Vue.component("DatePicker", DatePicker)

import TimePicker from "@/components/TimePicker.vue"
Vue.component("TimePicker", TimePicker)

Vue.prototype.$liff = window.liff
Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
