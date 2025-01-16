<template>
  <div>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn outlined class="pa-0" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon> mdi-chevron-left-circle-outline </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon> mdi-chevron-right-circle-outline </v-icon>
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
              <v-icon right> mdi-menu-down </v-icon>
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
          right: () => prev(),
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
              <v-col cols="3" class="text-right"> ผู้จอง: </v-col>
              <v-col class="text-left font-weight-bold">
                {{ selectedEvent.userName }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="text-right"> วันที่: </v-col>
              <v-col class="text-left font-weight-bold">
                {{ general.displayDate(selectedEvent.start, true, false) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" class="text-right"> เวลา: </v-col>
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
                />
              </v-col>
              <v-col>
                <v-text-field
                  label="จำนวนที่นั่งในห้องประชุม"
                  :value="roomSelected.seat"
                  readonly
                  class="hide-underline"
                />
              </v-col>
            </v-row>
            <v-text-field
              label="รายละเอียดการจอง"
              v-model="detail"
              :rules="[required]"
              hide-details="auto"
            />
            <v-col align="right" class="px-0">
              <v-btn small text @click="showRecurring()">
                <v-icon>mdi-autorenew</v-icon> Make Recurring
              </v-btn>
            </v-col>
            <v-row>
              <v-col>
                <!-- {{ dates }} -->
                <v-date-picker
                  v-model="dates"
                  multiple
                  full-width
                  locale="th-TH"
                  :show-current="false"
                />
              </v-col>
            </v-row>

            <!-- <v-row>
              <v-col>
                <DatePicker
                  label="วันที่จองห้องประชุม"
                  :value.sync="dateStart"
                />
              </v-col>
            </v-row> -->
            <!-- <TimePicker label="เวลาเริ่มต้น" :value.sync="timeStart" />
            <TimePicker label="เวลาสิ้นสุด" :value.sync="timeEnd" /> -->
            <div class="py-1">
              <v-digital-time-picker
                label="เวลาเริ่มต้น"
                v-model="timeStart"
                append-icon="mdi-clock-time-four-outline"
                hide-details="auto"
              />
            </div>
            <div class="pt-1">
              <v-digital-time-picker
                label="เวลาสิ้นสุด"
                v-model="timeEnd"
                append-icon="mdi-clock-time-four-outline"
                hide-details="auto"
              />
            </div>
          </v-form>
          <v-divider class="pb-3"></v-divider>
          <v-btn color="error" class="mr-4" @click="dialogDate = false">
            Cancel
          </v-btn>
          <v-btn color="primary" class="mr-4" @click="addReserve">
            Reserve
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="dialogRecurring" max-width="600">
      <v-form ref="formRecurring">
        <v-card>
          <v-toolbar color="primary" dark>รูปแบบการจอง</v-toolbar>
          <v-card-text>
            <v-row>
              <v-col>
                <v-select
                  label=""
                  :items="recurring.items"
                  v-model="recurring.selected"
                  hide-details="auto"
                  @change="clearRecurring('RecurringSelected')"
                />
              </v-col>
            </v-row>

            <div v-if="recurring.selected == 'Daily'">
              <v-row>
                <v-col>
                  <v-text-field
                    label="ทุก ๆ"
                    suffix="วัน"
                    v-model="recurring.day.amount"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </div>

            <div v-if="recurring.selected == 'Weekly'">
              <v-row>
                <v-col>
                  <v-text-field
                    label="ทุก ๆ"
                    suffix="สัปดาห์"
                    v-model="recurring.week.amount"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-row class="pb-4">
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="1"
                    label="จันทร์"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="2"
                    label="อังคาร"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="3"
                    label="พุธ"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="4"
                    label="พฤหัสบดี"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="5"
                    label="ศุกร์"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="6"
                    label="เสาร์"
                    hide-details="auto"
                  />
                </v-col>
                <v-col class="py-0" sm="3">
                  <v-checkbox
                    v-model="recurring.week.selected"
                    value="7"
                    label="อาทิตย์"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </div>

            <div v-if="recurring.selected == 'Monthly'">
              <v-radio-group
                v-model="recurring.month.selected"
                @change="clearRecurring('Monthly')"
              >
                <v-row class="align-end">
                  <v-col sm="4">
                    <v-radio label="ทุกวันที่ของเดือน" :value="1" />
                  </v-col>
                  <v-col sm="3">
                    <v-text-field
                      label="วันที่"
                      hide-details="auto"
                      v-model="recurring.month.days"
                      :disabled="recurring.month.selected != 1"
                      max="2"
                    />
                  </v-col>
                  <v-col sm="4">
                    <v-text-field
                      label="ทุก ๆ"
                      hide-details="auto"
                      suffix="เดือน"
                      v-model="recurring.month.months"
                      :disabled="recurring.month.selected != 1"
                    />
                  </v-col>
                </v-row>
                <v-row class="align-end">
                  <v-col sm="4">
                    <v-radio label="ทุกวันของเดือน" :value="2" />
                  </v-col>
                  <v-col sm="3">
                    <v-select
                      label="วัน"
                      :items="recurring.month.dayItems"
                      v-model="recurring.month.daySelected"
                      hide-details="auto"
                      :disabled="recurring.month.selected != 2"
                    />
                  </v-col>
                  <v-col sm="3">
                    <v-select
                      label="สัปดาห์"
                      :items="recurring.month.weekItems"
                      v-model="recurring.month.weekSelected"
                      hide-details="auto"
                      :disabled="recurring.month.selected != 2"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col offset-sm="4" sm="3">
                    <v-text-field
                      label="ทุก ๆ"
                      hide-details="auto"
                      suffix="เดือน"
                      v-model="recurring.month.weekMonth"
                      :disabled="recurring.month.selected != 2"
                    />
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

            <v-row>
              <v-col>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0">
                <DatePicker
                  label="ตั้งแต่วันที่"
                  hide-details="auto"
                  :rules="[required]"
                  :value.sync="recurring.date.startDate"
                />
              </v-col>
              <v-col class="pt-0">
                <DatePicker
                  label="ถึงวันที่"
                  hide-details="auto"
                  :value.sync="recurring.date.end.endDate"
                  :rules="[required]"
                  :disabled="recurring.date.end.selected != 1"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-btn color="error" @click="dialogRecurring = false">
              Cancel
            </v-btn>
            <v-btn color="primary" class="mr-4" @click="addRecurring()">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import * as general from "@/js/general.js";
import moment from "moment";
import Swal from "sweetalert2";
import { sendMsg, sendMsgNotify } from "@/js/line";
import { getEvent, deleteReserve } from "@/js/firebase.js";
// import vConsole from "@/js/vconsole.min.js";
// new vConsole();

export default {
  data: () => ({
    dates: [],
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
      day: "Day",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialogRecurring: false,
    recurring: {
      selected: "Daily",
      items: ["Daily", "Weekly", "Monthly"],
      day: {
        amount: 1,
      },
      week: {
        amount: 1,
        selected: [],
      },
      month: {
        days: 1,
        months: 1,
        selected: 1,
        weekItems: ["แรก", "ที่สอง", "ที่สาม", "ที่สี่", "สุดท้าย"],
        dayItems: [
          "จันทร์",
          "อังคาร",
          "พุธ",
          "พฤหัสบดี",
          "ศุกร์",
          "เสาร์",
          "อาทิตย์",
        ],
        weekSelected: "",
        daySelected: "",
        weekMonth: 1,
      },
      date: {
        startDate: 0,
        end: {
          selected: 1,
          endDate: 0,
          amount: 0, //เอาไว้รองรับจำนวนครั้งแต่ยังทำไม่เสร็จ
        },
      },
    },
    events: [],
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
    addRecurring() {
      if (!this.$refs.formRecurring.validate()) {
        return;
      }
      if (this.recurring.selected == "Daily") {
        this.dates = general.generateDateRange(
          1,
          this.recurring.date.startDate,
          this.recurring.date.end.endDate,
          this.recurring.day.amount
        );
        this.dialogRecurring = false;
      }

      if (this.recurring.selected == "Weekly") {
        this.dates = general.generateDateRange(
          2,
          this.recurring.date.startDate,
          this.recurring.date.end.endDate,
          this.recurring.week.amount,
          this.recurring.week.selected
        );
        this.dialogRecurring = false;
      }
      if (this.recurring.selected == "Monthly") {
        if (this.recurring.month.selected == 1) {
          this.dates = general.generateDateRange(
            3,
            this.recurring.date.startDate,
            this.recurring.date.end.endDate,
            this.recurring.month.months,
            [],
            this.recurring.month.days
          );
        } else if (this.recurring.month.selected == 2) {
          this.dates = general.generateDateRange(
            4,
            this.recurring.date.startDate,
            this.recurring.date.end.endDate,
            this.recurring.month.weekMonth,
            [this.recurring.month.daySelected],
            0,
            [this.recurring.month.weekSelected]
          );
        }

        this.dialogRecurring = false;
      }
    },
    showRecurring() {
      this.clearRecurring();
      this.dialogRecurring = true;
    },
    clearRecurring(selected) {
      if (this.$refs.formRecurring) {
        this.$refs.formRecurring.resetValidation();
      }
      switch (selected) {
        case "Daily":
          this.recurring.day.amount = 1;
          break;
        case "Weekly":
          this.recurring.week.amount = 1;
          this.recurring.week.selected = [];
          break;
        case "Monthly":
          this.recurring.month.days = 1;
          this.recurring.month.months = 1;
          this.recurring.month.weekMonth = 1;
          this.recurring.month.weekSelected = "";
          break;
        case "End":
          this.recurring.date.end.endDate = 0;
          this.recurring.date.end.amount = 0;
          break;
        case "RecurringSelected":
          this.recurring.day.amount = 1;
          this.recurring.week.amount = 1;
          this.recurring.week.selected = [];
          this.recurring.month.amount = 1;
          this.recurring.month.selected = 1;
          this.recurring.month.weekSelected = "";
          this.recurring.month.weekMonth = 1;
          break;
        default:
          this.recurring.selected = "Daily";
          this.recurring.day.amount = 1;
          this.recurring.week.amount = 1;
          this.recurring.week.selected = [];
          this.recurring.month.amount = 1;
          this.recurring.month.selected = 1;
          this.recurring.month.weekSelected = "";
          this.recurring.month.weekMonth = 1;
          this.recurring.date.end.selected = 1;
          this.recurring.date.end.endDate = 0;
          this.recurring.date.end.amount = 0;

          const date = moment();
          const buddhistYear = date.year() + 543;
          const formattedDate = `${buddhistYear}${date.format("MMDD")}`;

          this.recurring.date.startDate = Number(formattedDate);
          break;
      }
    },
    required(v) {
      return !!v || "กรุณาระบุ";
    },
    dateFormat(date) {
      return moment(date).format("ddd DD MMM");
    },
    showReserve() {
      this.dates = [this.focus];
      let cDate = this.focus.replaceAll("-", "");
      let [year, month, day] = [
        Number(cDate.substring(0, 4)) + 543,
        cDate.substring(4, 6),
        cDate.substring(6),
      ];
      this.detail = "";
      this.dateStart = Number(`${year}${month}${day}`);
      this.timeStart = "08:00";
      this.timeEnd = "17:00";
      this.dialogDate = true;
    },

    checkReserve(room, day, month, year, timeStart, timeEnd) {
      // year -= 543;
      month -= 1;
      let cReserve = this.events.filter(function (item) {
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
      cReserve.forEach((item) => {
        let checkTimeStart = new Date(item.start).getTime();
        let checkTimeEnd = new Date(item.end).getTime();

        let arrayTime = timeStart.split(":");
        let reserveTimeStart = new Date(
          year,
          month,
          day,
          Number(arrayTime[0]),
          Number(arrayTime[1])
        ).getTime();

        arrayTime = timeEnd.split(":");
        let reserveTimeEnd = new Date(
          year,
          month,
          day,
          Number(arrayTime[0]),
          Number(arrayTime[1])
        ).getTime();

        if (
          Math.min(checkTimeStart, checkTimeEnd) <
            Math.max(reserveTimeStart, reserveTimeEnd) &&
          Math.max(checkTimeStart, checkTimeEnd) >
            Math.min(reserveTimeStart, reserveTimeEnd)
        ) {
          inTime = true;
          return false;
        }
      });
      return !inTime;
    },
    async deleteItem(n) {
      deleteReserve(this.$liff, n, this.$store.state.reserveRef);

      if (n.name == "WS") {
        let period = `วันที่: ${general.displayDate(
          n.start,
          true,
          false
        )}\nเวลา: ${general.displayDate(
          n.start,
          false,
          true
        )} - ${general.displayDate(n.end, false, true)}`;
        let msg = `
ยกเลิกการจองใช้ ${n.name} ชั้น 8
`;
        sendMsgNotify(this.$liff, `${msg}${period}`);
      }
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
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      if (this.dates.length == 0) {
        Swal.fire({
          title: "ไม่สามารถจองช่วงเวลาที่ระบุได้",
          text: "กรุณาระบุวันที่อย่างน้อย 1 วัน",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      let room = general.getRoom(this.roomSelected.room);
      for (const item of this.dates) {
        this.dateStart = moment(item);
        const parsedDate = moment(item, "YYYYMMDD");
        parsedDate.locale("th");
        this.dateStart = parsedDate.format("YYYYMMDD");
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
            html: `
            ห้องประชุม: ${room.name}<br/>
            วันที่: ${parsedDate.format("DD MMMM")} ${
              Number(parsedDate.format("YYYY")) + 543
            }<br/>
            เวลา: ${this.timeStart} - ${this.timeEnd}<br/><br/>
            มีการจองอยู่ก่อนแล้ว`,
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
          return;
        }
      }

      let msg = `จองห้องประชุมเรียบร้อยแล้ว\nห้องประชุม: ${room.name}\n`;
      let period = "";
      for (const [idx, item] of this.dates.entries()) {
        this.dateStart = moment(item);
        const parsedDate = moment(item, "YYYYMMDD");
        parsedDate.locale("th");
        this.dateStart = parsedDate.format("YYYYMMDD");

        let start = general.convertToDate(
          general.convertDateYYYYMMDD(this.dateStart, "-", false, false),
          this.timeStart
        );
        let end = general.convertToDate(
          general.convertDateYYYYMMDD(this.dateStart, "-", false, false),
          this.timeEnd
        );

        this.$store.state.reserveRef.push({
          userId: this.$store.state.profile.userId,
          userName: this.$store.state.profile.displayName,
          room: this.roomSelected.room,
          name: room.name,
          detail: this.detail.trim(),
          start: general.convertToTimestamp(start),
          end: general.convertToTimestamp(end),
          timed: true,
        });

        period += `วันที่: ${general.displayDate(
          start,
          true,
          false
        )}\nเวลา: ${general.displayDate(
          start,
          false,
          true
        )} - ${general.displayDate(end, false, true)}`;
        if (idx != this.dates.length - 1) {
          period += "\n";
        }
      }

      if (this.$liff.isInClient()) {
        sendMsg(this.$liff, `${msg}${period}`);
      }

      if (room.name == "WS") {
        msg = `
มีการจองใช้ ${room.name} ชั้น 8
เพื่อทำกิจกรรม ${this.detail.trim()}
`;
        sendMsgNotify(this.$liff, `${msg}${period}`);
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
    },
  },
};
</script>

<style scoped>
.hide-underline >>> .v-input__slot::before {
  border-style: none !important;
}
</style>
