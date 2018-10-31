<template>
  <v-app>
    
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar
      :tile='tile'
      color='grey lighten-4'
      icon
      @click="rightDrawer = !rightDrawer"
      >
        <img :src="photoURL" alt="Avatar">
      </v-avatar>
    </v-toolbar>
    <v-content>
      <HelloWorld/>
      <listsComponent 
      :firebaseUser=firebaseUser
      v-if="renderListOfLists" />
    </v-content>
    
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logOut()">
          <v-list-tile-action>
            <v-icon>logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Log Out</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import listsComponent from "./components/listsComponent";
import { users } from "./firebase";
var firebase = require('firebase');
var provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: "App",
  beforeCreate: function() {
    var vm = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if(!user) {
        firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken; 
        if(result.isNewUser) {
          console.log("Is a New User");
        }
        }).catch(function(error) {
          console.log(error);
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        })
      } else {
        vm.firebaseUser = user;
        vm.photoURL = vm.firebaseUser.providerData[0].photoURL;
        vm.renderListOfLists = true;
      }
    })
  },
  created() {
    
  },
  components: {
    HelloWorld,
    listsComponent
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "bubble_chart",
          title: "Inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ICT Vocab",
      tile: false,
      firebaseUser: {},
      photoURL: {},
      renderListOfLists: false
    };
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    }
  }
};
</script>

