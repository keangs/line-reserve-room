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
    console.log(window.location);
    let params = getURLParams(window.location.href);
    console.log(params);
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
