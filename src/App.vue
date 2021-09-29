<template>
  <v-app>
    <v-main>
      <Calendar />
      <!-- <Reserve /> -->
    </v-main>
  </v-app>
</template>

<script>
// import Reserve from "./components/Reserve";
import Calendar from "./components/Calendar";
import { getURLParams } from "@/js/general.js";

export default {
  name: "App",

  components: {
    // Reserve,
    Calendar
  },
  data: () => ({
    //
  }),
  mounted() {
    const queryString = decodeURIComponent(window.location.search).replace(
      "?liff.state=",
      ""
    );
    const params = new URLSearchParams(queryString);
    const action = params.get("action");
    console.log("action", action);
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
