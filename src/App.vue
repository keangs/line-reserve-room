<template>
  <v-app>
    <v-main v-if="isMounted">
      <Calendar v-if="action == 'reserve'" />
      <Check v-if="action == 'check'" />
    </v-main>
    <div style="font-size: 12px">v 1.4.0</div>
  </v-app>
</template>

<script>
// import Reserve from "./components/Reserve";
import Calendar from "./components/Calendar";
import Check from "./components/Check";
// import vConsole from "@/js/vconsole.min.js";
// new vConsole();

export default {
  name: "App",

  components: {
    Check,
    Calendar,
  },
  data: () => ({
    isMounted: false,
    action: "reserve",
  }),
  async mounted() {
    const db = this.$firebase.database();
    this.$store.state.reserveRef = db.ref("/reserve");
    const queryString = decodeURIComponent(window.location.search).replace(
      "?liff.state=",
      ""
    );

    // เอาไว้ update data
    // let refQuery = this.$store.state.reserveRef;
    // refQuery
    //   .orderByChild("userName")
    //   .equalTo("เอ๋ : Boosaya")
    //   .on("child_added", function (snapshot) {
    //     let item = snapshot.val();
    //     if (item.start > 1706063400 && item.detail == "ประชุม Avengers") {
    //       console.log(item);
    //       let dateEnd = new Date(item.end * 1000);
    //       dateEnd.setHours(dateEnd.getHours() - 5);
    //       console.log(snapshot.key);
    //       console.log(dateEnd);
    //       let datum = Date.parse(dateEnd);
    //       datum = datum / 1000;
    //       console.log(datum);
    //       // refQuery.child(snapshot.key).update({ end: datum });
    //     }
    //   });

    // เปิดเวลา on เครื่องจริง
    await this.$liff.init({ liffId: process.env.VUE_APP_LIFF_ID });
    await this.$liff.ready;
    if (!this.$liff.isLoggedIn()) {
      await this.$liff.login();
    }
    await this.$liff
      .getProfile()
      .then((profile) => {
        this.$store.state.profile = profile;
        this.isMounted = true;
      })
      .catch((err) => {
        console.log("error", err);
        this.isMounted = true;
      });

    const params = new URLSearchParams(queryString);
    const action = params.get("action");
    if (action == "check") {
      this.action = "check";
    }
    this.isMounted = true;
  },
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
