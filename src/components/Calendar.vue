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
        <template v-slot:event="{ event }">
          <div class="v-event-draggable pl-1">
            {{ general.getRoom(event.room).name }}
            {{ general.displayDate(event.start, false, true) }} -
            {{ general.displayDate(event.end, false, true) }}
          </div>
        </template>
      </v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="300px" flat>
          <v-toolbar :color="general.getRoom(selectedEvent.room).color" dark>
            <v-toolbar-title>
              ห้องประชุม {{ general.getRoom(selectedEvent.room).name }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col class="text-left font-weight-bold">
                {{ selectedEvent.detail }}
              </v-col>
            </v-row>
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
                {{ general.displayDate(selectedEvent.start, true, false) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="text-right">
                เวลา:
              </v-col>
              <v-col class="text-left font-weight-bold">
                {{ general.displayDate(selectedEvent.start, false, true) }} -
                {{ general.displayDate(selectedEvent.end, false, true) }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              @click="
                deleteItem(selectedEvent);
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
            <v-carousel
              cycle
              hide-delimiter-background
              show-arrows-on-hover
              height="300"
            >
              <v-carousel-item
                eager
                v-for="(item, i) in roomSelected.image"
                :key="i"
                :src="item.src"
              >
              </v-carousel-item>
            </v-carousel>
          </v-card>
          <div class="pt-5"></div>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col>
                <v-select
                  v-model="roomSelected"
                  :items="general.getRoom()"
                  item-text="name"
                  item-value="room"
                  label="ห้องประชุมที่ต้องการจอง"
                  :return-object="true"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  label="จำนวนที่นั่งในห้องประชุม"
                  :value="roomSelected.seat"
                  readonly
                  class="hide-underline"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              label="รายละเอียดการจอง"
              v-model="detail"
            ></v-text-field>
            <DatePicker label="วันที่จองห้องประชุม" :value.sync="dateStart" />
            <!-- <TimePicker label="เวลาเริ่มต้น" :value.sync="timeStart" />
            <TimePicker label="เวลาสิ้นสุด" :value.sync="timeEnd" /> -->
            <v-digital-time-picker
              label="เวลาเริ่มต้น"
              v-model="timeStart"
              append-icon="mdi-clock-time-four-outline"
            />
            <v-digital-time-picker
              label="เวลาสิ้นสุด"
              v-model="timeEnd"
              append-icon="mdi-clock-time-four-outline"
            />
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
import { sendMsg } from "@/js/line";
import { getEvent, deleteReserve } from "@/js/firebase.js";
// import vConsole from "@/js/vconsole.min.js";
// new vConsole();

export default {
  data: () => ({
    timeValue: "",
    general,
    isMounted: false,
    dialogDate: false,
    cancelReserve: false,
    valid: true,
    roomSelected: {},
    detail: "",
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
    events: []
  }),
  computed: {},

  async mounted() {
    this.roomSelected = general.getRoom(0);
    this.$refs.calendar.checkChange();
    this.events = await getEvent(this.$store.state.reserveRef);
    // console.log("this.events ", this.events);
    this.isMounted = true;
  },
  methods: {
    showReserve() {
      let cDate = this.focus.replaceAll("-", "");
      let [year, month, day] = [
        Number(cDate.substring(0, 4)) + 543,
        cDate.substring(4, 6),
        cDate.substring(6)
      ];
      this.detail = "";
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
    async deleteItem(n) {
      deleteReserve(this.$liff, n, this.$store.state.reserveRef);
      this.events = await getEvent(this.$store.state.reserveRef);
    },
    async addReserve() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.events = await getEvent(this.$store.state.reserveRef);

      if (
        Number(this.timeStart.replace(":", "")) >=
        Number(this.timeEnd.replace(":", ""))
      ) {
        Swal.fire({
          title: "ไม่สามารถจองช่วงเวลาที่ระบุได้",
          text: '"เวลาสิ้นสุด" ต้องมีค่ามากกว่า "เวลาเริ่มต้น"',
          icon: "error",
          confirmButtonColor: "#3085d6"
        });
        return;
      }
      if (
        !this.checkReserve(
          this.roomSelected.room,
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

      let room = general.getRoom(this.roomSelected.room);
      this.$store.state.reserveRef.push({
        userId: this.$store.state.profile.userId,
        userName: this.$store.state.profile.displayName,
        room: this.roomSelected.room,
        name: room.name,
        detail: this.detail.trim(),
        start: general.convertToTimestamp(start),
        end: general.convertToTimestamp(end),
        timed: true
      });

      if (this.$liff.isInClient()) {
        let msg = `จองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${
          room.name
        }\nวันที่: ${general.displayDate(
          start,
          true,
          false
        )}\nเวลา: ${general.displayDate(
          start,
          false,
          true
        )} - ${general.displayDate(end, false, true)}`;
        sendMsg(this.$liff, msg);
      }

      this.events = await getEvent(this.$store.state.reserveRef);
      this.dialogDate = false;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return general.getRoom(event.room).color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
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
      if (event.userId == this.$store.state.profile.userId) {
        this.cancelReserve = true;
      }

      nativeEvent.stopPropagation();
    }
  }
};
</script>

<style scoped>
.hide-underline >>> .v-input__slot::before {
  border-style: none !important;
}
</style>
