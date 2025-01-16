<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="label"
        append-icon="mdi-clock-time-four-outline"
        readonly
        :disabled="disabled"
        v-bind="attrs"
        v-on="on"
        @change="change"
        :rules="[rules.required]"
      >
      </v-text-field>
    </template>
    <v-time-picker
      format="24hr"
      scrollable
      v-if="menu"
      v-model="time"
      full-width
      @click:minute="$refs.menu.save(time)"
    >
    </v-time-picker>
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
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "เวลา",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "Required.",
      },
      time: null,
      menu: false,
      modal: false,
    };
  },
  watch: {
    value() {
      this.time = this.value;
    },
    time() {
      this.$emit("update:value", this.time);
    },
  },
  created() {
    if (!this.value) return null;
    this.time = this.value;
  },
};
</script>

<style></style>
