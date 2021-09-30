<template>
  <v-app>
    <v-main>
      <Calendar v-if="action == 'reserve'" />
      <Check v-if="action == 'check'" />
    </v-main>
  </v-app>
</template>

<script>
// import Reserve from "./components/Reserve";
import Calendar from "./components/Calendar";
import Check from "./components/Check";
import firebase from "firebase/compat/app";
import vConsole from "@/js/vconsole.min.js";

new vConsole();

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
export default {
  name: "App",

  components: {
    Check,
    Calendar
  },
  data: () => ({
    action: "check"
  }),
  async beforeCreate() {
    this.$liff.ready.then(async () => {
      if (!this.$liff.isLoggedIn()) {
        // await this.$liff.login();
      }
    });
    this.$liff.init({ liffId: process.env.VUE_APP_LIFF_ID });
    this.$store.state.profile = await this.$liff.getProfile();
    console.log(this.$store.state.profile);
  },
  mounted() {
    const queryString = decodeURIComponent(window.location.search).replace(
      "?liff.state=",
      ""
    );
    const params = new URLSearchParams(queryString);
    const action = params.get("action");
    if (action == "check") {
      this.action = "check";
    }
  }
};
</script>

<style>
#app {
  font-family: "Prompt", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
