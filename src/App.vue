<template>
  <v-app>
    <v-main v-if="isMounted">
      <Calendar v-if="action == 'reserve'" />
      <Check v-if="action == 'check'" />
    </v-main>
  </v-app>
</template>

<script>
// import Reserve from "./components/Reserve";
import Calendar from "./components/Calendar";
import Check from "./components/Check";
import vConsole from "@/js/vconsole.min.js";
new vConsole();

export default {
  name: "App",

  components: {
    Check,
    Calendar
  },
  data: () => ({
    isMounted: false,
    action: "reserve"
  }),
  async beforeCreate() {
    this.$liff.init({ liffId: process.env.VUE_APP_LIFF_ID });
    this.$liff.ready.then(async () => {
      if (!(await this.$liff.isLoggedIn())) {
        await this.$liff.login();
      }
    });
  },
  mounted() {
    const db = this.$firebase.database();
    this.$store.state.reserveRef = db.ref("/reserve");
    const queryString = decodeURIComponent(window.location.search).replace(
      "?liff.state=",
      ""
    );
    const params = new URLSearchParams(queryString);
    const action = params.get("action");
    if (action == "check") {
      this.action = "check";
    }
    this.isMounted = true;
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
