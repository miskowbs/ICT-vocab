<template>
  <v-app dark>
    
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
      <studentsComponent 
        v-if="renderStudents"/>
      <listsComponent 
        :userId="firebaseUser.uid"
        v-if="renderListOfLists" />
      <v-dialog
        persistent 
        max-width="320"
        v-model="loginDialog" >
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
          <v-container grid-list-md>
            <v-layout
              fill-height
              justify>
              <v-flex xs12>
                <v-btn
                  flat
                  @click="loginRedirect()">
                  <img
                    src="./assets/btn_google_signin_dark_normal_web.png" />
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        </v-card>
      </v-dialog>
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
import listsComponent from "./components/listsComponent";
import studentsComponent from "./components/studentsComponent";
import { users } from "./firebase";
var firebase = require('firebase');
var provider = new firebase.auth.GoogleAuthProvider();

export default {
  name: "App",
  beforeCreate: function() {
    var vm = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        vm.firebaseUser = user;
        vm.photoURL = vm.firebaseUser.providerData[0].photoURL;
        vm.renderListOfLists = true;

        users.doc(user.uid).get().then((docSnap) => {
          if(!docSnap.exists) {
            users.doc(user.uid).set({
              role: 'student',
              name: vm.firebaseUser.providerData[0].displayName,
              lastSignIn: firebase.firestore.Timestamp.fromDate(new Date()),
              latestChange: firebase.firestore.Timestamp.fromDate(new Date())
            });
          } else {
            users.doc(user.uid).onSnapshot((doc) => {
              if(doc.data().role === "admin") {
                vm.renderStudents = true;
              }
            });
            users.doc(user.uid).update({ 
              lastSignIn: firebase.firestore.Timestamp.fromDate(new Date())
            })
          }
        })
      } else {
        vm.loginDialog = true;
      }
    })
  },
  created() {
    
  },
  components: {
    listsComponent,
    studentsComponent
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "ICT Vocab",
      tile: false,
      firebaseUser: {},
      photoURL: {}, 
      googleLoginImgUrl: "./assets/btn_google_signin_dark_normal_web.png",
      renderListOfLists: false,
      loginDialog: false,
      renderStudents: false
    };
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
      this.renderListOfLists = false;
      this.rightDrawer = false;
    },
    loginRedirect() {
      firebase.auth().signInWithRedirect(provider);
    //   firebase.auth().signInWithPopup(provider).then(function(result) {
    //   var token = result.credential.accessToken; 
    //   if(result.isNewUser) {
    //     console.log("Is a New User");
    //   }
    //   }).catch(function(error) {
    //     console.log(error);
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     var email = error.email;
    //     var credential = error.credential;
    //   })
    // }
    // The above is a signInWithPopup example
    }
  }
}
</script>


