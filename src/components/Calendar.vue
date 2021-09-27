<template>
  <div>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn outlined class="pa-0" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon>
            mdi-chevron-left-circle-outline
          </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon>
            mdi-chevron-right-circle-outline
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar" class="ml-2">
          <h5>{{ $refs.calendar.title }}</h5>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="grey darken-2"
              v-bind="attrs"
              v-on="on"
              class="px-1"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        v-touch="{
          left: () => next(),
          right: () => prev()
        }"
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventColor"
        :type="type"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="showReserve"
        locale="th"
        :short-months="false"
      >
      </v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="300px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="3" class="text-right">
                ผู้จอง:
              </v-col>
              <v-col class="text-left font-weight-bold">
                {{ selectedEvent.userName }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="text-right">
                วันที่:
              </v-col>
              <v-col class="text-left font-weight-bold">
                {{ displayDate(selectedEvent.start, true, false) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="text-right">
                เวลา:
              </v-col>
              <v-col class="text-left font-weight-bold">
                {{ displayDate(selectedEvent.start, false, true) }} -
                {{ displayDate(selectedEvent.end, false, true) }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              @click="
                deleteReserve(selectedEvent);
                selectedOpen = false;
              "
              v-if="cancelReserve"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>

    <v-dialog v-model="dialogDate" max-width="500">
      <v-card>
        <v-container>
          <v-card elevation="14" max-width="600" class="mx-auto">
            <v-carousel v-model="room" height="300">
              <v-carousel-item key="1" src="../image/room-a.jpg">
              </v-carousel-item>
              <v-carousel-item key="2" src="../image/room-b.jpg">
              </v-carousel-item>
              <v-carousel-item
                key="3"
                src="../image/room-c.jpg"
              ></v-carousel-item>
            </v-carousel>
          </v-card>
          <div class="pt-5"></div>
          <v-form ref="form" v-model="valid" lazy-validation>
            <DatePicker label="วันที่จองห้องประชุม" :value.sync="dateStart" />
            <TimePicker label="เวลาเริ่มต้น" :value.sync="timeStart" />
            <TimePicker label="เวลาสิ้นสุด" :value.sync="timeEnd" />
          </v-form>
          <v-btn color="error" class="mr-4" @click="dialogDate = false">
            Cancel
          </v-btn>
          <v-btn color="primary" class="mr-4" @click="addReserve">
            Reserve
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as general from "@/js/general.js";
import Swal from "sweetalert2";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
// import vConsole from "@/js/vconsole.min.js";

// new vConsole();

let liff;
firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "reservelinebot.firebaseapp.com",
  databaseURL:
    "https://reservelinebot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reservelinebot",
  storageBucket: "reservelinebot.appspot.com",
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
});
export const db = firebase.database();
var reserveRef = db.ref("/reserve");

export default {
  data: () => ({
    profile: {
      userId: "test",
      displayName: "test"
    },
    isMounted: false,
    dialogDate: false,
    cancelReserve: false,
    valid: true,
    room: 0,
    dateStart: 0,
    timeStart: "",
    timeEnd: "",
    title: "",
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      day: "Day"
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ]
  }),
  computed: {},
  async beforeCreate() {
    liff = this.$liff;
    liff.ready.then(async () => {
      if (!liff.isLoggedIn()) {
        await liff.login();
      }
    });
    liff.init({ liffId: process.env.LIFF_ID });
    this.profile = await liff.getProfile();
  },
  mounted() {
    this.isMounted = true;
    this.events = [];
    this.$refs.calendar.checkChange();
    this.getEvent();
  },
  methods: {
    async sendMsg(text) {
      if (liff.getContext().type !== "none") {
        await liff.sendMessages([
          {
            type: "text",
            text: text
          }
        ]);
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
      });
    },
    displayDate(timestamp, showDate = true, showTime = true) {
      if (timestamp == undefined) return;
      var cDate = new Date(timestamp);
      cDate = new Date(
        cDate.getFullYear(),
        cDate.getMonth(),
        cDate.getDate(),
        cDate.getHours(),
        cDate.getMinutes()
      );

      if (showDate && showTime) {
        return cDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
          hour: "numeric",
          minute: "numeric"
        });
      }

      if (showDate) {
        return cDate.toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short"
        });
      }

      if (showTime) {
        return cDate.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    },

    showReserve() {
      let cDate = this.focus.replaceAll("-", "");
      let [year, month, day] = [
        Number(cDate.substring(0, 4)) + 543,
        cDate.substring(4, 6),
        cDate.substring(6)
      ];
      this.dateStart = Number(`${year}${month}${day}`);
      this.timeStart = "08:00";
      this.timeEnd = "17:00";
      this.dialogDate = true;
    },

    checkReserve(room, day, month, year, timeStart, timeEnd) {
      year -= 543;
      month -= 1;
      let cReserve = this.events.filter(function(item) {
        let cDate = new Date(item.start);
        if (
          item.room === room &&
          cDate.getDate() === day &&
          cDate.getMonth() === month &&
          cDate.getFullYear() === year
        )
          return item;
      });
      let inTime = 0;
      cReserve.forEach(item => {
        var checkTimeStart = new Date(item.start).getTime();
        var checkTimeEnd = new Date(item.end).getTime();

        let arrayTime = timeStart.split(":");
        var reserveTimeStart = new Date(
          year,
          month,
          day,
          Number(arrayTime[0]),
          Number(arrayTime[1])
        ).getTime();

        arrayTime = timeEnd.split(":");
        var reserveTimeEnd = new Date(
          year,
          month,
          day,
          Number(arrayTime[0]),
          Number(arrayTime[1])
        ).getTime();

        if (
          Math.min(checkTimeStart, checkTimeEnd) <=
            Math.max(reserveTimeStart, reserveTimeEnd) &&
          Math.max(checkTimeStart, checkTimeEnd) >=
            Math.min(reserveTimeStart, reserveTimeEnd)
        ) {
          inTime = true;
          return false;
        }
      });
      if (inTime) return false;
      return true;
    },
    deleteReserve(event) {
      if (event.key == undefined) return;
      reserveRef.child(event.key).remove();
      if (liff.isInClient()) {
        let msg = `ยกเลิกการจองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${
          event.name
        }\nวันที่: ${this.displayDate(
          event.start,
          true,
          false
        )}\nเวลา: ${this.displayDate(
          event.start,
          false,
          true
        )} - ${this.displayDate(event.end, false, true)}`;
        this.sendMsg(msg);
      }
    },
    async addReserve() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.getEvent();
      if (
        !this.checkReserve(
          this.room,
          Number(this.dateStart.toString().substring(6, 8)),
          Number(this.dateStart.toString().substring(4, 6)),
          Number(this.dateStart.toString().substring(0, 4)),
          this.timeStart,
          this.timeEnd
        )
      ) {
        Swal.fire({
          title: "ไม่สามารถจองช่วงเวลาที่ระบุได้",
          text: "เนื่องจากมีการจองอยู่ก่อนแล้ว",
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
        return;
      }
      let start = general.convertToDate(
        general.convertDateYYYYMMDD(this.dateStart, "-", true, false),
        this.timeStart
      );
      let end = general.convertToDate(
        general.convertDateYYYYMMDD(this.dateStart, "-", true, false),
        this.timeEnd
      );
      let room = "";
      let color = "";
      switch (this.room) {
        case 0:
          room = "Room A";
          color = "red";
          break;
        case 1:
          room = "Room B";
          color = "blue";
          break;
        case 2:
          room = "Room C";
          color = "green";
          break;
      }

      reserveRef.push({
        userId: this.profile.userId,
        userName: this.profile.displayName,
        room: this.room,
        name: room,
        start: general.convertToTimestamp(start),
        end: general.convertToTimestamp(end),
        color: color,
        timed: true
      });
      if (liff.isInClient()) {
        let msg = `จองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${room}\nวันที่: ${this.displayDate(
          start,
          true,
          false
        )}\nเวลา: ${this.displayDate(start, false, true)} - ${this.displayDate(
          end,
          false,
          true
        )}`;
        this.sendMsg(msg);
      }

      this.getEvent();
      this.dialogDate = false;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      console.log("prev");
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      this.cancelReserve = false;
      if (event.userId == this.profile.userId) {
        this.cancelReserve = true;
      }

      nativeEvent.stopPropagation();
    }
  }
};
</script>

<style></style>
