<template>
  <v-container fill-height class="pa-0">
    <!-- <v-row no-gutters>
      <v-col>
        <v-slide-group
          v-model="model"
          class="mx-auto"
          mandatory
          show-arrows
          prev-icon="mdi-chevron-left-circle-outline"
          next-icon="mdi-chevron-right-circle-outline"
        >
          <v-slide-item v-for="n in events" :key="n.key">
            <v-card class="ma-2" width="220">
              <v-card-title :class="`${n.color}`">
                <strong style="color:white">{{ n.name }}</strong>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-col class="text--primary" style="font-size:15px">
                  <v-row>
                    <p>
                      <strong>วันที่:</strong>
                      {{ general.displayDate(n.start, true, false) }}
                    </p>
                  </v-row>
                  <v-row>
                    <p>
                      <strong>เวลา:</strong>
                      {{ general.displayDate(n.start, false, true) }} -
                      {{ general.displayDate(n.end, false, true) }}
                    </p>
                  </v-row>
                </v-col>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="error">
                  ยกเลิกการจอง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-slide-item>
        </v-slide-group>
      </v-col>
    </v-row> -->

    <v-row>
      <v-col>
        <div>จำนวนการจอง: {{ events.length }}</div>
        <v-row no-gutters>
          <v-col>
            <v-slide-group
              v-model="model"
              class="mx-auto"
              mandatory
              show-arrows
              prev-icon="mdi-chevron-left-circle-outline"
              next-icon="mdi-chevron-right-circle-outline"
            >
              <v-slide-item v-for="n in events" :key="n.key">
                <v-card class="ma-2" width="220">
                  <v-card-title :class="`${n.color}`">
                    <strong style="color:white">{{ n.name }}</strong>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-col class="text--primary" style="font-size:15px">
                      <v-row>
                        <p>
                          <strong>วันที่:</strong>
                          {{ general.displayDate(n.start, true, false) }}
                        </p>
                      </v-row>
                      <v-row>
                        <p>
                          <strong>เวลา:</strong>
                          {{ general.displayDate(n.start, false, true) }} -
                          {{ general.displayDate(n.end, false, true) }}
                        </p>
                      </v-row>
                    </v-col>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      color="error"
                      @click="
                        line.deleteReserve($liff, n, $store.state.reserveRef)
                      "
                    >
                      ยกเลิกการจอง
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as general from "@/js/general.js";
import * as line from "@/js/line.js";

export default {
  data: () => ({
    general,
    line,
    isMounted: false,
    model: null,
    events: []
  }),
  mounted() {
    this.getEvent();
    this.isMounted = true;
  },
  methods: {
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
    }
  }
};
</script>

<style></style>
