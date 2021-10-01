import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'

import DatePicker from "@/components/DatePicker.vue"
Vue.component("DatePicker", DatePicker)

import TimePicker from "@/components/TimePicker.vue"
Vue.component("TimePicker", TimePicker)

import firebase from "firebase/compat/app";
firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "reservelinebot.firebaseapp.com",
  databaseURL:
    "https://reservelinebot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reservelinebot",
  storageBucket: "reservelinebot.appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MSG_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
});
Vue.prototype.$firebase = firebase

Vue.prototype.$liff = window.liff
Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
