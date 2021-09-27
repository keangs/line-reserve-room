<template>
  <v-container>
    สวัสดี {{ model }}

    <!-- <v-card elevation="14" max-width="600" class="mx-auto">
      <v-carousel v-model="model" height="300">
        <v-carousel-item key="1" src="../image/room-a.jpg"> </v-carousel-item>
        <v-carousel-item key="2" src="../image/room-b.jpg"> </v-carousel-item>
        <v-carousel-item key="3" src="../image/room-c.jpg"></v-carousel-item>
      </v-carousel>
    </v-card>
    <v-row class="pt-5">
      <v-col class="text-center" sm="3" offset-sm="3">
        <v-text-field
          label="ห้องประชุม"
          readonly
          v-model="roomName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-left" sm="3" offset-sm="3">
        <DatePicker label="วันที่จองห้องประชุม" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-left" sm="3" offset-sm="3">
        <TimePicker label="เวลาเริ่มต้น" :value.sync="timeStart" />
      </v-col>
      <v-col class="text-left" sm="3">
        <TimePicker label="เวลาสิ้นสุด" :value.sync="timeEnd" />
      </v-col>
    </v-row> -->

    <div class="hello">
      <div>
        <input type="text" v-model="name" placeholder="NAME" />
        <input type="text" v-model="tel" placeholder="TEL" />
        <button @click="insertToContact(tel, name)">Add</button>
      </div>

      <hr />

      <ul :key="key" v-for="(contact, key) in contacts">
        <li v-if="updateKey === key">
          <input type="text" v-model="updateName" placeholder="NAME" />
          <input type="text" v-model="updateTel" placeholder="TEL" />
          <button @click="updateContact(updateTel, updateName)">Save</button>
        </li>
        <li v-else>
          {{ contact.name }} : {{ contact.tel }}
          <button @click="setUpdateContact(key, contact)">Update</button>
          <button @click="deleteContact(key)">Delete</button>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/database";

firebase.initializeApp({
  apiKey: "AIzaSyAziOgMG_QzcoStHu8eBV8BjD_W1Kaur1o",
  authDomain: "reservelinebot.firebaseapp.com",
  databaseURL:
    "https://reservelinebot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reservelinebot",
  storageBucket: "reservelinebot.appspot.com",
  messagingSenderId: "1031269586313",
  appId: "1:1031269586313:web:8610e060555a781d44fd58"
});
export const db = firebase.database();
var contactRef = db.ref("/contacts");

let liff;
export default {
  name: "Reserve",

  data: () => ({
    contacts: {},
    tel: "",
    name: "",
    updateTel: "",
    updateName: "",
    updateKey: "",
    timeStart: "",
    timeEnd: "",
    model: 0
  }),

  computed: {
    roomName() {
      switch (this.model) {
        case 0:
          return "Room A";
        case 1:
          return "Room B";
        case 2:
          return "Room C";
        default:
          return "";
      }
    }
  },
  beforeCreate() {
    // liff = this.$liff;
    // liff.ready.then(async () => {
    //   if (liff.isLoggedIn()) {
    //     this.getEnvironment();
    //   } else {
    //     await liff.login();
    //   }
    // });
    // liff.init({ liffId: "1656372478-zn7jK4op" });
  },
  methods: {
    insertToContact(tel, name) {
      let data = {
        tel: tel,
        name: name
      };
      contactRef.push(data);
      this.tel = "";
      this.name = "";
    },
    setUpdateContact(key, contact) {
      this.updateKey = key;
      this.updateTel = contact.tel;
      this.updateName = contact.name;
    },
    updateContact(tel, name) {
      contactRef.child(this.updateKey).update({
        tel: tel,
        name: name
      });
      this.updateKey = "";
      this.updateTel = "";
      this.updateName = "";
    },
    deleteContact(key) {
      contactRef.child(key).remove();
    }
  },
  mounted() {
    contactRef.on("value", snapshot => {
      this.contacts = snapshot.val();
    });
  }
};
</script>
