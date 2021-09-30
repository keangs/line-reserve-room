<template>
  <div>
    <v-sheet class="mx-auto" max-width="900">
      <v-slide-group
        v-model="model"
        class="pa-4"
        mandatory
        show-arrows
        prev-icon="mdi-chevron-left-circle-outline"
        next-icon="mdi-chevron-right-circle-outline"
      >
        <v-slide-item v-for="n in events" :key="n.key">
          <v-card class="ma-2" width="300">
            <v-card-text>
              <p class="text-h4 text--primary">
                {{ n.name }}
              </p>
              <v-col class="text--primary">
                <v-row>
                  วันที่: {{ general.displayDate(n.start, true, false) }}
                </v-row>
                <v-row>
                  เวลา: {{ general.displayDate(n.start, false, true) }} -
                  {{ general.displayDate(n.end, false, true) }}
                </v-row>
              </v-col>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error">
                ยกเลิกการจอง
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import * as general from "@/js/general.js";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const db = firebase.database();
var reserveRef = db.ref("/reserve");

export default {
  data: () => ({
    general,
    isMounted: false,
    model: null,
    events: []
  }),
  mounted() {
    this.getEvent();
    this.isMounted = true;
  },
  methods: {
    deleteReserve(event) {
      if (event.key == undefined) return;
      reserveRef.child(event.key).remove();
      if (this.$liff.isInClient()) {
        let msg = `ยกเลิกการจองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${
          event.name
        }\nวันที่: ${general.displayDate(
          event.start,
          true,
          false
        )}\nเวลา: ${general.displayDate(
          event.start,
          false,
          true
        )} - ${general.displayDate(event.end, false, true)}`;
        this.sendMsg(msg);
      }
    },
    getEvent() {
      reserveRef.on("value", snapshot => {
        let events = [];
        for (var key in snapshot.val()) {
          let item = snapshot.val()[key];
          item.key = key;
          item.start = new Date(item.start * 1000);
          item.end = new Date(item.end * 1000);
          events.push(item);
        }

        this.events = events;
        console.log(this.events);
      });
    }
  }
};
</script>

<style></style>
