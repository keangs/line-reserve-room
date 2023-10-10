<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        append-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        :disabled="disabled"
        v-on="on"
        @change="change"
      />
    </template>
    <v-date-picker v-model="date" locale="th" @input="menu = false" />
  </v-menu>
</template>

<script>
export default {
  props: {
    change: {
      type: Function,
      default: () => 1,
    },
    value: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: "วันที่",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (vm) => ({
    // dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateFormatted: null,
    date: null,
    menu: false,
    modal: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },
  watch: {
    value() {
      this.date = this.parseDate(this.value, "");
    },
    date() {
      this.dateFormatted = this.formatDate(this.date);
      this.$emit("update:value", Number(this.formatToYYYYMMDD(this.date)));
    },
  },
  created() {
    if (!this.value) return null;
    this.date = this.parseDate(this.value, "");
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.toString().split("-");
      return `${day}/${month}/${Number(year) + 543}`;
    },
    formatToYYYYMMDD(date) {
      if (!date) return null;
      const [year, month, day] = date.toString().split("-");
      return `${Number(year) + 543}${month}${day}`;
    },
    parseDate(date, splitter = "/") {
      if (!date) return null;
      const [day, month, year] =
        splitter != ""
          ? date.toString().split("/")
          : [
              date.toString().substring(6),
              date.toString().substring(4, 6),
              date.toString().substring(0, 4),
            ];

      return `${Number(year) - 543}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    },
  },
};
</script>
