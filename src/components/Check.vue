<template>
  <v-container fill-height class="pa-0">
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
                    <v-btn color="error" @click="deleteItem(n)">
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
import { getEvent, deleteReserve } from "@/js/firebase.js";

export default {
  data: () => ({
    general,
    deleteReserve,
    isMounted: false,
    model: null,
    events: []
  }),
  async mounted() {
    if (await this.$liff.isLoggedIn()) {
      this.$store.state.profile = await this.$liff.getProfile();
    }
    this.events = await getEvent(
      this.$store.state.reserveRef,
      this.$store.state.profile.userId
    );
    this.isMounted = true;
  },
  methods: {
    async deleteItem(n) {
      deleteReserve(this.$liff, n, this.$store.state.reserveRef);
      this.events = await getEvent(
        this.$store.state.reserveRef,
        this.$store.state.profile.userId
      );
    }
  }
};
</script>

<style></style>
